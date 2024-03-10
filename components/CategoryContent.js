import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Newsfeed from "./CategoryScreen/newsfeed";
import { fetchArticlesByCategory } from "../redux/slices/selectedContentSlice";

const CategoryContent = ({ loadMore, isPageLoading }) => {
  // Get contentData from Redux store
  const contentData = useSelector((state) => state.selectedContent.contentData);
  const dispatch = useDispatch();
  const { selectedCategory, currentPage } = useSelector(
    (state) => state.selectedContent
  );

  const loadMoreContent = () => {
    const nextPage = currentPage + 1;
    dispatch(
      fetchArticlesByCategory({ categoryUrl: selectedCategory, page: nextPage })
    );
  };

  return (
    <View style={styles.container}>
      {/* Render contentData here */}
      <View>
        <Newsfeed
          onEndReached={loadMoreContent}
          isPageLoading={isPageLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e1e1e1",
  },
});

export default CategoryContent;
