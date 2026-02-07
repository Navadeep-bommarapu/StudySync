import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth/";

const updateProfile = (data) => {
    return axios.put(API_URL + "profile", data);
};

const changePassword = (data) => {
    return axios.put(API_URL + "password", data);
};

const deleteAccount = (userId) => {
    return axios.delete(API_URL + "account/" + userId);
};

const UserService = {
    updateProfile,
    changePassword,
    deleteAccount,
};

export default UserService;
