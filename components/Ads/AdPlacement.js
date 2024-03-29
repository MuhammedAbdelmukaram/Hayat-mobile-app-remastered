import React from "react";
import { View, Platform } from "react-native";
import { Banner } from "react-native-ad-manager";

const androidAdUnits = [
  "/272140683/hayat.ba_anchor_bottom_android_app",
  "/272140683/hayat.ba_300x250_in_text_1_android_app",
  "/272140683/hayat.ba_320x100_in_text_android_app",
  "/272140683/hayat.ba_320x100_in_page_1_android_app",
  "/272140683/hayat.ba_320x100_in_page_2_android_app",
  "/272140683/hayat.ba_320x100_in_page_3_android_app",
];

const iOSAdUnits = [
  "/272140683/hayat.ba_anchor_bottom_ios_app",
  "/272140683/hayat.ba_300x250_in_text_1_ios_app",
  "/272140683/hayat.ba_320x100_in_text_ios_app",
  "/272140683/hayat.ba_320x100_in_page_1_ios_app",
  "/272140683/hayat.ba_320x100_in_page_2_ios_app",
  "/272140683/hayat.ba_320x100_in_page_3_ios_app",
];

const adUnits = Platform.OS === "android" ? androidAdUnits : iOSAdUnits;

const adSizes = [
  "LARGE_BANNER",
  "MEDIUM_RECTANGLE",
  "LARGE_BANNER",
  "LARGE_BANNER",
  "LARGE_BANNER",
  "LARGE_BANNER",
];

const AdPlacement = ({ id }) => {
  if (id - 1 > adUnits.length) {
    console.log("Only " + adUnits.length + " ad units are given");
    return;
  }
  return (
    <View>
      <Banner
        adSize={adSizes[id - 1]}
        adUnitID={adUnits[id - 1]}
        onAdFailedToLoad={(error) => console.error(error)}
        onAppEvent={(event) => console.log(event.name, event.info)}
      />
    </View>
  );
};

export default AdPlacement;
