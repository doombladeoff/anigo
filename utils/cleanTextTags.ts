export const cleanedText = (text: string): string => {
    const tagsWithAttributes = ['character', 'anime', 'person', 'url' ];
    const simpleTags = ['i', 'b', 'u'];

    let cleaned = text;

    tagsWithAttributes.forEach(tag => {
        const regex = new RegExp(`\\[${tag}=[^\\]]*]([\\s\\S]*?)\\[\\/${tag}]`, 'g');
        cleaned = cleaned.replace(regex, '$1');
    });

    simpleTags.forEach(tag => {
        const regex = new RegExp(`\\[${tag}]([\\s\\S]*?)\\[\\/${tag}]`, 'g');
        cleaned = cleaned.replace(regex, '$1');
    });

    return cleaned
        .replace(/\n{2,}/g, '\n')
        .trim();
};
