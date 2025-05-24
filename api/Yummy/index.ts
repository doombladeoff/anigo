import { getRecommendations } from "@/api/Yummy/getRecommendations";
import { loginToYummy, refreshToken } from "./auth";
import { getRecommendationsForAnime } from "./getRecommendationsForAnime";
import { getNews, getNewsPost } from "./news";

export const YummyAPI = {
    getRecommendations: getRecommendations,
    auth: {
        login: loginToYummy,
        refreshToken: refreshToken,
    },
    getRecommendationsForAnime: getRecommendationsForAnime,
    news: {
        getNews: getNews,
        getPost: getNewsPost,
    },
}