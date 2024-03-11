import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { STATUS_BAR_HEIGHT } from "./StatusBarView";

let loadingHeight = Dimensions.get("window").height - STATUS_BAR_HEIGHT - 237;

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{marginBottom:100}}>
      <ActivityIndicator color="#1A2F5A" />
      </View>
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
