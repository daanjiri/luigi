import * as d3 from "d3";
import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Circle, Text as SvgText, G } from "react-native-svg";
import { mockData } from "~/lib/mockdata";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
} from "date-fns";
import { Text } from "./ui/text";
import { useTheme } from "@react-navigation/native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const dayLetters = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Heatmap() {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 10; // Same as the container style's padding
  const margin = { top: 40, right: 10, bottom: 10, left: 10 };
  const chartWidth = screenWidth - containerPadding * 2;
  const innerWidth = chartWidth - margin.left - margin.right;
  const cellSize = innerWidth / 7; // fixed cell size based on window width
  const cellPadding = 3; // space between cells
  const chartHeight = margin.top + margin.bottom + cellSize * 6; // fixed height for 6 rows

  // Get current month data from state
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const today = new Date();
  const isCurrentMonth =
    startOfMonth(currentDate).getTime() === startOfMonth(today).getTime();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Map mock data for the current month
  const currentMonthData = mockData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= monthStart && itemDate <= monthEnd;
  });

  // Create lookup object for faster access
  const dataByDay: Record<string, number> = {};
  currentMonthData.forEach((item) => {
    const dateStr = format(new Date(item.date), "yyyy-MM-dd");
    dataByDay[dateStr] = item.level;
  });

  // Create color scale
  const colorScale = d3
    .scaleLinear<string>()
    .domain([0, 5, 10])
    .range(["#3CFF00FF", "#FFFF00FF", "#FF0000FF"]) // From green to yellow to red
    .interpolate(d3.interpolateHcl);

  // Calculate the day position in the grid (row, column)
  const getPosition = (dayDate: Date) => {
    const dayOfWeek = getDay(dayDate); // 0 = Sunday, 6 = Saturday
    const weekOfMonth = Math.floor(
      (dayDate.getDate() - 1 + getDay(monthStart)) / 7
    );

    return {
      x: dayOfWeek * cellSize,
      y: weekOfMonth * cellSize,
    };
  };

  // Calculate the month's first week offset
  const firstDayOffset = getDay(monthStart);

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <TouchableOpacity
          onPress={() => setCurrentDate(addMonths(currentDate, -1))}
        >
          <ChevronLeft size={24} color="gray" style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{format(currentDate, "MMMM yyyy")}</Text>
        <TouchableOpacity
          onPress={() => setCurrentDate(addMonths(currentDate, 1))}
          disabled={isCurrentMonth}
        >
          <ChevronRight
            size={24}
            color={isCurrentMonth ? "lightgray" : "gray"}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      <Svg width={chartWidth} height={chartHeight} style={{ maxWidth: "100%" }}>
        <G transform={`translate(${margin.left},${margin.top})`}>
          {/* Day headers */}
          {dayLetters.map((day, index) => (
            <SvgText
              key={`header-${day}`}
              x={index * cellSize + cellSize / 2}
              y={-10}
              fontSize={12}
              fill="gray"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {day}
            </SvgText>
          ))}

          {/* Calendar cells */}
          {daysInMonth.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const pos = getPosition(date);
            const painLevel = dataByDay[dateStr] || 0;
            const radius = (cellSize - cellPadding * 2) / 2; // compute radius for circle
            const baseColor = painLevel ? colorScale(painLevel) : null;
            const strokeColor = baseColor ? baseColor : "transparent";
            const fillColor = baseColor
              ? `rgba(${d3.rgb(baseColor).r},${d3.rgb(baseColor).g},${
                  d3.rgb(baseColor).b
                },0.5)`
              : "transparent";

            return (
              <G key={dateStr} transform={`translate(${pos.x},${pos.y})`}>
                <Circle
                  cx={cellPadding + radius} // center x
                  cy={cellPadding + radius} // center y
                  r={radius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={2}
                />
                <SvgText
                  x={cellSize / 2}
                  y={cellSize / 2}
                  fontSize={14}
                  fill={colors.text}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {date.getDate()}
                </SvgText>
              </G>
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
    padding: 10,
    maxWidth: "100%", // Add maxWidth constraint
  },
  monthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  arrowIcon: {
    paddingHorizontal: 16,
  },
});
