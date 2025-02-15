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

export default function Home() {
  const [entries, setEntries] = useState<PainEntry[]>(mockEntries);
  const [newEntry, setNewEntry] = useState("");
  const [editEntry, setEditEntry] = useState<PainEntry | null>(null);
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1 relative">
      <ScrollView
        className="p-4"
        contentContainerClassName="flex-col gap-4 pb-24"
      >
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
