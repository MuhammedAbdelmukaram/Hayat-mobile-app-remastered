import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import messaging from "@react-native-firebase/messaging";
import { API_URL } from "@env";

import Header from "../components/Common/Header";
import StatusBarView from "../components/Common/StatusBarView";

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

  const handleNotificationChange = async (value) => {
    setNotificationsEnabled((previousState) => !previousState);

    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     console.log("Device token:", token);
    //     sendTokenToServer(token, value); // Send the token to your server
    //   });
  };

  return (
    <View>
      <StatusBarView backgroundColor="#1A2F5A" />
      <Header isHome={false} isSettings />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("../assets/notificationIcon.png")}
          style={styles.backIcon}
          resizeMode={"contain"}
        />
        <View style={styles.texts}>
          <Text style={styles.userInfoText}>Notifikacije</Text>
          <Text style={styles.userInfo}>Isključeno</Text>
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
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], // Scale by 1.5 times the original size
    marginVertical: 10, // Add some vertical margin if needed
  },
  button: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  texts: {
    marginLeft: 20,
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
