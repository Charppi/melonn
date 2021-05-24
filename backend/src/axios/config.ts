import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox",
    headers: { "x-api-key": "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT" }
});