import axios from "axios";
import UserAgents from "user-agents";

export const getRecommendations = async () => {
    try {
        const response = await axios.get(`https://api.yani.tv/anime?min_age=4&status=released&status=ongoing&types=tv&types=movie&min_rating=8&ep_from=1&sort_forward=true&sort=random&offset=${Math.floor(Math.random() * 11)}&limit=5`,
        {
            headers: {
                "User-Agent": new UserAgents().toString(),
            },
        });

        return response.data.response;

    } catch (e) {
        console.error("Error:", e);
    }
}