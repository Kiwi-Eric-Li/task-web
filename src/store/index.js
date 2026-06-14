import {configureStore} from '@reduxjs/toolkit'

import activeRoleReducer from "./modules/activeRoleReducer"
import userReducer from "./modules/userReducer"
import categoriesReducer from "./modules/categoriesReducer"
import loginDialogReducer from "./modules/loginDialogSlice";
import taskDetailReducer from "./modules/taskDetailSlice";

const store = configureStore({
    reducer: {
        activeRole: activeRoleReducer,
        userData: userReducer,
        categories: categoriesReducer,
        loginDialog: loginDialogReducer,
        taskDetail: taskDetailReducer,
    }
});


export default store;


