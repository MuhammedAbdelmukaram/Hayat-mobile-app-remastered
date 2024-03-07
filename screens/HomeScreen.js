// components/HomeScreen.js
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Platform, ScrollView, StatusBar, StyleSheet, View} from "react-native";
import {DefaultTheme} from 'react-native-paper';
import Header from "../components/Common/Header";
import NavList from "../components/Common/NavList";
import HighlightNews from "../components/HomeScreen/HighlightNews";
import CategoryContent from "../components/CategoryContent";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {
    fetchArticlesByCategory,
    fetchNajnovijeArticles,
    setCurrentPage,
    setHighlightData,
    setMainArticles
} from "../redux/slices/selectedContentSlice";
import CategoryHighlightNews from "../components/CategoryHighlightNews";
import Najnovije from "./Najnovije";
import {API_URL} from '@env';
import LoadingScreen from "./LoadingScreen";
import AdPlacement2 from "../Ads/AdPlacement2";

const theme = {
    ...DefaultTheme,
    fonts: {
        main: 'Assistant',
    },
};

const HomeScreen = () => {
    const selectedCategory = useSelector((state) => state.selectedContent.selectedCategory);
    const highlightData = useSelector((state) => state.selectedContent.highlightData);
    const dispatch = useDispatch();
    const [dataLoaded, setDataLoaded] = useState(false);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [userInfoLoaded, setUserInfoLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function to update loading state

    const expoPushToken = useSelector((state) => state.notification.expoPushToken);

    console.log('Expo Push Token from Redux:', expoPushToken);
    const handleLoading = (loading) => {
        setIsLoading(loading);
    };

    // Your existing useEffect hooks and logic...

    if (isLoading) {
        return <LoadingScreen/>; // Display the loading screen if any part of the app is loading
    }


    console.log(userInfo);
    useEffect(() => {
        const fetchData = async () => {
            setDataLoaded(false); // Reset the dataLoaded state before fetching new data

            try {
                // Fetching highlight data
                const highlightResponse = await axios.get(`${API_URL}/articles/highlight`);
                dispatch(setHighlightData(highlightResponse.data));

                // Fetching main articles data (moved from CategoryHighlightNews)
                const mainArticlesResponse = await axios.get(`${API_URL}/articles/main`);

                dispatch(setMainArticles(mainArticlesResponse.data)); // Dispatch the action for main articles

                setDataLoaded(true); // Indicate that data has been loaded
            } catch (error) {
                console.error('Error fetching data:', error);
                setDataLoaded(true); // Ensure the dataLoaded state is set even in case of an error
                if (!error.response) { // Check if error is network error (no response received)
                    // Display a custom message if there is no internet connection
                    Alert.alert(
                        "Došlo je do problema s povezivanjem s Hayat aplikacijom",
                        "Provjerite vašu konekciju i pokušajte opet"
                    );
                }
            }
        };

        fetchData();
    }, [dispatch]);


    {/*
        useEffect(() => {
            if (userInfoLoaded && userInfo && !userInfo.confirmed) {
                // User is logged in but not confirmed, show an alert
                Alert.alert(
                    "Verify Your Account",
                    "You need to verify your account. Check your email."
                );
            }
        }, [userInfo, userInfoLoaded]);
    */}

    const renderContent = () => {
        if (!dataLoaded) {
            // Render loading state or indicator
            return <ActivityIndicator color="#1A2F5A"/>;
        } else if (selectedCategory === "pocetna") {
            // Render HighlightNews component
            return <>
                <HighlightNews/>
                <AdPlacement2/>
                <CategoryHighlightNews/>
                {/* Additional components related to HighlightNews and CategoryHighlightNews */}
            </>
                ;
        } else if (selectedCategory === "najnovije") {
            // Render Najnovije component
            console.log('Selected Category:', selectedCategory);
            return <Najnovije isPageLoading={isPageLoading}/>;
        } else if (selectedCategory !== "pocetna") {
            // Render CategoryContent component with appropriate props
            console.log('Selected Category:', selectedCategory);
            return <CategoryContent isPageLoading={isPageLoading}/>;
        } else {
            // Render the default component (HighlightNews)
            return <HighlightNews/>;
        }
    };

    const categoriesData = useSelector((state) => state.selectedContent.categoriesData); // Assuming this holds the full categories array
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        }
    }, [selectedCategory]);



    const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;
    const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;

    const { currentPage, hasMore } = useSelector((state) => state.selectedContent);


    const [isPageLoading, setIsPageLoading] = useState(false);

    const loadMoreContent = async () => {
        if (!isPageLoading && hasMore) {
            setIsPageLoading(true);
            const nextPage = currentPage + 1;
            if (selectedCategory === 'najnovije') {
                await dispatch(fetchNajnovijeArticles({ categoryUrl: selectedCategory, page: nextPage }));
            } else {
                await dispatch(fetchArticlesByCategory({ categoryUrl: selectedCategory, page: nextPage }));
            }
            dispatch(setCurrentPage(nextPage)); // Update the current page
            setIsPageLoading(false); // End loading after fetching
        }
    };






    return (
        <View style={{height:"100%"}}>
            <View style={{height: STATUS_BAR_HEIGHT, backgroundColor: "#1A2F5A", zIndex: -1}}>
                <StatusBar translucent backgroundColor="#1A2F5A" barStyle="light-content"/>
            </View>
            {isLoading ? (
                <LoadingScreen/>
            ) : (
                <>

                    <Header/>
                    <NavList/>
                    <ScrollView
                        bounces={false}
                        overScrollMode="never"
                        ref={scrollViewRef}
                        style={{ height: "100%" }}
                        onMomentumScrollEnd={({ nativeEvent }) => {

                            const isEnd = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20;

                            if (isEnd && hasMore) {
                                loadMoreContent();
                            }
                        }}
                    >
                        <View>
                            {renderContent()}
                        </View>




                    </ScrollView>

                </>
            )}

        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A2F5A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBar: {
        color: "#fff"
    },
});

export default HomeScreen;
