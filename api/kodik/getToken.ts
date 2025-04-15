import axios from "axios";

export async function getToken(): Promise<string | null> {
    try {
        const scriptUrl = "https://kodik-add.com/add-players.min.js?v=2";
        const response = await axios.get(scriptUrl);
        const data = response.data;

        const tokenRegex = /token="([^"]+)"/;
        const tokenMatch = data.match(tokenRegex);

        if (tokenMatch && tokenMatch[1]) {
            console.log("TOKEN:", tokenMatch[1]);
            return tokenMatch[1];
        } else {
            throw new Error("Токен не найден в коде");
        }
    } catch (error) {
        console.error("Ошибка получения токена:", error);
        return null;
    }
}