import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HorizontalLine from "./Menu/HorizontalLine";

const Priority = ({ article }) => {
  const navigation = useNavigation();

  const {
    image_list,
    title: articleTitle,
    subtitle: articleSubtitle,
    _id: articleID,
    priority,
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
          : priority === 5
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
              resizeMethod= "resize"
              style={
                priority === 3
                  ? styles.newsImage3
                  : priority == 4
                  ? styles.newsImage4
                  : styles.newsImage
              }
            />
          </View>
        ) : priority === 2 ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMethod= "resize"
            resizeMode="cover"
          />
        ) : null}
        {[3, 4, 6].includes(priority) ? (
          <>
            <View style={styles.rightSide}>
              <View style={styles.upperWrapper}>
                <View style={styles.textsWrapper}>
                  <Text style={styles.heading}>{formattedArticleTitle}</Text>
                  {[3, 4].includes(priority) && (
                    <Text
                      style={
                        priority === 3 ? styles.subtitle : styles.subtitle4
                      }
                    >
                      {priority === 3
                        ? formattedArticleSubtitle
                        : articleSubtitle}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <HorizontalLine />
          </>
        ) : priority === 2 ? (
          <>
            <View style={styles.textBox}>
              <Text style={styles.titleText}>{formattedArticleTitle}</Text>
            </View>
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
    width: "92%", // Adjust the width as needed
    paddingTop: 8, // Adjust vertical padding as needed
    paddingBottom: 4,
  },
  textBoxTwo: {
    width: "92%", // Adjust the width as needed
    paddingBottom: 8, // Adjust vertical padding as needed
    marginBottom: 4,
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
  heading: {
    fontWeight: "600",
    textAlign: "justify",
    width: 276,
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
    width: 260,
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
