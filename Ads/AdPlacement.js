import React from "react";
import { View } from "react-native";
import { Banner } from "react-native-ad-manager";

const adUnits = [
  "/272140683/hayat.ba_anchor_bottom_android_app",
  "/272140683/hayat.ba_300x250_in_text_1_android_app",
  "/272140683/hayat.ba_320x100_in_text_android_app",
  "/272140683/hayat.ba_320x100_in_page_1_android_app",
  "/272140683/hayat.ba_320x100_in_page_2_android_app",
  "/272140683/hayat.ba_320x100_in_page_3_android_app",
];

const AdPlacement = ({ id }) => {
  return (
    <View>
      <Banner
        adSize="fullBanner"
        adUnitID={adUnits[id + 1]}
        onAdFailedToLoad={(error) => console.error(error)}
        onAppEvent={(event) => console.log(event.name, event.info)}
      />
    </View>
  );
};

export default AdPlacement;
