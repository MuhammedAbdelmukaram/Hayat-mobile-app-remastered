import React from "react";
import { View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
const AdPlacement4 = () => {
  return (
    <View>
      <BannerAd
        unitId={TestIds.BANNER}
        size={"300x100"}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      {/*<AdMobBanner*/}
      {/*    bannerSize="largeBanner"*/}
      {/*    adUnitID="/272140683/hayat.ba_320x100_in_page_1_android_app" // Your Ad Unit ID*/}
      {/*    servePersonalizedAds={true}*/}
      {/*    onDidFailToReceiveAdWithError={(error) => console.log(error)} />*/}
    </View>
  );
};

export default AdPlacement4;
