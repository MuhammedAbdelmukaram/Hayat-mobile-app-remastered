import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "@env";

import {
  appendContentData,
  setAllCategories,
  setContentData,
  setCurrentPage,
  setHasMore,
  setHighlightData,
  setLoading,
  setMainArticles,
  setNajnovijeData,
  setScrollPosition,
  setSelectedCategory,
} from "../../redux/slices/selectedContentSlice";

const NavList = () => {
  const dispatch = useDispatch();

  const {
    categoriesData,
    selectedCategory,
    scrollPosition,
    swipeObject,
    loading,
  } = useSelector((state) => state.selectedContent);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
  }, [scrollPosition]);

  useEffect(() => {
    if (!swipeObject || loading || !categoriesData) return;

    const { categoryUrl, direction } = swipeObject;
    const currentCategory = categoriesData.find(
      (category) => category.category_url === categoryUrl
    );
    const index = categoriesData.indexOf(currentCategory);
    if (direction === "right" && index !== 0) {
      const previousCategory = categoriesData[index - 1];
      handleCategoryPress({
        categoryUrl: previousCategory.category_url,
        index: index - 1,
      });
      dispatch(setLoading(true));
    }
    if (direction === "left" && index !== categoriesData.length - 1) {
      const nextCategory = categoriesData[index + 1];
      handleCategoryPress({
        categoryUrl: nextCategory.category_url,
        index: index + 1,
      });
      dispatch(setLoading(true));
    }
  }, [swipeObject]);

  const mainCategories = ["pocetna", "najnovije"];

  const handleCategoryPress = async ({ categoryUrl, index, page = 1 }) => {
    dispatch(setLoading(true));
    dispatch(setSelectedCategory(categoryUrl));

    try {
      if (categoryUrl === "pocetna") {
        dispatch(setCurrentPage(1));
        dispatch(setNajnovijeData(null));
        dispatch(setContentData(null));

        const response = await axios.get(`${API_URL}/articles/highlight`);
        const newHighlightData = response.data;
        dispatch(setHighlightData(newHighlightData));

        const mainArticlesResponse = await axios.get(
          `${API_URL}/articles/main`
        );
        dispatch(setMainArticles(mainArticlesResponse.data));
      }

      if (categoryUrl === "najnovije") {
        dispatch(setHighlightData(null));
        dispatch(setMainArticles(null));
        dispatch(setContentData(null));

        const response = await axios.get(
          `${API_URL}/articles/mob/najnovije/${page}`
        );

        if (selectedCategory !== categoryUrl) {
          dispatch(setCurrentPage(1));
          dispatch(setNajnovijeData([]));
          dispatch(setHasMore(true));
        }

        if (page === 1) {
          dispatch(setNajnovijeData(response.data));
        }
        const newNajnovijeData = response.data;
        dispatch(setNajnovijeData(newNajnovijeData));
      }

      if (!mainCategories.includes(categoryUrl)) {
        if (selectedCategory !== categoryUrl) {
          dispatch(setCurrentPage(1)); // Assuming you have such an action
          dispatch(setContentData([]));
          dispatch(setHasMore(true));
        }

        const response = await axios.get(
          `${API_URL}/articles/mob/${categoryUrl}/${page}`
        );
        if (page === 1) {
          dispatch(setContentData(response.data)); // Replace data for the first page
        } else {
          dispatch(appendContentData(response.data)); // Append data for subsequent pages
        }
      }
    } catch (error) {
      console.error("Error fetching category specific:", error);
    }

    dispatch(setLoading(false));

    const buttonWidth = 120; // Width of each button including padding
    const viewportWidth = Dimensions.get("window").width; // Width of the viewport

    // Calculate the center position of the button to be centered in the viewport
    const buttonCenter = index * buttonWidth + buttonWidth / 2; // Adjust center position for the offset of the first two unaccounted buttons
    const halfViewportWidth = viewportWidth / 2;
    let scrollToPosition = buttonCenter - halfViewportWidth; // Adjust so button is in the middle of the viewport

    // Adjust the maximum scrollable position to ensure we don't scroll beyond content
    // No need to change the calculation for maxScrollPosition here since it accommodates for all categories
    const maxScrollPosition =
      categoriesData.length * buttonWidth + 120 - viewportWidth; // Adjusted for additional offset
    // Ensure the scrollToPosition is within the bounds [0, maxScrollPosition]
    scrollToPosition = Math.max(
      0,
      Math.min(scrollToPosition, maxScrollPosition)
    );

    scrollViewRef.current?.scrollTo({ x: scrollToPosition, animated: true });
    dispatch(setScrollPosition(scrollToPosition));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = response.data;

        dispatch(
          setAllCategories([
            {
              _id: "01",
              category_url: "pocetna",
              name: "Početna",
              order_number: 0,
            },
            {
              _id: "12",
              category_url: "najnovije",
              name: "Najnovije",
              order_number: 0,
            },
            ...data,
          ])
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchPocetna = async () => {
      try {
        const highlightRes = await axios.get(`${API_URL}/articles/highlight`);
        const highlightData = highlightRes.data;
        dispatch(setHighlightData(highlightData));

        const mainArticlesRes = await axios.get(`${API_URL}/articles/main`);
        const mainArticlesData = mainArticlesRes.data;
        dispatch(setMainArticles(mainArticlesData));
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    dispatch(setLoading(true));
    fetchCategories();
    fetchPocetna();
  }, [dispatch]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      bounces={false}
      overScrollMode="never"
    >
      {categoriesData?.map((category, index) => (
        <TouchableOpacity
          key={category._id}
          style={styles.button}
          onPress={() =>
            handleCategoryPress({ categoryUrl: category.category_url, index })
          }
        >
          <Text
            style={[
              styles.buttonText,
              selectedCategory === category.category_url
                ? styles.selectedText
                : null,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A2F5A",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 70,
  },
  button: {
    width: 120,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  buttonText: {
    fontWeight: "500",
    color: "#fff",
    fontSize: 13,
  },
  selectedText: {
    fontWeight: "700",
    color: "#E3E3E3",
    textDecorationLine: "none",
    borderBottomWidth: 0.8,
    borderBottomColor: "#ffffff",
    paddingBottom: 2,
  },
});

export default NavList;
