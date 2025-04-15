import { Client } from "kodikwrapper";

type Voicer = {
    id: number;
    title: string;
};


type VoicerProps = {
    token: string;
    shikiTitleId: number;
};

export async function getVoicers({token, shikiTitleId}: VoicerProps): Promise<Voicer[]> {
    if (!token) throw new Error("Missing token");
    const client = Client.fromToken(token);

    try {
        const voiceCast = await client
        .translationsV2({
            translation_type: "voice",
            types: "anime",
            sort: "count",
        })
        .then((response) => response.results.slice(0, 10));

        const availableCasters: Voicer[] = [];

        for (const voice of voiceCast) {
            try {
                const kodikSeria = await client
                .search({
                    shikimori_id: shikiTitleId,
                    episode: 1,
                    translation_id: voice.id,
                })
                .then((response) => response.results.shift());

                if (kodikSeria?.seasons) {
                    Object.keys(kodikSeria.seasons).forEach((seasonKey) => {
                        const season = kodikSeria.seasons?.[seasonKey];
                        if (season?.episodes) {
                            availableCasters.push({
                                id: voice.id,
                                title: voice.title,
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(`Ошибка при поиске для озвучки ${voice.id}:`, error);
            }
        }

        return availableCasters;
    } catch (error) {
        console.error("Ошибка получения кастеров:", error);
        return [];
    }
}
