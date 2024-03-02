import React from 'react';
import {Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import HeaderAccount from "../components/Account/headerAccount";

const Settings = () => {
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

            <TouchableOpacity style={styles.button}>
                <Image
                    source={require('../assets/notificationIcon.png')}
                    style={styles.backIcon}
                    resizeMode={"contain"}
                />
                <View style={styles.texts}>
                    <Text style={styles.userInfoText}>Notifikacije</Text>
                    <Text style={styles.userInfo}>Isključeno</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Image
                    source={require('../assets/version.png')}
                    style={styles.backIcon}
                    resizeMode={"contain"}
                />
                <View style={styles.texts}>
                    <Text style={styles.userInfoText}>Verzija</Text>
                    <Text style={styles.userInfo}>1.0.0</Text>
                </View>
            </TouchableOpacity>




        </View>
    );
};


const styles = StyleSheet.create({
    userInfoContainer:{
    },
    userInfoText:{
        fontWeight:"bold"
    },
    userInfo:{

    },
    button:{
        display:"flex",
        alignItems:"center",
        flexDirection:"row",
        backgroundColor:"#ffffff",
        paddingVertical:14,
        paddingHorizontal:20,
        borderWidth:1,
        borderColor:"#eaeaea"
    },
    texts:{
        marginLeft:20
    },
    backIcon:{
        width: 36,
        height: 36
    }
})
export default Settings;