import { Crunchy } from "@/api/Crunchyroll/Crunchy";
import { getLinks } from "@/constants/Links";
import { Dimensions } from "react-native";
import { storage } from "@/utils/storage";
import UserAgent from 'user-agents';
import axios from "axios";

const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get('screen');

const extractCrunchyrollId = (url: string) => {
    const match = url.match(/\/series\/([^/]+)/);
    return match ? match[1] : null;
};

const fetchCrunchy = async (link: string, token: string) => {
    const userAgent = new UserAgent();
    try {
        const response = await axios.get(`https://${link}`, {
            headers: {
                'User-Agent': userAgent.toString(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Access': `Bearer ${token}`,
            },
            method: 'GET',
        });
        const id = extractCrunchyrollId(response.request.responseURL);
        return id;
    } catch (error) {
        console.error('Ошибка при получении ID Crunchyroll:', error);
        throw new Error('Ошибка получения ID Crunchyroll');
    }
};

const getCrunchyrollId = async (crunchyrollLink: any, streamingUrl: string | undefined, token: string) => {
    let crunchyrollId = null;
    if (!crunchyrollLink && !streamingUrl) {
        return crunchyrollId;
    }
    if (crunchyrollLink) {
        if (crunchyrollLink.url.includes('/series/')) {
            crunchyrollId = extractCrunchyrollId(crunchyrollLink.url)
            console.log('include series =>', crunchyrollId)
        } else {
            const url = new URL(crunchyrollLink.url);
            const baseUrl = `${url.host}${url.pathname}`;
            const getId = await fetchCrunchy(baseUrl, token);
            crunchyrollId = getId ?? null;
        }
    } else {
        console.warn('Нет ссылки Crunchyroll, проверяем стриминг URL');
    }


    if (!crunchyrollId) {
        console.log('Проверка ссылок на стриминг');
        if (streamingUrl?.includes("/watch/")) {
            crunchyrollId = extractCrunchyrollId(streamingUrl) || null;
        } else if (streamingUrl?.includes("crunchyroll.com")) {
            const url = new URL(streamingUrl);
            const episodeIndex = url.pathname.indexOf('/episode');
            const trimmedPath = episodeIndex !== -1 ? url.pathname.substring(0, episodeIndex) : url.pathname;
            const baseUrl = `${url.host}${trimmedPath}`;
            console.log('Base URL:', baseUrl);
            crunchyrollId = await fetchCrunchy(baseUrl, token);
        }
    }

    return crunchyrollId;
};

const processAnimeLinks = async (animeListData: any, streamingUrl: string | undefined, token: string) => {
    const crunchyrollLink = animeListData.externalLinks?.find((link: any) => link.site === "Crunchyroll");
    const crunchyrollId = await getCrunchyrollId(crunchyrollLink, streamingUrl, token);

    return crunchyrollId;
};

export const getCrunchyrollIData = async (animeListData: any, malId: number): Promise<any> => {
    const storageCrunchy = storage.getCrunchyroll(malId);
    if (storageCrunchy) return storageCrunchy;

    if (!animeListData?.externalLinks && !animeListData?.streamingEpisodes?.length) return null;

    const crunchy = new Crunchy({ email: '', password: '' });
    await crunchy.login();

    const crunchyrollId = await processAnimeLinks(animeListData, animeListData?.streamingEpisodes, crunchy.accessToken ?? '');
    if (!crunchyrollId) {
        const fallback = {
            crunchyrollId,
            crunchyAwards: {
                text: null,
                icon_url: null,
            },
            crunchyImages: { img: null },
            hasTallThumbnail: false,
            hasWideThumbnail: false,
        };

        storage.setCrunchyroll(fallback, malId);
        return fallback;
    }

    const seriesData = await crunchy.queryShowData(crunchyrollId, 'ru_RU', 'series')?.then(r => r.data?.[0]);
    if (!seriesData) return null;

    const posters = seriesData.images?.poster_tall?.[0];
    const img = posters?.[posters.length - 1] ?? '';

    const [thumbTall, thumbWide] = await Promise.all([
        fetch(getLinks(crunchyrollId, ScreenWidth * 3, ScreenHeight * 3, 'tall').backgroundThumbnail).then(r => r.status === 200),
        fetch(getLinks(crunchyrollId, ScreenWidth * 3, ScreenHeight * 3).titleThumbnail).then(r => r.status === 200),
    ]);

    const awards = seriesData.awards?.[0] ?? {};

    const crunchyData = {
        crunchyrollId,
        crunchyAwards: {
            text: awards.text ?? null,
            icon_url: awards.icon_url ?? null,
        },
        crunchyImages: { img },
        hasTallThumbnail: thumbTall,
        hasWideThumbnail: thumbWide,
    };

    storage.setCrunchyroll(crunchyData, malId);
    return crunchyData;
};
