import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

let ScreenHeight = Dimensions.get("window").height;

const NoConnection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Došlo je do problema s povezivanjem s Hayat aplikacijom
      </Text>
      <Text style={styles.text}>
        Provjerite vašu konekciju i pokušajte opet
      </Text>
    </View>
  );
};

export default NoConnection;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: ScreenHeight,
  },
  title: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
  },
});
