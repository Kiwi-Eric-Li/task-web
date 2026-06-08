import {createSlice} from '@reduxjs/toolkit'

const loginDialogSlice = createSlice({
    name: "loginDialog",
    initialState: {
        open: false
    },
    reducers: {
        openLoginDialog: (state) => {
            state.open = true;
        },
        closeLoginDialog: (state) => {
            state.open = false;
        },
    },
});

export const {
    openLoginDialog,
    closeLoginDialog,
} = loginDialogSlice.actions;

export default loginDialogSlice.reducer;