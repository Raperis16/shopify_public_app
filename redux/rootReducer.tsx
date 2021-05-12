//Redux
import { combineReducers } from "redux";

//Reducer
import asyncStorageRedux from "./asyncStorageRedux";

//Redux-Persist
import { persistReducer } from 'redux-persist'

// Secure storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: "persist",
    storage: AsyncStorage
}


const rootReducer = combineReducers({
    storage: persistReducer(persistConfig, asyncStorageRedux)
});

export default rootReducer;
