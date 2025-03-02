import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Plus, X, Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input } from "~/components/ui/input";

// Storage keys
const PAINS_STORAGE_KEY = "user_pains";
const SELECTED_PAIN_KEY = "selected_pain";
const PAIN_RATING_KEY = "pain_rating";

const AddScreen = () => {
  const [pains, setPains] = useState<string[]>([]);
  const [selectedPain, setSelectedPain] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomPain, setNewCustomPain] = useState("");
  const [step, setStep] = useState(1); // Track the current step (1 or 2)
  const [painRating, setPainRating] = useState<number | null>(null);

  // Load saved pains from storage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPains = await AsyncStorage.getItem(PAINS_STORAGE_KEY);
        if (storedPains) {
          setPains(JSON.parse(storedPains));
        }

        // Also load the previously selected pain if available
        const lastSelectedPain = await AsyncStorage.getItem(SELECTED_PAIN_KEY);
        if (lastSelectedPain) {
          setSelectedPain(lastSelectedPain);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  // Save a new custom pain
  const saveCustomPain = async () => {
    if (newCustomPain.trim() === "") return;

    // Check if already exists
    if (pains.includes(newCustomPain.trim())) {
      // If it already exists, just select it
      handlePainSelection(newCustomPain.trim());
      setNewCustomPain("");
      setShowCustomInput(false);
      return;
    }

    const updatedPains = [...pains, newCustomPain.trim()];

    try {
      await AsyncStorage.setItem(
        PAINS_STORAGE_KEY,
        JSON.stringify(updatedPains)
      );
      setPains(updatedPains);

      // Auto-select and save the new pain
      handlePainSelection(newCustomPain.trim());
      setNewCustomPain("");
      setShowCustomInput(false);
    } catch (error) {
      console.error("Failed to save custom pain:", error);
    }
  };

  // Handle pain selection and save it
  const handlePainSelection = async (pain: string) => {
    setSelectedPain(pain);

    try {
      await AsyncStorage.setItem(SELECTED_PAIN_KEY, pain);
      console.log("Selected and saved pain:", pain);
    } catch (error) {
      console.error("Failed to save selected pain:", error);
    }
  };

  // Remove a pain
  const removePain = async (painToRemove: string) => {
    const updatedPains = pains.filter((pain) => pain !== painToRemove);

    try {
      await AsyncStorage.setItem(
        PAINS_STORAGE_KEY,
        JSON.stringify(updatedPains)
      );
      setPains(updatedPains);

      // If the removed pain was selected, clear selection
      if (selectedPain === painToRemove) {
        setSelectedPain(null);
        await AsyncStorage.removeItem(SELECTED_PAIN_KEY);
      }
    } catch (error) {
      console.error("Failed to remove pain:", error);
    }
  };

  // Handle pain rating selection
  const handlePainRatingSelection = (rating: number) => {
    setPainRating(rating);
  };

  // Save the complete pain entry (pain type + rating)
  const savePainEntry = async () => {
    if (selectedPain === null || painRating === null) return;

    try {
      await AsyncStorage.setItem(PAIN_RATING_KEY, painRating.toString());
      console.log("Pain entry saved:", {
        pain: selectedPain,
        rating: painRating,
      });

      // Here you would typically navigate to another screen or show a success message
      // For now, we'll just reset to step 1
      setStep(1);
      setPainRating(null);
    } catch (error) {
      console.error("Failed to save pain entry:", error);
    }
  };

  // Go to next step
  const goToNextStep = () => {
    if (selectedPain) {
      setStep(2);
    }
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    setStep(1);
  };

  // Get background color based on pain rating
  const getRatingColor = (rating: number) => {
    if (rating <= 3) return "bg-green-500";
    if (rating <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <View className="flex-1 relative">
      {/* Progress Indicator */}
      <View className="flex-row p-4">
        <View className="flex-1 flex-row items-center">
          <View
            className={`h-1 flex-1 rounded-full ${
              step === 1 ? "bg-primary" : "bg-muted"
            }`}
          />
          <View
            className={`h-6 w-6 rounded-full items-center justify-center ${
              step === 1 ? "bg-primary" : "bg-muted"
            }`}
          >
            <Text className="text-white font-bold">1</Text>
          </View>
        </View>

        <View className="w-4" />

        <View className="flex-1 flex-row items-center">
          <View
            className={`h-1 flex-1 rounded-full ${
              step === 2 ? "bg-primary" : "bg-muted"
            }`}
          />
          <View
            className={`h-6 w-6 rounded-full items-center justify-center ${
              step === 2 ? "bg-primary" : "bg-muted"
            }`}
          >
            <Text className="text-white font-bold">2</Text>
          </View>
        </View>
      </View>

      {step === 1 ? (
        // Step 1: Select Pain Type
        <View className="flex-1">
          <View className="flex-1 p-4">
            <ScrollView>
              {/* Custom input section */}
              {showCustomInput ? (
                <View className="mb-4">
                  <Input
                    value={newCustomPain}
                    onChangeText={setNewCustomPain}
                    placeholder="Enter new pain description"
                    className="w-full mb-2"
                  />
                  <Button
                    onPress={saveCustomPain}
                    disabled={newCustomPain.trim() === ""}
                    className="w-full"
                  >
                    <Text>Add</Text>
                  </Button>
                  <Button
                    onPress={() => setShowCustomInput(false)}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              ) : (
                <Button
                  onPress={() => setShowCustomInput(true)}
                  className="mb-4 w-full"
                >
                  <Text className="font-bold">New Pain</Text>
                </Button>
              )}

              {/* Existing pains section */}
              {pains.length > 0 ? (
                <View className="flex-row flex-wrap justify-between">
                  {pains.map((pain) => (
                    <View key={pain} className="w-[48%] mb-3 relative">
                      <TouchableOpacity
                        onPress={() => handlePainSelection(pain)}
                      >
                        <Card
                          className={
                            selectedPain === pain
                              ? "border-2 border-primary"
                              : ""
                          }
                        >
                          <CardHeader>
                            <CardTitle className="text-center pr-6">
                              {pain}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removePain(pain)}
                        className="absolute top-2 right-2"
                      >
                        <X size={16} className="text-muted-foreground" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center justify-center py-8">
                  <Text className="text-muted-foreground">
                    No pains saved yet. Add your first pain with the button
                    above.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Next button */}
          <View className="p-4">
            <Button
              onPress={goToNextStep}
              disabled={!selectedPain}
              className="w-full"
            >
              <Text className="font-bold">Next</Text>
            </Button>
          </View>
        </View>
      ) : (
        // Step 2: Rate Pain
        <View className="flex-1">
          <View className="flex-1 p-4">
            <Text className="text-center mb-6">How is your pain today?</Text>

            {/* Pain rating grid */}
            <View className="flex-row flex-wrap justify-between mb-8">
              {[...Array(11)].map((_, index) => {
                const baseColor = getRatingColor(index);
                const isSelected = painRating === index;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePainRatingSelection(index)}
                    className={`w-[30%] mb-3 aspect-square items-center justify-center ${
                      isSelected ? "border-2 border-primary" : ""
                    }`}
                    style={{
                      backgroundColor: baseColor
                        .replace("bg-", "")
                        .includes("green")
                        ? "rgba(60, 255, 0, 0.5)"
                        : baseColor.replace("bg-", "").includes("yellow")
                        ? "rgba(255, 255, 0, 0.5)"
                        : "rgba(255, 0, 0, 0.5)",
                      borderWidth: 2,
                      borderColor: baseColor
                        .replace("bg-", "")
                        .includes("green")
                        ? "#3CFF00"
                        : baseColor.replace("bg-", "").includes("yellow")
                        ? "#FFFF00"
                        : "#FF0000",
                      borderRadius: 9999,
                    }}
                  >
                    <Text
                      className={`font-bold text-xl ${
                        isSelected ? "text-primary" : ""
                      }`}
                      style={{
                        fontWeight: isSelected ? "900" : "bold",
                        color: isSelected ? "#000000" : undefined,
                      }}
                    >
                      {index}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Navigation buttons */}
          <View className="p-4 flex-row">
            <Button
              onPress={goToPreviousStep}
              variant="outline"
              className="flex-1 mr-2"
            >
              <Text>Back</Text>
            </Button>
            <Button
              onPress={savePainEntry}
              disabled={painRating === null}
              className="flex-1 ml-2"
            >
              <Text className="font-bold">Save</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default AddScreen;
