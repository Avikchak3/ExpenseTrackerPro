import axios from "axios";

const API = axios.create({

  baseURL:
    "https://expense-tracker-backend-nomn.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});


// ADD TOKEN AUTOMATICALLY
API.interceptors.request.use(

  (req) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  },

  (error) => {

    return Promise.reject(error);
  }
);


// HANDLE RESPONSE ERRORS
API.interceptors.response.use(

  (response) => {

    return response;
  },

  (error) => {

    console.log(
      "API Error:",
      error.response || error.message
    );

    return Promise.reject(error);
  }
);

export default API;