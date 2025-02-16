import * as d3 from "d3";
import Svg, {
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  Line,
  Circle,
} from "react-native-svg";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import React, { useState } from "react";

type LineChartProps = {
  data: number[];
  width?: number;
  height?: number;
  xLabels?: string[];
};

function LineChart({ data, width, height, xLabels = [] }: LineChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const screenHeight = Dimensions.get("window").height;

  const chartWidth = width ?? containerWidth;
  const chartHeight = height ?? screenHeight / 3;

  const margin = { top: 20, right: 20, bottom: 20, left: 30 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, innerWidth]);

  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);

  // Calculate dynamic domain with buffer
  let yMin = Math.floor(Math.max(dataMin - 1, 0));
  let yMax = Math.ceil(Math.min(dataMax + 1, 10));

  // If all values are same, show range 0-2
  // if (dataMin === dataMax) {
  //   yMin = 0;
  //   yMax = 2;
  // }

  const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

  const lineGenerator = d3
    .line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveNatural);

  const path = lineGenerator(data);

  // Create an area generator for the fill
  const areaGenerator = d3
    .area<number>()
    .x((_, i) => xScale(i))
    .y0(innerHeight)
    .y1((d) => yScale(d))
    .curve(d3.curveNatural);

  const areaPath = areaGenerator(data);

  const calculateThreshold = (values: number[]) => {
    if (values.length < 2) return Infinity; // Need at least 2 points

    // Calculate mean
    const mean = values.reduce((sum, d) => sum + d, 0) / values.length;

    // Calculate standard deviation
    const squaredDiffs = values.map((d) => Math.pow(d - mean, 2));
    const variance =
      squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Set threshold at mean + 1 standard deviation
    return mean + stdDev;
  };

  const highPainThreshold = calculateThreshold(data);
  const hasSignificantHighPoints = data.some((d) => d > highPainThreshold);

  // Add this function to calculate trend line points
  const calculateTrendLine = (data: number[]) => {
    if (data.length < 2) return []; // Need at least 2 points for a trend

    const n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    data.forEach((y, x) => {
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return [
      { x: 0, y: intercept },
      { x: n - 1, y: slope * (n - 1) + intercept },
    ];
  };

  // Add this before the return statement
  const trendLinePoints = calculateTrendLine(data);
  const trendLinePath = d3
    .line<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))(trendLinePoints);

  const yTicks = d3.range(yMin, yMax + 1, 1); // Creates an array stepping by 1

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width: layoutWidth } = event.nativeEvent.layout;
        setContainerWidth(layoutWidth);
      }}
    >
      <Svg width={chartWidth} height={chartHeight}>
        {/* Define a gradient from blue to transparent */}
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <G transform={`translate(${margin.left},${margin.top})`}>
          {/* Fill Path */}
          {areaPath && (
            <Path
              d={areaPath}
              fill="url(#gradient)" // Use the defined gradient for the fill
            />
          )}

          {/* Line Path */}
          {path && (
            <Path
              d={path}
              fill="none"
              stroke="#2563EBFF"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Show only high pain points */}
          {data
            .map((d, originalIndex) => ({ d, originalIndex })) // Preserve original index
            .filter(({ d }) => d > highPainThreshold)
            .map(({ d, originalIndex }) => (
              <Circle
                key={originalIndex}
                cx={xScale(originalIndex)} // Use original index for positioning
                cy={yScale(d)}
                r={6}
                fill="#FF6B6B"
                // stroke="#FF6B6B"
                strokeWidth={2}
              />
            ))}

          {/* Y-axis ticks */}
          {yTicks.map((tick) => {
            const yCoord = yScale(tick);
            return (
              <React.Fragment key={tick}>
                {/* Small tick line */}
                <Line
                  x1={-5}
                  x2={0}
                  y1={yCoord}
                  y2={yCoord}
                  stroke="gray"
                  strokeWidth={1}
                />
                {/* Tick label */}
                <SvgText
                  x={-10}
                  y={yCoord}
                  fill="gray"
                  fontSize={12}
                  textAnchor="end"
                  alignmentBaseline="middle"
                >
                  {tick}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* X-axis ticks: labeled by index */}
          {xScale.ticks(10).map((tickValue, index) => {
            const i = Math.round(tickValue);
            const xCoord = xScale(i);
            const label = xLabels[i] ?? i.toString();

            return (
              <React.Fragment key={`tick-${index}-${label}`}>
                <Line
                  x1={xCoord}
                  x2={xCoord}
                  y1={innerHeight}
                  y2={innerHeight + 5}
                  stroke="gray"
                  strokeWidth={1}
                />
                <SvgText
                  x={xCoord}
                  y={innerHeight + 18}
                  fill="gray"
                  fontSize={12}
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Optional: Add a threshold line visualization */}
          {/* {hasSignificantHighPoints && (
            <Line
              x1={0}
              x2={innerWidth}
              y1={yScale(highPainThreshold)}
              y2={yScale(highPainThreshold)}
              stroke="#EF4444"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          )} */}

          {/* Trend Line Path */}
          {trendLinePath && (
            <Path
              d={trendLinePath}
              fill="none"
              stroke="#6B7280" // Gray color
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          )}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: "red",
    // borderStyle: "solid",
  },
});

export default LineChart;
