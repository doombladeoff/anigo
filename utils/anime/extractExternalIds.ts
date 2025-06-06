export const extractWorldArtID = (links: any[]) => {
    const link = links?.find(l => l.url.startsWith('http://www.world-art.ru/'));
    return link ? new URL(link.url).searchParams.get("id") : null;
};

export const extractKinopiskID = (links: any[]) => {
    const link = links?.find(l => l.url.startsWith('https://www.kinopoisk.ru/'));
    return link?.url.match(/\/(?:series|film)\/(\d+)/)?.[1] || null;
}