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

  const margin = { top: 20, right: 10, bottom: 20, left: 20 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

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

          {/* Blue dots for data points */}
          {data.map((d, i) => (
            <Circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d)}
              r={8}
              fill="#2563EB"
            />
          ))}

          {/* Y-axis ticks */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => {
            const yCoord = yScale(tick);
            return (
              <React.Fragment key={tick}>
                {/* Small tick line - adjust x2 as desired for length */}
                <Line
                  x1={-5}
                  x2={0}
                  y1={yCoord}
                  y2={yCoord}
                  stroke="gray"
                  strokeWidth={1}
                />
                {/* Tick label - small font */}
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
          {data.map((_, i) => {
            const xCoord = xScale(i);
            const label = xLabels[i] !== undefined ? xLabels[i] : i.toString();

            return (
              <React.Fragment key={i}>
                {/* Small line below the chart */}
                <Line
                  x1={xCoord}
                  x2={xCoord}
                  y1={innerHeight}
                  y2={innerHeight + 5}
                  stroke="gray"
                  strokeWidth={1}
                />
                {/* Tick label - show date or index */}
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
