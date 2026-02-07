import axios from "axios";
import authHeader from "./auth-header";

const API_URL = import.meta.env.VITE_API_URL + "/courses/";

const getAll = (userId) => {
    return axios.get(API_URL + "?userId=" + userId, { headers: authHeader() });
};

const create = (data) => {
    return axios.post(API_URL, data, { headers: authHeader() });
};

const update = (id, data) => {
    return axios.put(API_URL + id, data, { headers: authHeader() });
};

const remove = (id) => {
    return axios.delete(API_URL + id, { headers: authHeader() });
};

const CourseService = {
    getAll,
    create,
    update,
    remove,
};

export default CourseService;
