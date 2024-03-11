import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { STATUS_BAR_HEIGHT } from "./StatusBarView";

let loadingHeight = Dimensions.get("window").height - STATUS_BAR_HEIGHT - 107;

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
    height: loadingHeight,
  },
});
