import axios, { AxiosRequestConfig } from "axios";
import UserAgents from "user-agents";

export const getRecommendationsForAnime = async (id: number, token: string) => {

    const header: AxiosRequestConfig = {
        headers: {
            'User-Agent': new UserAgents().toString(),
            'X-Application': process.env.EXPO_PUBLIC_YUMMY_APPTOKEN,
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`https://api.yani.tv/anime?shikimori_ids=${id}&sort_forward=true&sort=top&offset=0&limit=1`, header);

        const idr = response.data.response[0].anime_id;
        const response2 = await axios.get(`https://api.yani.tv/anime/${idr}/recommendations?offset=0&limit=8`, header);

        return response2.data.response;
    } catch (error) {
        console.log('Ошибка в getReccommends for anime:', error);
        throw error;
    }
}