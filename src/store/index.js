import {configureStore} from '@reduxjs/toolkit'

import activeRoleReducer from "./modules/activeRoleReducer"
import userReducer from "./modules/userReducer"
import categoriesReducer from "./modules/categoriesReducer"

const store = configureStore({
    reducer: {
        activeRole: activeRoleReducer,
        userData: userReducer,
        categories: categoriesReducer
    }
});


export default store;


