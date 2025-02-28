import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

// Body parts that can be selected
const bodyParts = [
  "Head",
  "Neck",
  "Shoulder",
  "Arm",
  "Elbow",
  "Wrist",
  "Hand",
  "Back",
  "Chest",
  "Abdomen",
  "Hip",
  "Leg",
  "Knee",
  "Ankle",
  "Foot",
];

const AddScreen = () => {
  const [step, setStep] = useState(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState<number | null>(null);

  // Animation for sliding between steps
  const translateX = useSharedValue(0);

  const firstScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const secondScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + 400 }],
    };
  });

  const goToNextStep = () => {
    if (step === 1 && selectedBodyPart) {
      translateX.value = withTiming(-400, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setStep(2);
    } else if (step === 2 && painLevel !== null) {
      // Here you would save the data
      console.log("Saving data:", { bodyPart: selectedBodyPart, painLevel });
      // Reset form
      resetForm();
    }
  };

  const goToPreviousStep = () => {
    if (step === 2) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setStep(1);
    }
  };

  const resetForm = () => {
    setSelectedBodyPart(null);
    setPainLevel(null);
    translateX.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    setStep(1);
  };

  // Get color based on pain level (green for 0, red for 10)
  const getPainColor = (level: number) => {
    // Interpolate between green and red
    const red = Math.round((level / 10) * 255);
    const green = Math.round(((10 - level) / 10) * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <View className="flex-1 relative">
      {/* Header with step indicator */}
      <View className="flex-row justify-between items-center p-4 border-b border-border">
        <Text className="text-lg font-medium">
          Step {step} of 2:{" "}
          {step === 1 ? "Select Body Part" : "Rate Pain Level"}
        </Text>
        {step === 2 && (
          <TouchableOpacity onPress={goToPreviousStep}>
            <ChevronLeft size={24} className="text-foreground" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 overflow-hidden">
        {/* First screen - Body part selection */}
        <Animated.View
          style={[
            { position: "absolute", width: "100%", height: "100%" },
            firstScreenStyle,
          ]}
          className="p-4"
        >
          <ScrollView>
            <Text className="text-lg mb-4">
              Select the part of your body that hurts:
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {bodyParts.map((part) => (
                <TouchableOpacity
                  key={part}
                  onPress={() => setSelectedBodyPart(part)}
                  className="w-[48%] mb-3"
                >
                  <Card
                    className={
                      selectedBodyPart === part ? "border-2 border-primary" : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-center">{part}</CardTitle>
                    </CardHeader>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Second screen - Pain level selection */}
        <Animated.View
          style={[
            { position: "absolute", width: "100%", height: "100%" },
            secondScreenStyle,
          ]}
          className="p-4"
        >
          <View className="flex-1">
            <Text className="text-lg mb-2">
              How much does your {selectedBodyPart} hurt?
            </Text>
            <Text className="text-sm mb-6 text-muted-foreground">
              Select a value from 0 (no pain) to 10 (worst pain)
            </Text>

            <View className="flex-row flex-wrap justify-center items-center">
              {Array.from({ length: 11 }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setPainLevel(index)}
                  className="m-2"
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: getPainColor(index),
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: painLevel === index ? 3 : 0,
                      borderColor: "white",
                    }}
                  >
                    <Text
                      className="text-xl font-bold"
                      style={{ color: index > 5 ? "white" : "black" }}
                    >
                      {index}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Footer with action button */}
      <View className="p-4 border-t border-border">
        <Button
          onPress={goToNextStep}
          disabled={
            (step === 1 && !selectedBodyPart) ||
            (step === 2 && painLevel === null)
          }
        >
          <Text>{step === 1 ? "Next" : "Save"}</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddScreen;
