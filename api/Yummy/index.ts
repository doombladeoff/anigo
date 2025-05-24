import { getRecommendations } from "@/api/Yummy/getRecommendations";
import { loginToYummy, refreshToken } from "./auth";
import { getRecommendationsForAnime } from "./getRecommendationsForAnime";

export const YummyAPI = {
    getRecommendations: getRecommendations,
    auth: {
        login: loginToYummy,
        refreshToken: refreshToken,
    },
    getRecommendationsForAnime: getRecommendationsForAnime,
}