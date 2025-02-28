import { Tabs } from "expo-router";
import { Home, LineChart, User } from "lucide-react-native";
import * as React from "react";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useColorScheme } from "~/lib/useColorScheme";

export default function TabsLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkColorScheme ? "#fff" : "#000",
        tabBarInactiveTintColor: isDarkColorScheme ? "#888" : "#888",
        tabBarStyle: {
          backgroundColor: isDarkColorScheme ? "#000" : "#fff",
        },
        tabBarShowLabel: false,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tabs.Screen
        name="charts/index"
        options={{
          title: "Charts",
          tabBarIcon: ({ color, size }) => (
            <LineChart color={color} size={size} />
          ),
          headerRight: () => <ThemeToggle />,
        }}
      />
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerRight: () => <ThemeToggle />,
        }}
      /> */}
    </Tabs>
  );
}
