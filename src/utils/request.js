import axios from "axios"
import { tokenService } from "./token";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const service = axios.create({
    baseURL: `${BaseUrl}/api`,
    timeout: 30000
});

// 刷新状态锁
let isRefreshing = false;
let queue = [];

// 请求拦截
service.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("access_token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截
service.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        const originalRequest = error.config;
        if(error.response?.status !== 401){
            return Promise.reject(error);
        }
        // prevent infinite loops
        if(originalRequest._retry){
            return Promise.reject(error);
        }
        originalRequest._retry = true;
        const refreshToken = tokenService.getRefreshToken();
        // 没有 refreshToken
        if(!refreshToken){
            tokenService.clear();
            window.location.href = "/login";
            return Promise.reject("No refresh token, logout directly.");
        }

        // 在排队
        if(isRefreshing){
            return new Promise((resolve)=>{
                queue.push((newToken)=>{
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(service(originalRequest));
                });
            });
        }

        isRefreshing = true;
        try{
            // 调用 refresh 接口
            const {access_token, refresh_token} = await axios.post(BaseUrl + "/api/refresh", {
                "access_token": refreshToken
            });
            // 更新token
            tokenService.setLoginTokens(access_token, refresh_token);

            // 执行队列
            queue.forEach((cb) => cb(access_token));
            queue = [];

            // 重试当前请求
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return service(originalRequest);
        }catch(err){
            // refresh 失败，强制登录
            tokenService.clear();
            window.location.href = "/login";
            return Promise.reject(err);
        }finally{
            isRefreshing = false;
        }
    }
)

export default service;





