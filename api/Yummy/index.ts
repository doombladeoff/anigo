import { getRecommendations } from "@/api/Yummy/getRecommendations";
import { loginToYummy, refreshToken } from "./auth";

export const YummyAPI = {
    getRecommendations: getRecommendations
    getRecommendations: getRecommendations,
    auth: {
        login: loginToYummy,
        refreshToken: refreshToken,
    },
}