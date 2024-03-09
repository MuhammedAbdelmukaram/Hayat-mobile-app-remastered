import React from "react";
//import { AdMobBanner } from 'expo-ads-admob';
import { View } from "react-native";
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const AdPlacement1 = () => {
  return (
    <View>
      {/* <BannerAd
            unitId={TestIds.BANNER}
            size={'300x100'}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
            /> */}
      {/*<AdMobBanner*/}
      {/*    bannerSize="fullBanner"*/}
      {/*    adUnitID="/272140683/hayat.ba_anchor_bottom_android_app" // Use your actual Ad unit ID*/}
      {/*    servePersonalizedAds // true or false*/}
      {/*    onDidFailToReceiveAdWithError={this.bannerError} />*/}
    </View>
  );
};

export default AdPlacement1;
