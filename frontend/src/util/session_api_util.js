import axios from 'axios';

export const setAuthToken = token => {
    if (token) {
        // set the token to our default authorization header
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // else delete everything on Authorization key
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const signup = (userData) => {
    return axios.post('/api/users/register', userData);
};

export const login = (userData) => {
    return axios.post('/api/users/login', userData);
};