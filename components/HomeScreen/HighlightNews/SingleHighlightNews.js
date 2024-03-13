import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

import HorizontalLine from "../../Menu/HorizontalLine";

const SingleHighlightNews = () => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container}>
      <View style={styles.leftSide}>
        <Image
          source={require("../../../assets/news/newsBack-2.png")}
          style={styles.newsImage}
        />
      </View>

      <View style={styles.rightSide}>
        <View style={styles.upperWrapper}>
          <View style={styles.textsWrapper}>
            <Text style={styles.heading}>
              Gabon otvorio granice tri dana nakon vojnog udara
            </Text>
            <Text style={styles.subtitle}>
              Vojna administracija Gabona otvorila je kopnene, morske i zračne
              granice nakon izvršenog...
            </Text>
          </View>
        </View>

        <View style={styles.lowerWrapper}>
          <Text style={styles.text}>3 sata</Text>

          <View style={styles.shareWrapper}>
            <Text style={styles.text}>13</Text>
            <Image
              source={require("../../../assets/icons/shareIconBlack.png")}
              style={styles.shareIcon}
            />
          </View>
        </View>
      </View>

      <HorizontalLine />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flexDirection: "row",
    marginHorizontal: 4,
    marginTop: 8,
    borderRadius: 2,
    marginBottom: 8,
    borderLeftWidth: 3,
    backgroundColor: "#fff",
    paddingBottom: 4,

    elevation: 2, // Elevation for the shadow
    shadowColor: "rgba(0, 0, 0, 0.09)", // Shadow color with 9% opacity
    shadowOffset: { width: -1, height: 2 }, // X = -1, Y = 2
    shadowRadius: 2, // Blur = 2
    shadowOpacity: 1, // Shadow opacity
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
  newsImage: {
    height: 80,
    width: 110,
  },
  rightSide: {
    display: "flex",
  },
  leftSide: {
    paddingLeft: 6,
    alignSelf: "center",
    marginBottom: 10,
  },
  heading: {
    fontWeight: "600",
    textAlign: "justify",
    width: 250,
    marginBottom: 4,
  },
  shareIcon: {
    height: 10,
    width: 10,
    marginLeft: 6,
  },
  lowerWrapper: {
    paddingHorizontal: 8,
    width: "54%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
    marginTop: 10,
    paddingLeft: 18,
  },
  text: {
    fontSize: 10,
  },
  shareWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    color: "#2d2d2d",
    fontSize: 11,
    width: "56%",
  },
});
export default SingleHighlightNews;
