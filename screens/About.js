import React from 'react';
import {Platform, StatusBar, View, Text} from "react-native";
import HeaderAccount from "../components/Account/headerAccount";

const About = () => {
    const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;
    const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;



    return (
        <View>
            <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: "#1A2F5A" }}>
                <StatusBar
                    translucent
                    backgroundColor="#1A2F5A"
                    barStyle="light-content"
                />
            </View>
            <HeaderAccount/>


            <Text>
                Hayat Media BiH
            </Text>
        </View>
    );
};

export default About;