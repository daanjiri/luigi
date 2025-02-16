import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import LineChart from "../../components/linechart";
import { mockData } from "./mockdata";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  getWeek,
  startOfMonth,
  differenceInWeeks,
  differenceInDays,
} from "date-fns";

// Define a new type for daily pain data
type DailyPain = {
  date: Date | string; // You might mark it as string if your data is string
  level: number;
};

// Add this state definition at the top of your component
type ActiveFilter = "7D" | "LM" | "M" | "Y" | "W" | "LY" | "3M" | null;

const dayLetters = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const LineChartScreen = () => {
  const [weeklyPainData, setWeeklyPainData] = useState<DailyPain[]>(mockData);
  const [tickLabels, setTickLabels] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);

  // Separate filter function
  const applyFilter = (filter: ActiveFilter) => {
    switch (filter) {
      case "7D":
        setWeeklyPainData(mockData.slice(-7));
        setTickLabels(
          mockData.slice(-7).map((item) => {
            const date = new Date(item.date);
            return dayLetters[date.getDay()];
          })
        );
        break;
      case "LM":
        const rawData = mockData.slice(-30);
        const averagedData = [];
        for (let i = 0; i < rawData.length; i += 2) {
          const pair = rawData.slice(i, i + 2);
          averagedData.push({
            date: pair[0].date,
            level: Number(
              (
                pair.reduce((sum, item) => sum + item.level, 0) / pair.length
              ).toFixed(1)
            ),
          });
        }
        setWeeklyPainData(averagedData);
        setTickLabels(
          averagedData.map((item) => {
            const date = new Date(item.date);
            return dayLetters[date.getDay()];
          })
        );
        break;
      case "3M": {
        // Take the most recent 90 days
        const rawData = mockData.slice(-90);
        const weeklyData = [];

        // Group data into weeks (7 days per week) and calculate the weekly average
        for (let i = 0; i < rawData.length; i += 7) {
          const weekData = rawData.slice(i, i + 7);
          const averageLevel = Number(
            (
              weekData.reduce((sum, item) => sum + item.level, 0) /
              weekData.length
            ).toFixed(1)
          );
          weeklyData.push({
            date: weekData[0].date,
            level: averageLevel,
          });
        }

        setWeeklyPainData(weeklyData);

        // Generate tick labels using actual calendar weeks
        const weeklyTickLabels: string[] = [];
        for (const week of weeklyData) {
          const date = new Date(week.date);
          const monthStart = startOfMonth(date);
          const diffInDays = differenceInDays(date, monthStart);
          const weekNumber = Math.min(Math.floor(diffInDays / 7) + 1, 4);
          weeklyTickLabels.push(`W${weekNumber}`);
        }

        setTickLabels(weeklyTickLabels);
        break;
      }
      case "LY": {
        const rawData = mockData.slice(-365); // Get last 365 days
        const monthlyData: { [key: string]: DailyPain[] } = {};

        // Group data by month
        rawData.forEach((item) => {
          const date = new Date(item.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = [];
          }
          monthlyData[monthKey].push(item);
        });

        // Process monthly groups
        const averagedData: DailyPain[] = [];
        const monthlyTickLabels: string[] = [];

        // Get sorted month keys
        const sortedMonths = Object.keys(monthlyData).sort();

        sortedMonths.forEach((monthKey) => {
          const monthEntries = monthlyData[monthKey];
          const average = Number(
            (
              monthEntries.reduce((sum, item) => sum + item.level, 0) /
              monthEntries.length
            ).toFixed(1)
          );

          // Use first entry's date as representative for the month
          const representativeDate = new Date(monthEntries[0].date);
          averagedData.push({
            date: representativeDate,
            level: average,
          });

          // Format month name (e.g., "Jan", "Feb")
          monthlyTickLabels.push(
            new Intl.DateTimeFormat("en-US", { month: "short" }).format(
              representativeDate
            )
          );
        });

        setWeeklyPainData(averagedData);
        setTickLabels(monthlyTickLabels);
        break;
      }
      case "M": {
        const monthlyData: { [key: string]: DailyPain[] } = {};

        // Group all data by month
        mockData.forEach((item) => {
          const date = new Date(item.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = [];
          }
          monthlyData[monthKey].push(item);
        });

        // Process monthly groups
        const averagedData: DailyPain[] = [];
        const monthlyTickLabels: string[] = [];

        // Get sorted month keys
        const sortedMonths = Object.keys(monthlyData).sort();

        // Calculate label interval based on total months (show ~10 labels)
        const totalMonths = sortedMonths.length;
        const labelInterval = Math.ceil(totalMonths / 10);

        sortedMonths.forEach((monthKey, index) => {
          const monthEntries = monthlyData[monthKey];
          const average = Number(
            (
              monthEntries.reduce((sum, item) => sum + item.level, 0) /
              monthEntries.length
            ).toFixed(1)
          );

          const representativeDate = new Date(monthEntries[0].date);
          averagedData.push({
            date: representativeDate,
            level: average,
          });

          // Show label only at intervals, with first and last always shown
          if (
            index % labelInterval === 0 ||
            index === 0 ||
            index === sortedMonths.length - 1
          ) {
            monthlyTickLabels.push(
              new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                representativeDate
              )
            );
          } else {
            monthlyTickLabels.push("");
          }
        });

        setWeeklyPainData(averagedData);
        setTickLabels(monthlyTickLabels);
        break;
      }
      case "Y": {
        const yearlyData: { [key: string]: DailyPain[] } = {};

        // Group all data by year
        mockData.forEach((item) => {
          const date = new Date(item.date);
          const yearKey = date.getFullYear().toString();
          if (!yearlyData[yearKey]) {
            yearlyData[yearKey] = [];
          }
          yearlyData[yearKey].push(item);
        });

        // Process yearly groups
        const averagedData: DailyPain[] = [];
        const yearlyTickLabels: string[] = [];

        // Get sorted years
        const sortedYears = Object.keys(yearlyData).sort();

        sortedYears.forEach((yearKey) => {
          const yearEntries = yearlyData[yearKey];
          const average = Number(
            (
              yearEntries.reduce((sum, item) => sum + item.level, 0) /
              yearEntries.length
            ).toFixed(1)
          );

          averagedData.push({
            date: yearEntries[0].date, // Use first entry's date as representative
            level: average,
          });

          yearlyTickLabels.push(yearKey);
        });

        setWeeklyPainData(averagedData);
        setTickLabels(yearlyTickLabels);
        break;
      }
      default:
        setWeeklyPainData(mockData);
    }
  };

  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter]);

  return (
    <ScrollView>
      {/* Horizontal buttons for filtering by time period */}

      <LineChart
        data={weeklyPainData.map((item) => item.level)}
        xLabels={tickLabels}
      />
      <View className="flex-row gap-2 pr-4 pl-4 justify-between">
        <Button variant="ghost" onPress={() => setActiveFilter("Y")}>
          <Text>Y</Text>
        </Button>
        <Button variant="ghost" onPress={() => setActiveFilter("M")}>
          <Text>M</Text>
        </Button>
        {/* <Button variant="ghost" onPress={() => setActiveFilter("W")}>
          <Text>W</Text>
        </Button> */}
        <Button variant="ghost" onPress={() => setActiveFilter("LY")}>
          <Text>LY</Text>
        </Button>
        <Button variant="ghost" onPress={() => setActiveFilter("3M")}>
          <Text>3M</Text>
        </Button>
        <Button variant="ghost" onPress={() => setActiveFilter("LM")}>
          <Text>LM</Text>
        </Button>
        <Button variant="ghost" onPress={() => setActiveFilter("7D")}>
          <Text>7D</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default LineChartScreen;
