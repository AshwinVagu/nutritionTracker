import { configureStore, createSlice } from "@reduxjs/toolkit";

// Slice for user data
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser(state, action) {
      return action.payload;
    },
  },
});

// Slice for user goals
const userGoals = createSlice({
  name: "goals",
  initialState: null,
  reducers: {
    setGoals(state, action) {
      return action.payload;
    },
  },
});

// Slice for user tracking records
const userTrackingRecords = createSlice({
  name: "userTrackingRecords",
  initialState: null,
  reducers: {
    setUserTrackingRecords(state, action) {
      return action.payload;
    },
  },
});

// Slice for current route
const currentRoute = createSlice({
  name: "currentRoute",
  initialState: "",
  reducers: {
    setCurrentRoute(state, action) {
      return action.payload;
    },
  },
});

// const rooms = createSlice({
//   name: "rooms",
//   initialState: [],
//   reducers: {
//     setRooms(state, action) {
//       return action.payload;
//     },
//   },
// });

// const searchDashboard = createSlice({
//   name: "searchDashboard",
//   initialState: "",
//   reducers: {
//     setSearchDashboard(state, action) {
//       return action.payload;
//     },
//   },
// });

// const filteredRooms = createSlice({
//   name: "filteredRooms",
//   initialState: null,
//   reducers: {
//     setFilteredRooms(state, action) {
//       return action.payload;
//     },
//   },
// });

// const priceFilterArray = createSlice({
//   name: "priceFilterArray",
//   initialState: [],
//   reducers: {
//     setPriceFilterArray(state, action) {
//       return action.payload;
//     },
//   },
// });


// Redux store configuration
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    userGoals: userGoals.reducer,
    userTrackingRecords: userTrackingRecords.reducer,
    currentRoute: currentRoute.reducer,
    // rooms: rooms.reducer,
    // searchDashboard: searchDashboard.reducer,
    // filteredRooms: filteredRooms.reducer,
    // priceFilterArray: priceFilterArray.reducer,
  },
});

export { store };
export const { addUser } = userSlice.actions;
export const { setGoals } = userGoals.actions;
export const { setUserTrackingRecords } = userTrackingRecords.actions;
export const { setCurrentRoute } = currentRoute.actions;
// export const { setRooms } = rooms.actions;
// export const { setSearchDashboard } = searchDashboard.actions;
// export const { setFilteredRooms } = filteredRooms.actions;
// export const { setPriceFilterArray } = priceFilterArray.actions;
