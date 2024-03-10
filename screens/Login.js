import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, StyleSheet, Image, StatusBar, Alert, Platform} from "react-native";
import logo from "../assets/hayatLogo.png";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {setUser} from "../redux/slices/userSlice";
import {useDispatch} from "react-redux";
import {setLoginState} from "../redux/slices/authSlice";
import {API_URL} from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();


    const handleLogin = async () => {
        setIsSubmitting(true); // Disable the login button
        try {
            const response = await axios.post(`${API_URL}/user/authenticate`, {
                email: email,
                password: password,
                // Add role if needed here
            });
            const tokenString = String(response.data.token);
            //console.log(JSON.stringify(response.data.token, null, 2));

            await SecureStore.setItemAsync('userToken', tokenString);
            const token = await SecureStore.getItemAsync('userToken');

            const config = {
                headers: {Authorization: `Bearer ${tokenString}`}
            };

            const userResponse = await axios.get(`${API_URL}/user/whoami`, config);
            if (userResponse.data) {
                dispatch(setUser(userResponse.data));
                dispatch(setLoginState(true));

                // After successfully fetching user info, process any pending survey responses
                const pendingResponses = await AsyncStorage.getItem('pendingSurveyResponses');
                if (pendingResponses) {
                    const responses = JSON.parse(pendingResponses);
                    const userId = userResponse.data.id; // Adjust based on actual user data structure

                    for (const response of responses) {
                        try {
                            await axios.post(`${API_URL}/surveys/local-response`, {
                                newSurveyData: [{ surveyId: response.surveyId, response: response.response }],
                                userId: userId
                            }, config);

                            // Optionally update some local state or context if needed
                        } catch (error) {
                            console.error('Error submitting cached survey response:', error);
                            // Optionally decide how to handle partial failure
                        }
                    }

                    // Clear the pending survey responses after all have been processed
                    await AsyncStorage.removeItem('pendingSurveyResponses');
                }

                navigation.navigate('HomeScreen');
            }
        } catch (error) {
            console.error('Login failed', error);
            Alert.alert('Greška', 'Pogriješili ste');
        }
        setIsSubmitting(false); // Re-enable the login button
    };


    const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;
    const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;


    return (
        <View style={styles.containerInner}>
            <View style={{width: "100%",
                backgroundColor: "#1A2F5A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 20}}>
                <Image source={logo} style={styles.image}/>
            </View>
            <View style={{display: "flex", alignSelf: "flex-start", marginBottom: 0, marginTop: 30}}>
                <Text style={{fontSize: 22, fontWeight: "bold", marginLeft:23, marginTop:20}}>Prijavi se</Text>
            </View>
            <View style={styles.container}>
                <View style={{height: STATUS_BAR_HEIGHT, backgroundColor: "#1A2F5A"}}>
                    <StatusBar
                        translucent
                        backgroundColor="#1A2F5A"
                        barStyle="light-content"
                    />
                </View>



                <View style={styles.inputs}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={'#a8a8a8'}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Šifra"
                        secureTextEntry
                        placeholderTextColor={'#a8a8a8'}
                    />
                </View>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                    disabled={isSubmitting} // Button is disabled when isSubmitting is true
                >
                    <Text style={styles.buttonText}>Prijavi se</Text>
                </TouchableOpacity>
                {isSubmitting && <Text style={styles.errorText}>Učitavanje...</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        width:"100%",
        padding: 26,
    },
    containerInner: {
        flex: 1,
        width:"100%",
        alignItems: 'center',
        backgroundColor: '#fff',

    },
    image: {
        marginTop: "20%",
        width: '50%', // or some other percentage or fixed width
        resizeMode: 'contain', // This will make sure the image is scaled properly
        marginBottom: 20, // Add some margin if needed
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1A2F5A'
    },
    inputs: {
        marginTop: "14%",
        width: "100%"
    },
    input: {
        height: 40,
        marginVertical: 10,
        borderBottomWidth: 1, // Only have a border on the bottom
        borderColor: '#dadada',
        padding: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#1A2F5A',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginTop: 50,

    },

    errorText: {
        color: 'grey',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    registerText: {
        marginTop: 20,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    }
});

export default Login;
