import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import HorizontalLine from "./Menu/HorizontalLine";

const Priority = ({ article }) => {
  const navigation = useNavigation();

  const blinkAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500, // Reduced duration
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500, // Reduced duration
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    // Cleanup function to stop the animation when component unmounts
    return () => animation.stop();
  }, []); // Removed blinkAnim from dependencies

  const {
    image_list,
    title: articleTitle,
    subtitle: articleSubtitle,
    _id: articleID,
    priority,
    video_post,
  } = article;

  const imageUri = image_list[0]?.url;

  const handlePress = () => {
    console.log("Article ID:", article); // Log the articleID
    navigation.navigate("Article", { articleID: articleID });
  };

  const formattedArticleTitle = articleTitle.replace(/\n/g, " ");
  const formattedArticleSubtitle = articleTitle.replace(/\n/g, " ");

  return (
    <TouchableOpacity
      style={
        [3, 4, 6].includes(priority)
          ? styles.container3
          : [5].includes(priority)
          ? styles.container5
          : styles.container2
      }
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <>
        {[3, 4, 6].includes(priority) ? (
          <View style={styles.leftSide}>
            <Image
              source={{ uri: imageUri }}
              resizeMethod="resize"
              style={
                [3].includes(priority)
                  ? styles.newsImage3
                  : [4].includes(priority)
                  ? styles.newsImage4
                  : styles.newsImage
              }
            />
          </View>
        ) : [2].includes(priority) ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMethod="resize"
            resizeMode="cover"
          />
        ) : null}
        {[3, 4, 6].includes(priority) ? (
          <>
            <View style={styles.rightSide}>
              <View style={styles.upperWrapper}>
                <View style={styles.textsWrapper}>
                  <Text
                    style={
                      [3].includes(priority) ? styles.heading3 : styles.heading
                    }
                  >
                    {formattedArticleTitle}
                  </Text>
                  {[3, 4].includes(priority) && (
                    <Text
                      numberOfLines={3}
                      style={
                        [3].includes(priority)
                          ? styles.subtitle
                          : styles.subtitle4
                      }
                    >
                      {[3].includes(priority)
                        ? formattedArticleSubtitle
                        : articleSubtitle}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <HorizontalLine />
          </>
        ) : [2].includes(priority) ? (
          <>
            {video_post && (
              <View style={styles.textBoxPrioTwo}>
                <Animated.View
                  style={{
                    ...styles.blinkingDot,
                    opacity: blinkAnim, // Bind opacity to animated value
                  }}
                />
                <Text style={styles.titleText}>{formattedArticleTitle}</Text>
              </View>
            )}
            <View style={styles.textBoxTwo}>
              <Text style={styles.descriptionText}>
                {formattedArticleSubtitle}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.text5}>{formattedArticleTitle}</Text>
          </View>
        )}
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container2: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 2,
  },
  container3: {
    paddingTop: 16,
    flexDirection: "row",
    marginHorizontal: 4,
    borderRadius: 2,
    marginBottom: 2,
    backgroundColor: "#fff",
    paddingBottom: 4,
    elevation: 2, // Elevation for the shadow
    shadowColor: "rgba(0, 0, 0, 0.09)", // Shadow color with 9% opacity
    shadowOffset: { width: -1, height: 2 }, // X = -1, Y = 2
    shadowRadius: 2, // Blur = 2
    shadowOpacity: 1, // Shadow opacity
  },
  container5: {
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 2,
  },
  textBox: {
    width: "92%",
    paddingTop: 8,
    paddingBottom: 4,
  },
  textBoxPrioTwo: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    width: "92%",
    paddingTop: 8,
    paddingBottom: 4,
  },
  textBoxTwo: {
    width: "92%",
    paddingBottom: 8,
    marginBottom: 4,
    // marginLeft: 10,
  },
  titleText: {
    fontSize: 18, // Adjust the font size for the title text
    fontWeight: "500", // Optional: Add font weight
    textAlign: "left", // Optional: Center the text horizontally
  },
  descriptionText: {
    fontSize: 12, // Adjust the font size for the description text
    textAlign: "left", // Optional: Center the text horizontally
  },
  upperWrapper: {
    paddingHorizontal: 6,
    display: "flex",
    flexDirection: "row",
  },
  textsWrapper: {
    display: "flex",
    marginLeft: 12,
  },
  blinkingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginTop: 9,
    marginRight: 8,
  },
  image: {
    width: "93%", // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginTop: 16, // Optional: Add spacing between image and text boxes
  },
  newsImage: {
    height: 68,
    width: 91,
  },
  newsImage3: {
    height: 101,
    width: 133,
  },
  newsImage4: {
    height: 80,
    width: 110,
  },
  rightSide: {
    display: "flex",
    alignSelf: "flex-start",
  },
  leftSide: {
    paddingLeft: 6,
    alignSelf: "center",
    marginBottom: 10,
  },
  heading3: {
    fontWeight: "600",
    textAlign: "justify",
    width: 234,
    marginBottom: 4,
    // Add any additional styles specific to priority 3 here
  },
  heading: {
    fontWeight: "600",
    textAlign: "justify",
    width: 254,
    marginBottom: 4,
  },
  heading4: {
    fontWeight: "600",
    textAlign: "left",
    width: 254,
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
  },
  text5: {
    fontSize: 14,
    fontWeight: "500",
    width: "96%",
  },
  subtitle: {
    color: "#2d2d2d",
    fontSize: 11,
    width: 240,
  },
  subtitle4: {
    color: "#2d2d2d",
    fontSize: 11,
    width: 260,
    textAlign: "justify",
  },
  textContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
});

export default Priority;
