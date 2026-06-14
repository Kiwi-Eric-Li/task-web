import {createSlice} from '@reduxjs/toolkit'

const taskDetailStore = createSlice({
    name: 'taskDetailData',
    initialState: {
        taskDetailData: {}
    },
    // 修改数据同步方法
    reducers: {
        setTaskDetailData(state, action){
            state.taskDetailData = action.payload
        }
    }
});


const {setTaskDetailData} = taskDetailStore.actions;

// 获取reducer函数
const taskDetailReducer = taskDetailStore.reducer;

// 导出 action对象和函数
export {setTaskDetailData};

// 导出 reducer
export default taskDetailReducer;
