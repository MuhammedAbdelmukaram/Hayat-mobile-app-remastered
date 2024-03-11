// components/HomeScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { DefaultTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "@env";

import Header from "../components/Common/Header";
import NavList from "../components/Common/NavList";
import StatusBarView from "../components/Common/StatusBarView";
import HighlightNews from "../components/HomeScreen/HighlightNews";
import CategoryContent from "../components/CategoryContent";
import {
  fetchArticlesByCategory,
  fetchNajnovijeArticles,
  setCurrentPage,
  setHighlightData,
  setLoading,
  setMainArticles,
} from "../redux/slices/selectedContentSlice";
import CategoryHighlightNews from "../components/CategoryHighlightNews";
import Najnovije from "./Najnovije";
import LoadingScreen from "./LoadingScreen";
import AdPlacement2 from "../Ads/AdPlacement2";
import NoConnection from "../components/NoConnection";

const theme = {
  ...DefaultTheme,
  fonts: {
    main: "Assistant",
  },
};

const HomeScreen = () => {
  const selectedCategory = useSelector(
    (state) => state.selectedContent.selectedCategory
  );
  const highlightData = useSelector(
    (state) => state.selectedContent.highlightData
  );
  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Function to update loading state

  const expoPushToken = useSelector(
    (state) => state.notification.expoPushToken
  );

  //console.log("Expo Push Token from Redux:", expoPushToken);

  const { loading: isLoading } = useSelector((state) => state.selectedContent);

  //console.log(userInfo);
  useEffect(() => {
    const fetchData = async () => {
      setDataLoaded(false); // THE LOADER WHICH WORKS NOW
      dispatch(setLoading(true));

      try {
        // Fetching highlight data
        const highlightResponse = await axios.get(
          `${API_URL}/articles/highlight`
        );
        dispatch(setHighlightData(highlightResponse.data));

        // Fetching main articles data (moved from CategoryHighlightNews)
        const mainArticlesResponse = await axios.get(
          `${API_URL}/articles/main`
        );

        dispatch(setMainArticles(mainArticlesResponse.data)); // Dispatch the action for main articles

        setDataLoaded(true); // Indicate that data has been loaded
        dispatch(setLoading(false));
        setIsConnectionError(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!error.response) {
          setIsConnectionError(true);
          setDataLoaded(false); // Ensure the dataLoaded state is set even in case of an error
          // Check if error is network error (no response received)
          // Display a custom message if there is no internet connection
          //   Alert.alert(
          //     "Došlo je do problema s povezivanjem s Hayat aplikacijom",
          //     "Provjerite vašu konekciju i pokušajte opet"
          //   );
        }
      }
    };

    fetchData();
  }, [dispatch]);

  {
    /*
        useEffect(() => {
            if (userInfoLoaded && userInfo && !userInfo.confirmed) {
                // User is logged in but not confirmed, show an alert
                Alert.alert(
                    "Verify Your Account",
                    "You need to verify your account. Check your email."
                );
            }
        }, [userInfo, userInfoLoaded]);
    */
  }

  const categoriesData = useSelector(
    (state) => state.selectedContent.categoriesData
  ); // Assuming this holds the full categories array
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [selectedCategory]);

  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 40 : StatusBar.currentHeight;
  const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;

  const { currentPage, hasMore } = useSelector(
    (state) => state.selectedContent
  );

  const [isPageLoading, setIsPageLoading] = useState(false);

  const loadMoreContent = async () => {
    if (!isPageLoading && hasMore) {
      setIsPageLoading(true);
      const nextPage = currentPage + 1;
      if (selectedCategory === "najnovije") {
        await dispatch(
          fetchNajnovijeArticles({
            categoryUrl: selectedCategory,
            page: nextPage,
          })
        );
      } else {
        await dispatch(
          fetchArticlesByCategory({
            categoryUrl: selectedCategory,
            page: nextPage,
          })
        );
      }
      dispatch(setCurrentPage(nextPage)); // Update the current page
      setIsPageLoading(false); // End loading after fetching
    }
  };

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ];

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <StatusBarView />
      <Header />
      <NavList />
      {isConnectionError && <NoConnection />}
      {/* <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      /> */}
      {isLoading && <LoadingScreen />}
      {!isLoading && !isConnectionError && (
        <ScrollView
          bounces={false}
          overScrollMode="never"
          ref={scrollViewRef}
          style={{ height: "100%" }}
          onMomentumScrollEnd={({ nativeEvent }) => {
            const isEnd =
              nativeEvent.layoutMeasurement.height +
                nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 20;

            if (isEnd && hasMore) {
              loadMoreContent();
            }
          }}
        >
          {/* So here, I also need a loader */}
          {selectedCategory === "pocetna" && (
            <>
              <HighlightNews />
              <AdPlacement2 />
              <CategoryHighlightNews />
            </>
          )}
          {selectedCategory === "najnovije" && (
            <Najnovije isPageLoading={isPageLoading} />
          )}
          {selectedCategory !== "pocetna" && (
            <CategoryContent isPageLoading={isPageLoading} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A2F5A",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBar: {
    color: "#fff",
  },
});

export default HomeScreen;
