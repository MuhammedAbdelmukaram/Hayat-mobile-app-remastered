import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure this is imported
import Countdown from "../components/Survey/Countdown";
import { useSelector } from "react-redux";

const Survey = ({ surveyId }) => {
  const [surveyData, setSurveyData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const checkResponseStatus = async () => {
      const response = await AsyncStorage.getItem(`survey_${surveyId}`);
      if (response) {
        setHasResponded(true);
      }
    };

    if (surveyData && surveyData.surveyType === "survey") {
      checkResponseStatus();
    }
  }, [surveyId]); // Depend on surveyData as well

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await fetch(
          `https://backproba.hayat.ba/surveys/${surveyId}`
        );
        const data = await response.json();
        setSurveyData(data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  const handleSelectOption = async (option, index) => {
    setSelectedOption(option);

    const responseKey = `survey_response_${surveyId}`;
    const existingResponse = await AsyncStorage.getItem(responseKey);

    if (existingResponse) {
      Alert.alert("Anketa", "Vaš odgovor je već poslan");
      return;
    }

    // Check if the survey type is "survey"
    if (surveyData && surveyData.surveyType === "survey") {
      if (hasResponded) {
        Alert.alert("Anketa", "Vaš odgovor je već poslan");
        return;
      }

      try {
        const response = await fetch(
          `https://backproba.hayat.ba/surveys/response/${surveyId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ response: index }),
          }
        );

        const result = await response.json();
        if (result.modifiedCount > 0) {
          await AsyncStorage.setItem(
            responseKey,
            JSON.stringify({ submitted: true })
          );
          setHasResponded(true);
          Alert.alert("Anketa", "Vaš odgovor je zabilježen");
        } else {
          Alert.alert("Anketa", "Vaš odgovor je već poslan");
        }
      } catch (error) {
        console.error("Error submitting survey response:", error);
        Alert.alert("Anketa", "Došlo je do greške pri slanju odgovora");
      }
    }
    // Check if the survey type is "trivia" and the user is logged in
    else if (surveyData && surveyData.surveyType === "trivia") {
      // This combines the conditions for logged-in users and users who are not logged in
      try {
        const surveyResponse = {
          surveyId: surveyId,
          response: index,
          timestamp: new Date().toISOString(),
        };
        // If user is logged in, send response immediately
        if (user) {
          const response = await fetch(
            `https://backproba.hayat.ba/surveys/${surveyId}/response`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ answer: index, userId: user.id }),
            }
          );

          if (response.ok) {
            Alert.alert("Trivia", "Odgovor je zabilježen");
            await AsyncStorage.setItem(
              responseKey,
              JSON.stringify({ submitted: true })
            );
          } else {
            Alert.alert("Trivia", "Došlo je do greške");
          }
        } else {
          // User is not logged in, store response to send later
          await AsyncStorage.setItem(
            "pendingSurveyResponses",
            JSON.stringify([surveyResponse])
          );
          Alert.alert(
            "Trivia",
            "Vaš odgovor će biti poslan kada se prijavite."
          );
        }
      } catch (error) {
        console.error("Error handling trivia response:", error);
        Alert.alert("Trivia", "Došlo je do greške pri slanju odgovora");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.surveyOuterContainer}>
        <View style={styles.surveyContainer}>
          <View style={styles.blueSectionWrapper}>
            <View style={styles.blueSection}>
              <Text style={styles.surveyHeading}>Poklon moze biti tvoj</Text>
              <Countdown deadline={surveyData ? surveyData.deadline : null} />
            </View>
          </View>

          {surveyData && (
            <>
              <Text style={styles.questionText}>{surveyData.question}</Text>
              {surveyData.answerOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionContainer,
                    selectedOption === option.answer && styles.selectedOption,
                  ]}
                  onPress={() => handleSelectOption(option.answer, index)}
                >
                  <Text style={styles.optionText}>{option.answer}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    backgroundColor: "transparent", // Replace with your background color
  },
  blueSection: {
    width: "80%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#1A2F5A",
  },
  image: {
    height: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  whiteTriangleLeft: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 30, // Width of the left triangle
    borderTopWidth: 50, // Height of the triangle
    borderRightColor: "#FFF",
    borderTopColor: "transparent",
  },
  whiteTriangleRight: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 30, // Width of the right triangle
    borderTopWidth: 50, // Height of the triangle
    borderLeftColor: "#FFF",
    borderTopColor: "transparent",
  },
  surveyHeading: {
    color: "#fff",
  },
  blueSectionWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  surveyContainer: {
    padding: 16,

    backgroundColor: "#FFF", // Replace with your background color
    shadowColor: "#000", // This is the color of the shadow
    shadowOffset: {
      width: 0, // These are the X and Y offsets of the shadow
      height: 2, // A positive Y offset will put the shadow below the box
    },
    shadowOpacity: 0.25, // This defines how transparent the shadow is
    shadowRadius: 3.84, // This defines the blur radius of the shadow
    elevation: 5, // This is for Android shadow effect
    borderRadius: 5, // This will round the corners of your container
    marginBottom: 10, // Replace with your desired margin bottom
  },

  surveyOuterContainer: {
    padding: 20,
  },

  questionText: {
    fontSize: 18, // Replace with your desired font size
    fontWeight: "bold", // Replace with your desired font weight
    marginBottom: 20, // Replace with your desired margin bottom
  },
  optionContainer: {
    borderWidth: 1,
    borderColor: "#000", // Replace with your border color
    paddingVertical: 15, // Replace with your desired padding vertical
    paddingHorizontal: 10, // Replace with your desired padding horizontal
    borderRadius: 5, // Replace with your desired border radius
    marginBottom: 10, // Replace with your desired margin bottom
    backgroundColor: "#FFF", // Replace with your option background color
  },
  parallelogram: {
    minWidth: 300,
    maxWidth: 387,
    height: 40,
    backgroundColor: "#1a2f5a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20, // Adjust as needed.
    paddingRight: 20, // Adjust as needed.
    transform: [{ skewX: "-10deg" }], // Skew the parallelogram.
  },
  selectedOption: {
    backgroundColor: "#E0E0E0", // Replace with your selected option background color
  },
  optionText: {
    fontSize: 16, // Replace with your desired font size
    textAlign: "center", // Replace with your desired text alignment
  },
});

export default Survey;
