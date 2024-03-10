import { Platform, StatusBar, View } from "react-native";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;

const StatusBarView = ({ backgroundColor = "#1A2F5A" }) => {
  return (
    <View
      style={{
        height: STATUS_BAR_HEIGHT,
        backgroundColor,
        zIndex: -1,
      }}
    >
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle="light-content"
      />
    </View>
  );
};

export default StatusBarView;
