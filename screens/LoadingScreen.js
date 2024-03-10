import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

let ScreenHeight = Dimensions.get("window").height;

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#1A2F5A" />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: ScreenHeight,
  },
});
