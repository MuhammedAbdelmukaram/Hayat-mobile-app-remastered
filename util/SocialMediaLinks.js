import { Linking } from "react-native";

export const handleFacebookPress = (URL) => {
    // Encode the URL to ensure it's in the correct format for a query parameter
    const encodedURL = encodeURIComponent(URL);
    // Create the Facebook share URL with your article's URL
    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
    // Open the Facebook share URL
    Linking.openURL(facebookShareURL);
};

export const handleTwitterPress = (URL) => {
    // Encode the URL to ensure it's in the correct format for a query parameter
    const encodedURL = encodeURIComponent(URL);
    // Create the Twitter share URL with your article's URL and optional text
    const twitterShareURL = `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodeURIComponent('')}`;
    // Open the Twitter share URL
    Linking.openURL(twitterShareURL);
};

export const handleViberPress = (URL) => {
    const encodedURL = encodeURIComponent(URL);
    const viberShareURL = `viber://forward?text=${encodedURL}`;
    Linking.openURL(viberShareURL);
};

// Messenger Share
export const handleMessengerPress = (URL) => {
    const encodedURL = encodeURIComponent(URL);
    const messengerShareURL = `fb-messenger://share?link=${encodedURL}`;
    Linking.openURL(messengerShareURL);
};

// WhatsApp Share
export const handleWhatsAppPress = (URL) => {
    const encodedURL = encodeURIComponent(URL);
    const message = encodeURIComponent(""); // You can customize this message
    const whatsAppShareURL = `whatsapp://send?text=${message}%20${encodedURL}`;
    Linking.openURL(whatsAppShareURL);
};
export const handleInstagramPress = () => {
    Linking.openURL('https://www.instagram.com/hayatmediabih/');
};



export const handleYouTubePress = () => {
    Linking.openURL('https://www.youtube.com/channel/UC8LsYbBwRBkPyvGfWYpcCkw');
};
