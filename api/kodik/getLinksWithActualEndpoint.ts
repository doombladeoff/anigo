import { VideoLinks } from "kodikwrapper";

export async function getLinksWithActualEndpoint(
episodeNumber: string | number,
episodesObject: Record<string, string>
) {
    try {
        const link = episodesObject[episodeNumber];

        if (!link) {
            console.error(`Эпизод с номером ${episodeNumber} не найден.`);
            return null;
        }

        const parsedLink = await VideoLinks.parseLink({
            link,
            extended: true,
        });

        if (!parsedLink.ex || !parsedLink.ex.playerSingleUrl) {
            throw new Error("Не могу получить ссылку на чанк с плеером");
        }

        const endpoint = await VideoLinks.getActualVideoInfoEndpoint(
        parsedLink.ex.playerSingleUrl
        );

        const links = await VideoLinks.getLinks({
            link: link,
            videoInfoEndpoint: endpoint,
        });

        return extractSortedLinks(links);
    } catch (error) {
        console.error("Ошибка в getLinksWithActualEndpoint:", error);
        return null;
    }
}

function extractSortedLinks(linksObject: any) {
    const sortedLinks: (string | null)[] = [];

    sortedLinks[0] = linksObject["720"]?.[0]?.src || null;
    sortedLinks[1] = linksObject["480"]?.[0]?.src || null;
    sortedLinks[2] = linksObject["360"]?.[0]?.src || null;

    return sortedLinks;
}
