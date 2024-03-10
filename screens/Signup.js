import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/hayatLogo.png";
import axios from "axios";
import { API_URL } from "@env";
import Show from "../assets/visible.png";
import Hide from "../assets/invisible.png";
import Checkbox from "expo-checkbox";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { setUser } from "../redux/slices/userSlice";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptTOS, setAcceptTOS] = useState(false); // Terms of Service acceptance
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const storeCredentials = async (email, password) => {
    try {
      await AsyncStorage.setItem(
        "@credentials",
        JSON.stringify({ email, password })
      );
    } catch (e) {
      // saving error
      console.error("Failed to store credentials:", e);
    }
  };

  const storeUserDetails = async (details) => {
    try {
      await AsyncStorage.setItem("@userDetails", JSON.stringify(details));
    } catch (e) {
      console.error("Failed to store user details:", e);
    }
  };

  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (!acceptTOS) {
      // Check if the terms of service are not accepted
      setShowCustomAlert(true);
      return; // Stop the function if the terms are not accepted
    }

    try {
      // Retrieve stored user details or get them from state
      const userDetails = {
        email,
        password,
        firstName,
        lastName,
      };

      // Perform the signup API call here
      const response = await axios.post(`${API_URL}/user/signup`, userDetails);

      // Assuming the response includes the token and user details
      // Here you would typically store the token using SecureStore and update your app state
      await SecureStore.setItemAsync("userToken", response.data.token);
      dispatch(setUser(response.data.user));

      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Account creation failed:", error);
    }
  };

  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 40 : StatusBar.currentHeight;
  const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: "#ffffff" }}>
        <StatusBar
          translucent
          backgroundColor="#1A2F5A"
          barStyle="light-content"
        />
      </View>

      <View
        style={{
          width: "100%",
          backgroundColor: "#1A2F5A",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
        }}
      >
        <Image source={logo} style={styles.image} />
      </View>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            alignSelf: "flex-start",
            marginBottom: 20,
            marginTop: 30,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 3 }}>
            Registruj se
          </Text>
        </View>
        <View style={styles.inputs}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor={"#a8a8a8"}
            keyboardType="email-address"
          />

          <View style={styles.passContainer}>
            <TextInput
              style={[styles.inputPass, { flex: 1 }]} // Make input flex to take up available space
              onChangeText={setPassword}
              value={password}
              placeholder="Šifra"
              secureTextEntry={!passwordVisible}
              placeholderTextColor={"#a8a8a8"}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Image
                source={passwordVisible ? Hide : Show}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
            placeholder="Ime"
            placeholderTextColor={"#a8a8a8"}
          />
          <TextInput
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
            placeholder="Prezime" // Last name in Croatian
            placeholderTextColor={"#a8a8a8"}
          />

          <View style={styles.tosContainer}>
            <Checkbox
              value={acceptTOS}
              onValueChange={(newValue) => setAcceptTOS(newValue)}
              color={acceptTOS ? "#1A2F5A" : undefined} // Customize as needed
              style={styles.checkbox}
            />
            <Text style={styles.normalText}>Prihvati </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.tosText}>Uslove Korištenja</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Registriraj se</Text>
        </TouchableOpacity>

        {/* Custom Alert Modal for Terms of Service */}
        {showCustomAlert && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showCustomAlert}
            onRequestClose={() => setShowCustomAlert(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.customAlertView}>
                <Text style={styles.alertTitle}>Obavijest</Text>
                <Text style={styles.alertMessage}>
                  Morate prihvatiti Uslove Korištenja prije registracije naloga.
                </Text>
                <TouchableOpacity
                  style={styles.alertButton}
                  onPress={() => setShowCustomAlert(false)}
                >
                  <Text style={styles.alertButtonText}>Uredu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
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
                <ScrollView style={styles.modalContent}>
                  <Text style={styles.heading}>Pravila Upotrebe</Text>
                  <Text style={styles.text}>
                    Potvrđujem da imam 18 godina ili više i da sam pročitao/la i
                    da prihvatam Opšte uslove korištenja Hayat d.o.o. Sarajevo.
                    U skladu sa odredbom člana 5. Zakona o zaštiti
                    ličnih/osobnih podataka („Sl. glasnik BiH“ broj 49/06), ovim
                    izjavljujem i aceptiranjem potvrđujem svoju saglasnost da
                    Hayat d.o.o. Sarajevo poduzima sve radnje vezano za obradu
                    mojih ličnih/osobnih podataka i to: ime, prezime, email, a
                    sve u svrhu ućešća za uručivanje poklona. Izjavljujem i
                    aceptiranjem potvrđujem da sam od strane Hayat d.o.o.
                    Sarajevo obaviješten/a o razlozima prikupljanja podataka i
                    davanja ove saglasnosti u skladu sačlanom 22. Zakona o
                    zaštiti ličnih podataka („Sl. glasnik BiH“ broj 49/06).
                    Saglasnost za obradu gore navedenih ličnih/osobnih podataka
                    se daje/odnosi na period do završetka odabira osobe kojoj će
                    biti uručen poklon. Ova Suglasnost se daje u naprijed
                    navedenu svrhu i u druge svrhe se ne može koristiti, a
                    vrijedi do okončanja postupka odabira osobe kojoj će biti
                    uručen poklon. Pod punom materijalnom i krivičnom
                    odgovornošću izjavljujem da su svi upisani podaci istiniti.
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.closeButtonText}>Zatvori</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 26,
  },
  image: {
    marginTop: "10%",

    width: "50%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  inputs: {
    marginTop: "10%", // Reduced the margin-top as compared to the login screen
    width: "100%",
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#dadada",
    padding: 10,
    width: "100%",
  },

  eyeIcon: {
    borderBottomWidth: 1,
    borderColor: "#dadada",
    paddingBottom: 12,
    marginBottom: 10.1,
    alignSelf: "flex-end",
  },

  passContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  inputPass: {
    height: 40,
    marginVertical: 10,
    maxWidth: "100%",
    borderBottomWidth: 1,
    borderColor: "#dadada",
    padding: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#1A2F5A",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginTop: 30, // Adjusted the margin-top to be closer to the inputs
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  tosContainer: {
    flexDirection: "row",
    marginTop: 70, // Adjust as needed
    alignItems: "center",
    marginLeft: 4,
  },
  checkbox: {
    marginRight: 8, // Adjust as needed
  },
  normalText: {
    fontSize: 16, // Adjust as needed
  },
  tosText: {
    fontSize: 16, // Adjust as needed
    color: "#1A2F5A", // Adjust as needed
    textDecorationLine: "underline",
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
    borderRadius: 0,
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
    width: "90%", // Set width
    maxHeight: "90%", // Set max height
  },
  heading: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A2F5A", // Heading color
  },
  text: {
    fontSize: 16,
    color: "#000", // Regular text color
    marginBottom: 15,
    textAlign: "justify",
  },
  modalContent: {
    marginBottom: 20, // Space for scrolling
  },
  acceptButton: {
    backgroundColor: "#1A2F5A",
    borderRadius: 0,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    width: 150, // Set width for the button
    justifyContent: "center", // Center button text
  },

  closeButton: {
    backgroundColor: "white", // Set a different color if you prefer
    borderRadius: 0,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    borderColor: "#1A2F5A", // Border color
    borderWidth: 1,
  },
  closeButtonText: {
    color: "#1A2F5A",
    fontWeight: "bold",
    textAlign: "center",
  },
  customAlertView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 0, // Use 0 for no borderRadius if that's your modal style
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
    width: "90%", // Match this with your other modal styles
    maxHeight: "90%",
  },

  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#1A2F5A",
  },
  alertButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  // Removed the registerText and linkText styles as they are not needed in the signup screen
});

export default Signup;
