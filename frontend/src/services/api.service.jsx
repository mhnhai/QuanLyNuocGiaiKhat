import axios from "axios";



axios.defaults.withCredentials = true;



const commonConfig = {

    headers: {

        "Content-Type": "application/json",

        Accept: "application/json",

    },

    withCredentials: true,

};



const api = axios.create({

    baseURL: "http://localhost:8000/api",

    ...commonConfig,

});



let isRefreshing = false;

let failedQueue = [];



const processQueue = (error) => {

    failedQueue.forEach(({ resolve, reject }) => {

        if (error) reject(error);

        else resolve();

    });

    failedQueue = [];

};



const shouldSkipRefresh = (url = "") =>

    url.includes("/auth/refresh") || url.includes("/auth/login/");



api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (

            error.response?.status !== 401 ||

            !originalRequest ||

            originalRequest._retry ||

            shouldSkipRefresh(originalRequest.url)

        ) {

            return Promise.reject(error);

        }



        if (isRefreshing) {

            return new Promise((resolve, reject) => {

                failedQueue.push({ resolve, reject });

            }).then(() => api(originalRequest));

        }



        originalRequest._retry = true;

        isRefreshing = true;



        try {

            await api.post("/auth/refresh");

            processQueue(null);

            return api(originalRequest);

        } catch (refreshError) {

            processQueue(refreshError);

            return Promise.reject(refreshError);

        } finally {

            isRefreshing = false;

        }

    }

);



export default api;

