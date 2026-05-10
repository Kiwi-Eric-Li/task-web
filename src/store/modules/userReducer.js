import {createSlice} from '@reduxjs/toolkit'

const userDataStore = createSlice({
    name: 'userData',
    initialState: {
        userData: {}
    },
    // 修改数据同步方法
    reducers: {
        setUserData(state, action){
            state.userData = action.payload
        }
    }
});

// 结构出构建action对象的函数
const {setUserData} = userDataStore.actions;

// 获取reducer函数
const userDataReducer = userDataStore.reducer;

// 导出 action对象和函数
export {setUserData};

// 导出 reducer
export default userDataReducer;




