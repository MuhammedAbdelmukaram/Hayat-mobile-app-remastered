import React from 'react';
//import {AdMobBanner} from "expo-ads-admob";
import {View} from "react-native";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const AdPlacement2 = () => {
    return (

        <View>
            <BannerAd
            unitId={TestIds.BANNER}
            size={'300x100'}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
            />
            {/*<AdMobBanner*/}
            {/*    bannerSize="mediumRectangle"*/}
            {/*    adUnitID="/272140683/hayat.ba_300x250_in_text_1_android_app" // Your Ad Unit ID*/}
            {/*    servePersonalizedAds={true}*/}
            {/*    onDidFailToReceiveAdWithError={(error) => console.log(error)}/>*/}
        </View>

    );
};

export default AdPlacement2;