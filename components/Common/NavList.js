import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import {
    appendContentData,
    setAllCategories,
    setContentData, setCurrentPage, setHasMore,
    setHighlightData, setLoading,
    setNajnovijeData, setScrollPosition,
    setSelectedCategory
} from "../../redux/slices/selectedContentSlice";
import {API_URL} from '@env';

const NavList = () => {


    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.selectedContent.selectedCategory);
    const categoriesData = useSelector((state) => state.selectedContent.categoriesData); // Get categoriesData from Redux
    const scrollViewRef = useRef(null);
    const scrollPosition = useSelector((state) => state.selectedContent.scrollPosition);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);


    useEffect(() => {
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
    }, [scrollPosition]);
    // In both NavList and Menu components
    const handleCategoryPress = async ({ categoryUrl, index, page = 1 }) => {
        dispatch(setSelectedCategory(categoryUrl));

        if (selectedCategory !== categoryUrl) {
            dispatch(setCurrentPage(1)); // Assuming you have such an action
            dispatch(setContentData([])); // Clear existing content data
            dispatch(setHasMore(true));
        }

        try {
            const url = `${API_URL}/articles/mob/${categoryUrl}/${page}`;
            const response = await axios.get(url);
            if (page === 1) {
                dispatch(setContentData(response.data)); // Replace data for the first page
            } else {
                dispatch(appendContentData(response.data)); // Append data for subsequent pages
            }
        } catch (error) {
            console.error('Error fetching category specific:', error);
        }

        const buttonWidth = 120; // Width of each button including padding
        const viewportWidth = Dimensions.get('window').width; // Width of the viewport

        // Calculate the center position of the button to be centered in the viewport
        const buttonCenter = index * buttonWidth + buttonWidth / 2 + 240; // Adjust center position for the offset of the first two unaccounted buttons
        const halfViewportWidth = viewportWidth / 2;
        let scrollToPosition = buttonCenter - halfViewportWidth; // Adjust so button is in the middle of the viewport

        // Adjust the maximum scrollable position to ensure we don't scroll beyond content
        // No need to change the calculation for maxScrollPosition here since it accommodates for all categories
        const maxScrollPosition = (categoriesData.length * buttonWidth + 240) - viewportWidth; // Adjusted for additional offset
        // Ensure the scrollToPosition is within the bounds [0, maxScrollPosition]
        scrollToPosition = Math.max(0, Math.min(scrollToPosition, maxScrollPosition));

        scrollViewRef.current?.scrollTo({ x: scrollToPosition, animated: true });
        dispatch(setScrollPosition(scrollToPosition));
    };

    


    const handlepocetnaPress = async ({ categoryUrl }) => {
        dispatch(setSelectedCategory(categoryUrl));

        dispatch(setCurrentPage(1));
        try {
            const response = await axios.get(`${API_URL}/articles/highlight`);

            // Assuming the categories are under the key 'categories' within the response object
            const newHighlightData = response.data;

            // Dispatch an action to update contentData in Redux
            dispatch(setHighlightData(newHighlightData));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }

    };

    const handleNajnovijePress = async ({ categoryUrl, index, page = 1 }) => {
        dispatch(setSelectedCategory(categoryUrl));
        dispatch(setCurrentPage(1));
        try {
            const response = await axios.get(`${API_URL}/articles/mob/najnovije/${page}`);

            if (selectedCategory !== categoryUrl) {
                dispatch(setCurrentPage(1)); // Assuming you have such an action
                dispatch(setNajnovijeData([])); // Clear existing content data
                dispatch(setHasMore(true));
            }


            if (page === 1) {
                dispatch(setNajnovijeData(response.data)); // Replace data for the first page
            }

            // Assuming the categories are under the key 'categories' within the response object
            const newNajnovijeData = response.data;

            // Dispatch an action to update contentData in Redux
            dispatch(setNajnovijeData(newNajnovijeData));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }

    };



    useEffect(() => {


        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                dispatch(setAllCategories(response.data)); // Dispatch setAllCategories with fetched data
                setCategoriesLoaded(true);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchPocetna = async () => {


            try {
                const response = await axios.get(`${API_URL}/articles/highlight`);

                // Assuming the categories are under the key 'categories' within the response object
                const newHighlightData = response.data;

                // Dispatch an action to update contentData in Redux
                dispatch(setHighlightData(newHighlightData));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };


        const fetchNajnovije = async () => {
            try {
                const response = await axios.get(`${API_URL}/articles/mob/najnovije/1`);
             //   console.log('Fetched data with axios:', response.data);
                dispatch(setNajnovijeData(response.data)); // Dispatch the action to set najnovije data
            } catch (error) {
                console.error('Error fetching najnovije:', error);
            }
        };
        fetchCategories();
        fetchNajnovije();
        fetchPocetna();


    }, [dispatch]);






    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            bounces={false}
            overScrollMode="never"
        >

            {categoriesLoaded && (
                <>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handlepocetnaPress({ categoryUrl: "pocetna" })}
                    >
                        <Text style={[styles.buttonText, selectedCategory === "pocetna" ? styles.selectedText : null]}>
                            Početna
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleNajnovijePress({ categoryUrl: "najnovije" })}
                    >
                        <Text style={[styles.buttonText, selectedCategory === "najnovije" ? styles.selectedText : null]}>
                            Najnovije
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {categoriesData && categoriesData.map((category, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleCategoryPress({ categoryUrl: category.category_url, index })}

                >
                    <Text style={[styles.buttonText, selectedCategory === category.category_url && styles.selectedText]}>
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2F5A',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        height:70,
    },
    button: {
        width: 120,
        marginBottom:10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,

    },
    buttonText: {
        fontWeight: '500',
        color: '#fff',
        fontSize: 13,
    },
    selectedText: {
        fontWeight: '700', // Increased weight for better emphasis
        color: '#E3E3E3', // A slightly lighter shade for better contrast against the dark background
        textDecorationLine: "none", // Removing the underline for a cleaner look
        borderBottomWidth:0.8, // Adding a bottom border for a subtle indicator
        borderBottomColor: '#ffffff', // Gold color for the border to add a sophisticated touch without being too loud
        paddingBottom: 2, // Adjust padding to accommodate the border without increasing the overall height
    },
});

export default NavList;
