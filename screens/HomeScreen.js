// components/HomeScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  SectionList,
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
  fetchHighlightData,
  fetchMainArticlesData,
  fetchArticlesByCategory,
  fetchNajnovijeArticles,
  getCategories,
  setCurrentPage,
  setHighlightData,
  setLoading,
  setMainArticles,
} from "../redux/slices/selectedContentSlice";
import CategoryHighlightNews from "../components/CategoryHighlightNews";
import Najnovije from "../components/HomeScreen/Najnovije";
import LoadingScreen from "../components/Common/LoadingScreen";
import AdPlacement from "../components/Ads/AdPlacement";
import NoConnection from "../components/NoConnection";
import Priority from "../components/Priority";

const theme = {
  ...DefaultTheme,
  fonts: {
    main: "Assistant",
  },
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [data, setData] = useState([]);

  // Function to update loading state
  const expoPushToken = useSelector(
    (state) => state.notification.expoPushToken
  );

  const {
    loading: isLoading,
    categoriesData,
    selectedCategory,
    highlightData,
    mainArticles,
    najnovijeData,
  } = useSelector((state) => state.selectedContent);

  const getCategoryName = (categoryId) => {
    const category = categoriesData?.find((c) => c._id == categoryId);
    return category ? category.name : "Unknown Category";
  };

  const setPriorityAccordingToSortOrder = (articles, sortOrder) => {
    const sortedData = [];
    articles.forEach((article, index) => {
      const newArticle = { ...article, priority: sortOrder[index] };
      sortedData.push(newArticle);
    });
    return sortedData;
  };

  const sortHighlightArticlesAccordingToPriority = (articles) => {
    const sortOrder = [2, 5, 4, 3, 4, 3, 6];
    const sortedData = [];

    const articlesByPriority = {};
    articles.forEach((article) => {
      if (!articlesByPriority[article.priority]) {
        articlesByPriority[article.priority] = [];
      }
      articlesByPriority[article.priority].push(article);
    });

    sortOrder.forEach((priority) => {
      if (
        articlesByPriority[priority] &&
        articlesByPriority[priority].length > 0
      ) {
        // Take the next article from the corresponding category
        sortedData.push(articlesByPriority[priority].shift());
      }
    });
    return sortedData;
  };

  const setPriorityAccordingToNajnovijeArticles = (articles) => {
    const sortedData = [];
    articles.forEach((article, index) => {
      const newArticle = {
        ...article,
        priority: article.video_post ? 2 : article.photo_post ? 3 : 6,
      };
      sortedData.push(newArticle);
    });
    return sortedData;
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const highlightData = await dispatch(fetchHighlightData());
  //     const mainArticles = await dispatch(fetchMainArticlesData());
  //     console.log("hig", mainArticles);

  //     const highlightSortedData = sortHighlightArticlesAccordingToPriority(
  //       highlightData.payload
  //     );

  //     const listData = [];

  //     highlightSortedData &&
  //       listData.push({
  //         title: "Highlight",
  //         data: highlightSortedData,
  //         adId: 2,
  //       });

  //     const categoryDataSortOrders = [
  //       [2, 3, 3, 5, 5, 5, 3],
  //       [2, 4, 4, 3, 3, 5, 5],
  //       [2, 5, 4, 4, 3, 3, 5],
  //     ];

  //     mainArticles?.payload.forEach((categoryArticles, categoryIndex) => {
  //       const categoryName = getCategoryName(categoryArticles[0].category);
  //       const algoIndex = categoryIndex % 3;
  //       const selectedArticles = categoryArticles.slice(0, 7);

  //       const categorySortedData = setPriorityAccordingToSortOrder(
  //         selectedArticles,
  //         categoryDataSortOrders[algoIndex]
  //       );

  //       listData.push({
  //         title: categoryName,
  //         data: categorySortedData,
  //         adId: categoryIndex === 0 ? 5 : categoryIndex === 1 ? 6 : null,
  //       });
  //     });

  //     setData(listData);
  //   };

  //   fetchData();
  // }, []);

  //console.log(userInfo);
  useEffect(() => {
    if (highlightData && mainArticles) {
      // const fetchData = async () => {
      setDataLoaded(false); // THE LOADER WHICH WORKS NOW
      dispatch(setLoading(true));

      try {
        const highlightSortedData =
          sortHighlightArticlesAccordingToPriority(highlightData);

        const listData = [];

        highlightSortedData &&
          listData.push({
            title: "Highlight",
            data: highlightSortedData,
            adId: 2,
          });

        const categoryDataSortOrders = [
          [2, 3, 3, 5, 5, 5, 3],
          [2, 4, 4, 3, 3, 5, 5],
          [2, 5, 4, 4, 3, 3, 5],
        ];

        mainArticles?.forEach((categoryArticles, categoryIndex) => {
          const categoryName = getCategoryName(categoryArticles[0].category);
          const algoIndex = categoryIndex % 3;
          const selectedArticles = categoryArticles.slice(0, 7);

          const categorySortedData = setPriorityAccordingToSortOrder(
            selectedArticles,
            categoryDataSortOrders[algoIndex]
          );

          listData.push({
            title: categoryName,
            data: categorySortedData,
            adId: categoryIndex === 0 ? 5 : categoryIndex === 1 ? 6 : null,
          });
        });

        setData(listData);
        // Fetching highlight data
        // const highlightResponse = await axios.get(
        //   `${API_URL}/articles/highlight`
        // );
        // dispatch(setHighlightData(highlightResponse.data));

        // Fetching main articles data (moved from CategoryHighlightNews)
        // const mainArticlesResponse = await axios.get(
        //   `${API_URL}/articles/main`
        // );
        // dispatch(setMainArticles(mainArticlesResponse.data));

        // if (highlightData) {
        //   // console.log("show");
        //   const highlightSortedData =
        //     sortHighlightArticlesAccordingToPriority(highlightData);

        //   const listData = [];

        //   highlightSortedData &&
        //     listData.push({
        //       title: "Highlight",
        //       data: highlightSortedData,
        //       adId: 2,
        //     });

        //   const categoryDataSortOrders = [
        //     [2, 3, 3, 5, 5, 5, 3],
        //     [2, 4, 4, 3, 3, 5, 5],
        //     [2, 5, 4, 4, 3, 3, 5],
        //   ];
        //   mainArticlesResponse.data.forEach(
        //     (categoryArticles, categoryIndex) => {
        //       const categoryName = getCategoryName(
        //         categoryArticles[0].category
        //       );
        //       const algoIndex = categoryIndex % 3;
        //       const selectedArticles = categoryArticles.slice(0, 7);

        //       const categorySortedData = setPriorityAccordingToSortOrder(
        //         selectedArticles,
        //         categoryDataSortOrders[algoIndex]
        //       );

        //       listData.push({
        //         title: categoryName,
        //         data: categorySortedData,
        //         adId: categoryIndex === 0 ? 5 : categoryIndex === 1 ? 6 : null,
        //       });
        //     }
        //   );

        //   setData(listData);
        // }

        setDataLoaded(true);
        dispatch(setLoading(false));
        setIsConnectionError(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!error.response) {
          setIsConnectionError(true);
          setDataLoaded(false);
        }
      }
      // };

      // if (highlightData && mainArticles) fetchData();
    }

    if (najnovijeData) {
      const najnovijeSortedData =
        setPriorityAccordingToNajnovijeArticles(najnovijeData);

      const listData = [];

      listData.push({
        title: "Najnovije",
        data: najnovijeSortedData,
      });
      setData(listData);
    }
  }, [highlightData, mainArticles, najnovijeData]);

  // useEffect(() => {
  //   if (userInfoLoaded && userInfo && !userInfo.confirmed) {
  //     // User is logged in but not confirmed, show an alert
  //     Alert.alert(
  //       "Verify Your Account",
  //       "You need to verify your account. Check your email."
  //     );
  //   }
  // }, [userInfo, userInfoLoaded]);

  // const categoriesData = useSelector(
  //   (state) => state.selectedContent.categoriesData
  // );
  // Assuming this holds the full categories array
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [selectedCategory]);

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

  const najnovijeAdsOrderId = { 2: 4, 8: 5, 17: 6 };

  const Item = ({ item, section, index }) => (
    <>
      <Priority key={item._id} article={item} />
      {section.adId && index === section?.data?.length - 1 && (
        <AdPlacement id={section.adId} />
      )}
      {selectedCategory === "najnovije" && [2, 8, 17].includes(index) && (
        <AdPlacement id={najnovijeAdsOrderId[index]} />
      )}
    </>
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
      {isLoading && <LoadingScreen />}
      {!isLoading && !isConnectionError && (
        <>
          <SectionList
            refreshing={isLoading}
            style={{ height: "100%" }}
            sections={data}
            renderItem={({ item, section, index, seperators }) => {
              return <Item item={item} section={section} index={index} />;
            }}
            renderSectionHeader={({ section: { title } }) =>
              title !== "Highlight" &&
              selectedCategory === "pocetna" && (
                <View style={styles.categoryContainer}>
                  <View style={{ backgroundColor: "#fff", paddingBottom: 10 }}>
                    <View style={styles.categoryName}>
                      <Text style={styles.category}>{title}</Text>
                    </View>
                  </View>
                </View>
              )
            }
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => `${item.title}-${index}`}
          />
          {/* <ScrollView
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
            {selectedCategory === "pocetna" && (
              <>
                <HighlightNews />
                <AdPlacement id={2} />
                <CategoryHighlightNews />
              </>
            )}
            {selectedCategory === "najnovije" && (
              <Najnovije isPageLoading={isPageLoading} />
            )}
            {selectedCategory !== "pocetna" && (
              <CategoryContent isPageLoading={isPageLoading} />
            )}
          </ScrollView> */}
        </>
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
  categoryName: {
    backgroundColor: "#1A2F5A",
    paddingHorizontal: 20,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  category: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  categoryContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
