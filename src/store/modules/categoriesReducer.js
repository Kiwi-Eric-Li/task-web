import {createSlice} from '@reduxjs/toolkit'


const categoriesStore = createSlice({
    name: 'categories',
    initialState: {
        categories: []
    },
    // 修改数据同步方法
    reducers: {
        setCategories(state, action){
            state.categories = action.payload
        }
    }
});

// 结构出构建action对象的函数
const {setCategories} = categoriesStore.actions;

// 获取reducer函数
const categoriesReducer = categoriesStore.reducer;

// 导出 action对象和函数
export {setCategories};

// 导出 reducer
export default categoriesReducer;