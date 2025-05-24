import axios, { AxiosRequestConfig } from "axios";
import UserAgents from "user-agents";

const headers: AxiosRequestConfig = {
    headers: {
        'User-Agent': new UserAgents().toString(),
        'X-Application': process.env.EXPO_PUBLIC_YUMMY_APPTOKEN,
    }
};

export const getNews = async (page: number = 0) => {
    const response = await axios.get(`https://api.yani.tv/posts?category=anime_news&limit=10&skip=${page === 0 ? page : page * 10}&sort=new`, headers)
    return response.data.response;
};

export const getNewsPost = async (id: number) => {
    const response = await axios.get(`https://api.yani.tv/posts/${id}`, headers);
    return response.data.response
};