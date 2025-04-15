import { Client } from "kodikwrapper";

type InfoByIdProps = {
    token: string;
    voicerId: number;
    voicerTitle: string;
    shikiTitleId: number;
};

export async function getInfoById({token, voicerId, voicerTitle, shikiTitleId}: InfoByIdProps) {
    try {
        const client = Client.fromToken(token);
        const allEpisodesData: any[] = [];

        const kodikSeria = await client
        .search({
            shikimori_id: shikiTitleId,
            episode: 1,
            translation_id: voicerId,
        })
        .then((response) => response.results?.shift());

        if (kodikSeria?.seasons) {
            Object.keys(kodikSeria.seasons).forEach((seasonKey) => {
                const season = kodikSeria.seasons?.[seasonKey];
                if (season?.episodes) {
                    allEpisodesData.push({
                        caster: voicerTitle,
                        episodes: season.episodes,
                    });
                }
            });
        }

        return allEpisodesData;
    } catch (error) {
        console.error("Ошибка получения информации по ID:", error);
        return null;
    }
}