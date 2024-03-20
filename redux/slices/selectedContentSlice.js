// slices/selectedContentSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@env";

const initialState = {
  selectedCategory: "pocetna",
  categoriesData: null,
  contentData: null,
  highlightData: null,
  mainArticles: null,
  najnovijeData: null,
  loading: false,
  currentPage: 1, // Add this line
  hasMore: true, // Ensure this is here and properly initialized
  scrollPosition: 0,
};

// export const fetchHighlightData = createAsyncThunk(
//   "selectedContent/highlightData",
//   async (thunkAPI) => {
//     try {
//       const response = await axios.get(`${API_URL}/articles/highlight`);
//       const data = response.data;

//       return data;
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
// );

// export const fetchMainArticlesData = createAsyncThunk(
//   "selectedContent/mainArticles",
//   async (thunkAPI) => {
//     try {
//       const response = await axios.get(`${API_URL}/articles/main`);
//       const data = response.data;

//       return data;
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
// );

// export const fetchCategories = createAsyncThunk(
//   "selectedContent/categoriesData",
//   async () => {
//     try {
//       const response = await axios.get(`${API_URL}/categories`);
//       const data = response.data;

//       return data;
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
// );

export const fetchNajnovijeArticles = createAsyncThunk(
  "selectedContent/fetchNajnovijeArticles",
  async ({ categoryUrl, page }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/articles/mob/najnovije/${page}`
      );
      const data = response.data;
      const hasMore = data.length === 15; // Adjust based on your pagination limit

      // Here, we decide whether to replace data or append based on the page number
      if (page === 1) {
        thunkAPI.dispatch(setNajnovijeData(data));
        thunkAPI.dispatch(setHasMore(hasMore));
      } else {
        thunkAPI.dispatch(appendNajnovijeData(data));
        thunkAPI.dispatch(setHasMore(hasMore));
      }

      return data; // This is optional unless you need the data after dispatching
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchArticlesByCategory = createAsyncThunk(
  "selectedContent/fetchArticlesByCategory",
  async ({ categoryUrl, page }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/articles/mob/${categoryUrl}/${page}`
      );
      const data = response.data;
      // Check if the data array is shorter than the expected number of results per page

      const hasMore = data.length === 15; // Replace EXPECTED_PAGE_SIZE with your actual page size

      // Update `hasMore` and content data
      if (page === 1) {
        thunkAPI.dispatch(setContentData(data));
        thunkAPI.dispatch(setHasMore(hasMore));
      } else {
        thunkAPI.dispatch(appendContentData(data));
        thunkAPI.dispatch(setHasMore(hasMore));
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const selectedContentSlice = createSlice({
  name: "selectedContent",
  initialState,
  reducers: {
    //Selected category, single string
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },

    /* categoriesData EXAMPLE:
        _id: 652455a87274753dbd37c87a
        name:"BiH"
        category_url:"bih"
        order_number:1
        hidden:false
        */
    setAllCategories: (state, action) => {
      state.categoriesData = action.payload;
    },

    setMainArticles: (state, action) => {
      state.mainArticles = action.payload;
    },

    //News atricles belonging to specific category
    setContentData: (state, action) => {
      state.contentData = action.payload;
    },
    //News articles from highlights
    setHighlightData: (state, action) => {
      state.highlightData = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setNajnovijeData: (state, action) => {
      state.najnovijeData = action.payload;
    },
    setLoading: (state, action) => {
      // Define setLoading reducer
      state.loading = action.payload;
    },
    /*
    appendContentData: (state, action) => {
        // Here, we'll concatenate the new articles to the existing ones
        if (state.contentData && action.payload) {
            state.contentData = {
                ...state.contentData,
                // Depending on your data structure, you might need to adjust this:
                video: [...state.contentData.video, ...action.payload.video],
                text: [...state.contentData.text, ...action.payload.text],
                photo: [...state.contentData.photo, ...action.payload.photo],
            };
        }
    },
*/

    appendNajnovijeData: (state, action) => {
      // Check if najnovijeData is not null and the payload is an array
      if (state.najnovijeData && action.payload) {
        // Concatenate the new articles to the existing ones
        state.najnovijeData = [...state.najnovijeData, ...action.payload];
      }
    },

    appendContentData: (state, action) => {
      // Concatenate the new articles to the existing ones
      if (state.contentData && action.payload) {
        // Assuming action.payload is an array of articles
        state.contentData = [...state.contentData, ...action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticlesByCategory.fulfilled, (state, action) => {
      // This is where you can update the state based on the fulfilled action
      // For example, you might want to set loading to false here
      // state.loading = false;
      // Note: The actual data update is handled by dispatching other actions above
    });

    // Handle other cases if necessary...
  },
});

export const {
  appendContentData,
  appendNajnovijeData,
  setScrollPosition,
  setCurrentPage,
  setHasMore,
  setMainArticles,
  setSelectedCategory,
  setAllCategories,
  getCategories,
  setLoading,
  setNajnovijeData,
  setContentData,
  setHighlightData,
} = selectedContentSlice.actions;
export default selectedContentSlice.reducer;
