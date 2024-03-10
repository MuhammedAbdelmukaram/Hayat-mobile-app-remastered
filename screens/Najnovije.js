import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setNajnovijeData,
  setLoading,
  setHasMore,
  setCurrentPage,
  fetchNajnovijeArticles,
} from "../redux/slices/selectedContentSlice";
import Priority2 from "../components/Priority2";
import Priority3 from "../components/Priority3";
import Priority5 from "../components/Priority5";
import { API_URL } from "@env";
import Priority6 from "../components/Priority6";

const Najnovije = ({ isPageLoading }) => {
  const dispatch = useDispatch();
  const { najnovijeData } = useSelector((state) => state.selectedContent);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Append fetched articles to local state to accumulate articles
    setArticles((prevArticles) => [...prevArticles, ...najnovijeData]);
  }, [najnovijeData]);

  const renderArticles = () => {
    const content = [];
    najnovijeData.forEach((article, index) => {
      // Add article based on its type
      if (article.video_post) {
        content.push(
          <Priority2
            key={article._id}
            articleID={article._id}
            image={{ uri: article.image_list[0]?.url }}
            articleTitle={article.title}
            articleSubtitle={article.subtitle}
            article={article}
          />
        );
      } else if (article.photo_post) {
        content.push(
          <Priority3
            key={article._id}
            articleID={article._id}
            image={{ uri: article.image_list[0]?.url }}
            articleTitle={article.title}
            articleSubtitle={article.subtitle}
            article={article}
          />
        );
      } else if (article.text_post) {
        content.push(
          <Priority6
            key={article._id}
            articleID={article._id}
            image={{ uri: article.image_list[0]?.url }}
            articleTitle={article.title}
          />
        );
      }

      // Insert ads at specific positions
      if (index === 2 || index === 8 || index === 17) {
        // After 3rd, 9th, and 18th articles
        content.push(
          <View
            key={`ad-${index}`}
            style={{ alignItems: "center", marginVertical: 20 }}
          >
            {/* Replace with your actual Ad component or view */}
            <Text>Ad Placeholder</Text>
          </View>
        );
      }
    });
    return content;
  };

  return (
    <View>
      {renderArticles()}
      {isPageLoading && <ActivityIndicator size="large" color="#1A2F5A" />}
    </View>
  );
};

export default Najnovije;
