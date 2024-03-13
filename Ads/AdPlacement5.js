import React from "react";
import { View } from "react-native";
import { Banner } from "react-native-ad-manager";
const AdPlacement5 = () => {
  return (
    <View>
      <Banner
        adSize="fullBanner"
        adUnitID="/272140683/hayat.ba_anchor_bottom_android_app"
        onAdFailedToLoad={(error) => console.error(error)}
        onAppEvent={(event) => console.log(event.name, event.info)}
      />
    </View>
  );
};

export default AdPlacement5;
