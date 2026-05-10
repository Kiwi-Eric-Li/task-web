const ACCESS = "access_token";
const REFRESH = "refresh_token";

export const tokenService = {
    getAccessToken: () => {
        localStorage.getItem(ACCESS);
    },
    getRefreshToken: () => {
        localStorage.getItem(REFRESH);
    },
    setLoginTokens: (access_token, refresh_token) => {
        localStorage.setItem(ACCESS, access_token);
        if(refresh_token){
            localStorage.setItem(REFRESH, refresh_token);
        }else{
            localStorage.removeItem(REFRESH);
        }
    },
    clear: () => {
        localStorage.removeItem(ACCESS);
        localStorage.removeItem(REFRESH);
    }
}