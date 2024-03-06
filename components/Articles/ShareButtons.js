import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    handleFacebookPress,
    handleInstagramPress, handleMessengerPress,
    handleTwitterPress, handleViberPress, handleWhatsAppPress,
    handleYouTubePress
} from "../../util/SocialMediaLinks";
import { API_URL } from '@env';

const ShareButtons = ({ articleID, articleTitle }) => {

    // Replace spaces with dashes in the articleTitle
    const formattedArticleTitle = articleTitle.replace(/ /g, '-');


    console.log(formattedArticleTitle);
    // Concatenate the API URL with 'app' and the articleID
    const URL = `https://www.hayat.ba//article/${formattedArticleTitle}/${articleID}`;
    console.log(URL);

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleFacebookPress(URL)}>
                <Image source={require('../../assets/icons/facebookIcon.png')} style={styles.menuHeaderIcon}></Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleTwitterPress(URL)}>
                <Image source={require('../../assets/icons/twitterIcon.png')} style={styles.menuHeaderIcon}></Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleViberPress(URL)}>
                <Image source={require('../../assets/Viber.png')} style={styles.menuHeaderIcon}></Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleWhatsAppPress(URL)}>
                <Image source={require('../../assets/WhatApp.png')} style={styles.menuHeaderIcon}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleMessengerPress(URL)}>
                <Image source={require('../../assets/Messenger.png')} style={styles.menuHeaderIcon}></Image>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: "10%",
        gap: 5
    },
    iconWrapper: {
        backgroundColor: '#1A2F5A',
        borderRadius: 50,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    menuHeaderIcon: {
        height: 22,
        width: 22,
    },
});

export default ShareButtons;
