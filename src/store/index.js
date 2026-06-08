import {configureStore} from '@reduxjs/toolkit'

import activeRoleReducer from "./modules/activeRoleReducer"
import userReducer from "./modules/userReducer"
import categoriesReducer from "./modules/categoriesReducer"
import loginDialogReducer from "./modules/loginDialogSlice";

const store = configureStore({
    reducer: {
        activeRole: activeRoleReducer,
        userData: userReducer,
        categories: categoriesReducer,
        loginDialog: loginDialogReducer,
    }
});


export default store;


