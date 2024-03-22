import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useFonts } from "@expo-google-fonts/blinker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import SocialMediaIcons from "../Menu/SocialMediaIcons";
import HorizontalLine from "../Menu/HorizontalLine";
import { checkLoginStatus, setLoginState } from "../../redux/slices/authSlice";
import { setSwipeObject } from "../../redux/slices/selectedContentSlice";
import { clearUser } from "../../redux/slices/userSlice";

const Menu = ({ visible, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(-300)); // Initialize to a value off-screen
  const { categoriesData } = useSelector((state) => state.selectedContent);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const getIconStyle = (size) => ({
    width: size,
    height: size,
    resizeMode: "contain", // Ensure the icon fits well within the given dimensions
  });

  const handleCategoryPress = async ({ categoryUrl }) => {
    dispatch(setSwipeObject({ categoryUrl }));
    onClose();
  };

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  const [isModalVisible, setIsModalVisible] = useState(visible);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);

  const scrollViewRef = useRef(null);
  const scrollPosition = useSelector(
    (state) => state.selectedContent.scrollPosition
  ); // Get scroll position from Redux

  useEffect(() => {
    // Scroll to the saved position when component mounts or scrollPosition changes
    scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: false });
  }, [scrollPosition]);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true); // Show the modal first
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide the menu out when it becomes invisible
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsModalVisible(false); // Hide the modal after the animation
        if (onClose) onClose();
      });
    }
  }, [visible]);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      dispatch(setLoginState(false)); // Reflect the logout in the Redux state
      dispatch(clearUser()); // Reset user data in Redux
      Alert.alert("Odjava", "Uspješno ste se odjavili!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Logout failed", error);
      Alert.alert("Error", "Akcija nije uspjela, molimo kontaktirajte podršku");
    }
  };

  const [fontsLoaded] = useFonts({
    Blinker: require("@expo-google-fonts/blinker"),
  });

  return (
    <Modal
      animationType="none"
      // Disable built-in modal animations
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay} // Apply overlay opacity
        activeOpacity={1} // To prevent a visual press effect
        onPress={onClose} // Close the modal when overlay is pressed
      >
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <ScrollView contentContainerStyle={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Image
                source={require("../../assets/hayatLogo.png")}
                style={styles.menuHeaderLogo}
              />
              <SocialMediaIcons />
            </View>

            <HorizontalLine />

            {/* <View style={styles.menuHayatButtons}>
              <TouchableOpacity onPress={onClose} style={styles.menuItem}>
                <Image
                  source={require("../../assets/icons/gledajHayat-icon.png")}
                  style={styles.gledajHayatIcon}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    fontsLoaded && { fontFamily: "Blinker" },
                  ]}
                >
                  GLEDAJHayat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.menuItem}>
                <Image
                  source={require("../../assets/icons/hayatPlayIcon.png")}
                  style={styles.hayatPlayIcon}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    fontsLoaded && { fontFamily: "Blinker" },
                  ]}
                >
                  gledajHAYAT
                </Text>
              </TouchableOpacity>
            </View>

            <HorizontalLine /> */}

            <HorizontalLine />

            <View style={{ marginLeft: 10, paddingVertical: 10 }}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  handleCategoryPress({
                    categoryUrl: "pocetna",
                  });
                }}
              >
                <Image
                  source={require("../../assets/home.png")} // Your home icon
                  style={getIconStyle(24)}
                />
                <Text style={styles.menuItemText}>Pocetna</Text>
              </TouchableOpacity>

              {isLoggedIn && (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate("Account"); // Use your HomeScreen's route name
                      onClose(); // Optionally close the menu
                    }}
                  >
                    <Image
                      source={require("../../assets/account.png")} // Your home icon
                      style={getIconStyle(24)}
                    />
                    <Text style={styles.menuItemText}>Račun</Text>
                  </TouchableOpacity>
                </>
              )}

              {!isLoggedIn && (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate("Login");
                      onClose();
                    }}
                  >
                    <Image
                      source={require("../../assets/login.png")} // Your sign-up icon
                      style={getIconStyle(24)}
                    />
                    <Text style={styles.menuItemText}>Prijavi se</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate("Signup");
                      onClose();
                    }}
                  >
                    <Image
                      source={require("../../assets/register.png")} // Your sign-up icon
                      style={getIconStyle(24)}
                    />
                    <Text style={styles.menuItemText}>Registruj se</Text>
                  </TouchableOpacity>
                </>
              )}

              {isLoggedIn && (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.menuItem}
                >
                  <Image
                    source={require("../../assets/logout.png")} // Your sign-up icon
                    style={getIconStyle(24)}
                  />
                  <Text style={styles.menuItemText}>Odjavi se</Text>
                </TouchableOpacity>
              )}

              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate("Survey"); // Navigate to the Login screen
                  onClose(); // Close the menu
                }}
              >
                <Text style={styles.menuItemText}>Anketa</Text>
              </TouchableOpacity> */}
            </View>

            <HorizontalLine />

            <View style={styles.menuCategories}>
              {categoriesData ? (
                categoriesData.length > 0 ? (
                  categoriesData.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.menuItem}
                      onPress={() =>
                        handleCategoryPress({
                          categoryUrl: category.category_url,
                          index,
                        })
                      }
                    >
                      <Text style={styles.menuItemText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.menuItemMessage}>
                    Provjerite vašu konekciju
                  </Text>
                )
              ) : (
                <Text style={styles.menuItemText}>Učitavanje...</Text>
              )}
            </View>

            <View style={styles.linePadding}>
              <HorizontalLine />
            </View>

            {/* Add more menu items */}
          </ScrollView>
          <View style={styles.menuBottomSection}>
            <View style={styles.menuCategories}>
              <TouchableOpacity
                style={styles.menuItemBottom}
                onPress={() => {
                  navigation.navigate("Settings");
                  // Use your HomeScreen's route name
                  onClose(); // Optionally close the menu
                }}
              >
                <Image
                  source={require("../../assets/settings.png")} // Your home icon
                  style={getIconStyle(28)}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItemBottom}
              onPress={() => {
                navigation.navigate("About");
                // Use your HomeScreen's route name
                onClose(); // Optionally close the menu
              }}
            >
              {/*<Image*/}
              {/*    source={require('../../assets/about.png')} // Your home icon*/}
              {/*    style={getIconStyle(28)}*/}
              {/*/>*/}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    alignItems: "flex-start", // Center content horizontally
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1A2F5A",
    justifyContent: "",
    width: "80%",
  },
  menuContent: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#1A2F5A",
    paddingLeft: 16,
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 40 : 0, // Apply paddingTop only for iOS
  },
  menuHeader: {
    backgroundColor: "#1A2F5A",
    height: 66,
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },

  menuHayatButtons: {
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
  },

  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#1A2F5A",
    paddingLeft: 12,
    paddingVertical: 12,
    marginLeft: -16,
  },

  menuItemBottom: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A2F5A",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  gledajHayatIcon: {
    height: 35,
    width: 35,
  },
  hayatPlayIcon: {
    height: 35,
    width: 35,
  },

  menuItemText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: "8%",
    fontWeight: "600",
  },

  menuItemMessage: {
    color: "#dc0a0a",
    fontSize: 17,
    marginLeft: "8%",
    fontWeight: "600",
  },

  iconStyle: {
    height: 20,
  },

  menuHeaderLogo: {
    width: 120,
    height: 23,
  },

  linePadding: {
    marginTop: 12,
  },

  menuBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  menuCategories: {
    marginTop: 10,
  },
});

export default Menu;
