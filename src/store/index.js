import {configureStore} from '@reduxjs/toolkit'

import activeRoleReducer from "./modules/activeRoleReducer"
import userReducer from "./modules/userReducer"

const store = configureStore({
    reducer: {
        activeRole: activeRoleReducer,
        userData: userReducer
    }
});


export default store;


