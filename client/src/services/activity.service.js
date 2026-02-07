import axios from "axios";
import authHeader from "./auth-header";

const API_URL = import.meta.env.VITE_API_URL + "/activity/";

const logSession = (data) => {
    return axios.post(API_URL, data, { headers: authHeader() });
};

const getStats = (userId) => {
    return axios.get(API_URL + "?userId=" + userId, { headers: authHeader() });
};

const ActivityService = {
    logSession,
    getStats,
};

export default ActivityService;
