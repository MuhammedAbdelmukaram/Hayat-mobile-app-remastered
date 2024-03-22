import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

import Header from "../components/Common/Header";
import StatusBarView from "../components/Common/StatusBarView";

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const getTokenFromAsyncStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        setNotificationsEnabled(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getTokenFromAsyncStorage();
  }, []);

  const sendTokenToServer = async (token, value) => {
    try {
      await fetch(`${API_URL}/fcm-tokens`, {
        method: value ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fcmToken: token }),
      });
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  };

  const handleAsyncToken = async (token, value) => {
    try {
      if (value) await AsyncStorage.setItem("token", token);
      else await AsyncStorage.removeItem("token");
    } catch (e) {
      // saving error
    }
  };

  const handleNotificationChange = async (value) => {
    setNotificationsEnabled(value); // Update state immediately

    messaging()
      .getToken()
      .then((token) => {
        sendTokenToServer(token, value);
        handleAsyncToken(token, value);
      });
  };

  return (
    <View>
      <StatusBarView backgroundColor="#1A2F5A" />
      <Header isHome={false} isSettings />

      <TouchableOpacity style={styles.button}>
        <Image
          source={require("../assets/notificationIcon.png")}
          style={styles.backIcon}
          resizeMode={"contain"}
        />
        <View style={styles.texts}>
          <Text style={styles.userInfoText}>Notifikacije</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#1a2f5a" }}
            style={styles.switchStyle}
            thumbColor={notificationsEnabled ? "#b2c7f5" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => handleNotificationChange(value)}
            value={notificationsEnabled}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Upalite Notifikacije</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#1a2f5a" }}
              style={styles.switchStyle}
              thumbColor={notificationsEnabled ? "#b2c7f5" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => handleNotificationChange(value)}
              value={notificationsEnabled}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button}>
        <Image
          source={require("../assets/version.png")}
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
  userInfoContainer: {},
  userInfoText: {
    fontWeight: "bold",
  },
  userInfo: {},
  switchStyle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Scale by 1.5 times the original size
    marginVertical: 10, // Add some vertical margin if needed
  },
  button: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    height: 90,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  texts: {
    marginLeft: 20,
    flex: 1, // Added flex to make the texts take the remaining space
    flexDirection: "row", // Align texts and switch horizontally
    alignItems: "center",
    justifyContent: "space-between", // Align texts and switch horizontally
  },
  backIcon: {
    width: 36,
    height: 36,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    marginTop: 22,
    backgroundColor: "#1A2F5A",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default Settings;
