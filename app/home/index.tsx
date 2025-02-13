import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Activity } from "~/lib/icons/activity";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import LineChart from "~/components/linechart";

type PainEntry = {
  id: string;
  bodyPart: string;
  description: string;
  createdAt: Date;
};

const mockEntries: PainEntry[] = [
  {
    id: "1",
    bodyPart: "Left Leg",
    description: "Pain in the left leg",
    createdAt: new Date(),
  },
  {
    id: "2",
    bodyPart: "Right Leg",
    description: "Pain in the right leg",
    createdAt: new Date(),
  },
  {
    id: "3",
    bodyPart: "Left Leg",
    description: "Pain in the left leg",
    createdAt: new Date(),
  },
  {
    id: "4",
    bodyPart: "Right Leg",
    description: "Pain in the right leg",
    createdAt: new Date(),
  },
  {
    id: "5",
    bodyPart: "Left Leg",
    description: "Pain in the left leg",
    createdAt: new Date(),
  },
  {
    id: "6",
    bodyPart: "Right Leg",
    description: "Pain in the right leg",
    createdAt: new Date(),
  },
  {
    id: "7",
    bodyPart: "Left Leg",
    description: "Pain in the left leg",
    createdAt: new Date(),
  },
  {
    id: "8",
    bodyPart: "Right Leg",
    description: "Pain in the right leg",
    createdAt: new Date(),
  },
];

// Define a new type for daily pain data
type DailyPain = {
  date: Date;
  level: number;
};

export default function Home() {
  const [entries, setEntries] = useState<PainEntry[]>(mockEntries);
  const [newEntry, setNewEntry] = useState("");
  const [editEntry, setEditEntry] = useState<PainEntry | null>(null);
  const { isDarkColorScheme } = useColorScheme();
  const [weeklyPainData, setWeeklyPainData] = useState<DailyPain[]>([
    { date: new Date(2025, 1, 12), level: 2 },
    { date: new Date(2025, 1, 13), level: 5 },
    { date: new Date(2025, 1, 14), level: 4 },
    { date: new Date(2025, 1, 15), level: 7 },
    { date: new Date(2025, 1, 16), level: 10 },
    { date: new Date(2025, 1, 17), level: 9 },
    { date: new Date(2025, 1, 18), level: 6 },
  ]);

  return (
    <View className="flex-1 relative">
      <ScrollView
        className="p-4"
        contentContainerClassName="flex-col gap-4 pb-24"
      >
        <LineChart
          data={weeklyPainData.map((item) => item.level)}
          xLabels={weeklyPainData.map((item) => {
            // dayIndex: 0 = Sunday, 1 = Monday, etc.
            const dayIndex = item.date.getDay();
            // Single-letter scheme for weekdays: 'Sunday' => 'S', 'Monday' => 'M', etc.
            const dayLetters = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
            return dayLetters[dayIndex];
          })}
        />

        {entries.map((entry) => (
          <Card key={entry.id} className="rounded-lg shadow-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{entry.bodyPart}</CardTitle>
              <Activity
                className="text-foreground"
                size={23}
                strokeWidth={1.5}
              />
            </CardHeader>
            <CardFooter>
              <Text>{entry.createdAt.toLocaleDateString()}</Text>
            </CardFooter>
          </Card>
        ))}
      </ScrollView>

      <View className="absolute bottom-4 left-4 right-4 shadow-lg rounded-full">
        <Button className="w-full rounded-full">
          <Text className="font-bold text-lg">Add Pain</Text>
        </Button>
      </View>
    </View>
  );
}
