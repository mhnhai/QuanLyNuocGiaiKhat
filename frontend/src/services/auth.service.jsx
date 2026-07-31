import api from "./api.service";



const API_BASE = "http://localhost:8000/api";



const authService = {

    loginStaff: () => {

        const returnTo = encodeURIComponent(window.location.origin);

        window.location.href = `${API_BASE}/auth/login/staff?return_to=${returnTo}`;

    },

    logout: () =>

        api.post(`/auth/logout?return_to=${encodeURIComponent(window.location.origin)}`),

    refresh: () => api.post("/auth/refresh"),

    getMe: () => api.get("/auth/me"),

};



export default authService;

