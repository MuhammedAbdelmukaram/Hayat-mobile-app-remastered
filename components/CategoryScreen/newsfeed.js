import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import Priority2 from '../Priority2';
import Priority3 from '../Priority3';
import Priority5 from '../Priority5';
import Priority6 from "../Priority6";
import AdPlacement4 from "../../Ads/AdPlacement4";

const NewsFeed = ({ onEndReached, isPageLoading }) => {
    const contentData = useSelector((state) => state.selectedContent.contentData);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        if (contentData) {
            // Assuming contentData is now just an array of articles
            setArticles(prev => [...prev, ...contentData]);
        }
    }, [contentData]);

    if (!contentData) {
        return <ActivityIndicator size="large" color="#1A2F5A" />;
    }

    // Combine your logic for handling first instances of each post type and the remaining articles.
    const renderArticlesAndAds = () => {
        const elements = []; // Array to hold both articles and ads

        // Assuming you still want to show first of each type at the top
        const firstVideo = contentData.find(article => article.video_post);
        const firstPhoto = contentData.find(article => article.photo_post);
        const firstText = contentData.find(article => article.text_post);

        // Add them with their respective components
        if (firstVideo) {
            elements.push(
                <Priority2
                    key={firstVideo._id}
                    articleID={firstVideo._id}
                    image={{ uri: firstVideo.image_list[0]?.url }}
                    articleTitle={firstVideo.title}
                    articleSubtitle={firstVideo.subtitle}
                    article={firstVideo}
                />
            );
        }
        if (firstPhoto) {
            elements.push(
                <Priority3
                    key={firstPhoto._id}
                    articleID={firstPhoto._id}
                    image={{ uri: firstPhoto.image_list[0]?.url }}
                    articleTitle={firstPhoto.title}
                    articleSubtitle={firstPhoto.subtitle}
                    article={firstPhoto}
                />
            );
        }
        if (firstText) {
            elements.push(
                <Priority5
                    key={firstText._id}
                    articleID={firstText._id}
                    image={{ uri: firstText.image_list[0]?.url }}
                    articleTitle={firstText.title}
                    articleSubtitle={firstText.subtitle}
                    article={firstText}
                />
            );
        }

        // Now add the remaining articles with ads inserted at specific positions
        contentData.forEach((article, index) => {
            if (index === 3 || index === 9 || index === 18) { // Positions after 3rd, 9th, and 18th articles
                elements.push(
                    <View key={`ad-${index}`} style={{ alignItems: 'center', marginVertical: 20 }}>
                        {/* Placeholder for an advertisement */}
                        <AdPlacement4/>
                    </View>
                );
            }

            // Only add if it's not one of the firsts
            if (![firstVideo, firstPhoto, firstText].some(firstArticle => firstArticle && firstArticle._id === article._id)) {
                let PriorityComponent = article.video_post ? Priority2 :
                    article.photo_post ? Priority3 :
                        article.text_post ? Priority6 : null;

                if (PriorityComponent) {
                    elements.push(
                        <PriorityComponent
                            key={article._id}
                            articleID={article._id}
                            image={{ uri: article.image_list[0]?.url }}
                            articleTitle={article.title}
                            articleSubtitle={article.subtitle}
                            article={article}
                        />
                    );
                }
            }
        });

        return elements;
    };

    return (
        <View>
            {renderArticlesAndAds()}
            {isPageLoading && <ActivityIndicator size="large" color="#1A2F5A" />}
        </View>
    );
};

export default NewsFeed;


