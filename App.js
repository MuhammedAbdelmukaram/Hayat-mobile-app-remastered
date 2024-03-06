import { StatusBar } from "expo-status-bar";
import { StyleSheet, PermissionsAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import messaging from "@react-native-firebase/messaging";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import HomeScreen from "./screens/HomeScreen";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Article from "./screens/Article";
import VideoArticle from "./screens/VideoArticle";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Survey from "./screens/Survey";
import TermsOfService from "./screens/TermsOfService";
import Account from "./screens/account";
import HayatPlay from "./screens/HayatPlay";
import VODcategories from "./screens/VODcategories";
import SubCategory from "./screens/SubCategory";
import TVShow from "./screens/TVShow";
import SubTvShow from "./screens/SubTvShow";
import LiveTv from "./screens/LiveTV";
import Uskoro from "./screens/uskoro";
import About from "./screens/About";
import Settings from "./screens/Settings";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export default function App() {
  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        console.log("token", token);
      });

    return messaging().onTokenRefresh((token) => {
      console.log("token", token);
    });
  }, []);
  // useEffect(()=>{
  //     anaylyte()
  // },[])

  //     async function anaylyte(){
  //         alert('bro analytics')
  //         await analytics().logEvent('basket', {
  //             id: 3745092,
  //             item: 'mens grey t-shirt',
  //             description: ['round neck', 'long sleeved'],
  //             size: 'L',
  //             })
  //     }

  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS, // Use the sliding animation
          }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Article"
            component={Article}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VideoArticle"
            component={VideoArticle}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="HayatPlay"
            component={HayatPlay}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Uskoro"
            component={Uskoro}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SubCategory"
            component={SubCategory}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TvShow"
            component={TVShow}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SubTvShow"
            component={SubTvShow}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LiveTV"
            component={LiveTv}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VODcategories"
            component={VODcategories}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false, animationEnabled: false }}
          />

          <Stack.Screen
            name="Survey"
            component={Survey}
            options={{ headerShown: false, animationEnabled: false }}
          />

          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false, animationEnabled: false }}
          />

          <Stack.Screen
            name="TermsOfService"
            component={TermsOfService}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false, animationEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: { collapsible: "bottom" },
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
