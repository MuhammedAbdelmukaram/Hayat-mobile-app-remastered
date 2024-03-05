import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    setNajnovijeData,
    setLoading,
    setHasMore,
    setCurrentPage,
    fetchNajnovijeArticles
} from '../redux/slices/selectedContentSlice';
import Priority2 from '../components/Priority2';
import Priority3 from '../components/Priority3';
import Priority5 from '../components/Priority5';
import { API_URL } from '@env';
import Priority6 from "../components/Priority6";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdPlacement4 from '../Ads/AdPlacement4';
const Najnovije = ({isPageLoading}) => {
    const dispatch = useDispatch();
    const { najnovijeData, currentPage, hasMore } = useSelector((state) => state.selectedContent);
    const [articles, setArticles] = useState([]);


    console.log(currentPage);

    useEffect(() => {
        // Append fetched articles to local state to accumulate articles
        setArticles(prevArticles => [...prevArticles, ...najnovijeData]);
    }, [najnovijeData]);


    const loadMoreArticles = () => {
        if (!isPageLoading && hasMore) {
            dispatch(fetchNajnovijeArticles(currentPage + 1));
        }
    };



    return (
        <View>
          <AdPlacement4 />
            {najnovijeData.map((article, index) => {
                if (article.video_post) {
                    return (
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
                    return (
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
                    return (
                        <Priority6
                            key={article._id}
                            articleID={article._id}
                            image={{ uri: article.image_list[0]?.url }}
                            articleTitle={article.title}
                        />
                    );
                }
            })}
            {isPageLoading &&


                <ActivityIndicator size="large" color="#1A2F5A" />

            }
        </View>
    );
};

export default Najnovije;
