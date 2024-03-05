import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useSelector} from 'react-redux';
import Priority2 from '../Priority2';
import Priority3 from '../Priority3';
import Priority5 from '../Priority5';
import Priority6 from "../Priority6";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdPlacement5 from '../../Ads/AdPlacement5';
const NewsFeed = ({onEndReached, isPageLoading}) => {
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



    // Find first of each type
    const firstVideo = contentData.find(article => article.video_post);
    const firstPhoto = contentData.find(article => article.photo_post);
    const firstText = contentData.find(article => article.text_post);


    // Remove first of each type from combinedArticles
    const remainingArticles = contentData.filter(article => {
        return (!firstVideo || article._id !== firstVideo._id) &&
            (!firstPhoto || article._id !== firstPhoto._id) &&
            (!firstText || article._id !== firstText._id);
    });

    remainingArticles.forEach((article, index) => {
        console.log(`Article ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`ID: ${article._id}`); // Assuming the property name is _id
        console.log(`Create Date: ${article.create_date}`);
        console.log(`Is Video: ${article.video_post}`);
        console.log(`Is Photo: ${article.photo_post}`);
        console.log(`Is Text: ${article.text_post}`);
        console.log('-----------------------------------'); // Separator for readability
    });





    return (
        <View>
            {/* Display first video, photo, and text post with respective priorities */}
          <AdPlacement5 />
            {firstVideo && (
                <Priority2
                    key={firstVideo._id}
                    articleID={firstVideo._id}
                    image={{ uri: firstVideo.image_list[0]?.url }}
                    articleTitle={firstVideo.title}
                    articleSubtitle={firstVideo.subtitle}
                    article={firstVideo}
                />
            )}
            {firstPhoto && (
                <Priority2
                    key={firstPhoto._id}
                    articleID={firstPhoto._id}
                    image={{ uri: firstPhoto.image_list[0]?.url }}
                    articleTitle={firstPhoto.title}
                    articleSubtitle={firstPhoto.subtitle}
                    article={firstPhoto}
                />
            )}
            {firstText && (
                <Priority3
                    key={firstText._id}
                    articleID={firstText._id}
                    image={{ uri: firstText.image_list[0]?.url }}
                    articleTitle={firstText.title}
                    articleSubtitle={firstText.subtitle}
                    article={firstText}
                />
            )}
            {/* Display the rest of the articles sorted by create_date */}
            {/* Display the rest of the articles sorted by date */}
            {remainingArticles.map(article => {
                let PriorityComponent = null; // Determine which component to use based on the article type
                if (article.video_post) {
                    PriorityComponent = Priority2;
                } else if (article.photo_post) {
                    PriorityComponent = Priority2;
                } else if (article.text_post) {
                    PriorityComponent = Priority6;
                }

                return (
                    PriorityComponent && (
                        <PriorityComponent
                            key={article._id}
                            articleID={article._id}
                            image={{ uri: article.image_list[0]?.url }}
                            articleTitle={article.title}
                            articleSubtitle={article.subtitle} // This might be undefined for Priority5, which is okay if Priority5 does not use subtitle
                            article={article} // Remove if not used
                        />
                    )
                );
            })}

            {isPageLoading &&


                <ActivityIndicator size="large" color="#1A2F5A" />

            }

        </View>
    );
};

export default NewsFeed;
