import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/reviews/";

const getAll = () => {
    return axios.get(API_URL);
};

const create = (data) => {
    return axios.post(API_URL, data);
};

const remove = (id) => {
    return axios.delete(API_URL + id);
};

const ReviewService = {
    getAll,
    create,
    remove,
};

export default ReviewService;
