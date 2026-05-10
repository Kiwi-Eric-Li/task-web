import {createSlice} from '@reduxjs/toolkit'


const activeRoleStore = createSlice({
    name: 'activeRole',
    initialState: {
        activeRole: "poster"
    },
    // 修改数据同步方法
    reducers: {
        setActiveRole(state, action){
            state.activeRole = action.payload
        }
    }
});

// 结构出构建action对象的函数
const {setActiveRole} = activeRoleStore.actions;

// 获取reducer函数
const activeRoleReducer = activeRoleStore.reducer;

// 导出 action对象和函数
export {setActiveRole};

// 导出 reducer
export default activeRoleReducer;



