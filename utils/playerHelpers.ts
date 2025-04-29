export function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');
    return `${paddedMins}:${paddedSecs}`;
}

export function parseSkipTime(timeString: string) {
    const parseTime = (timeStr: string) => {
        if (timeStr.includes(':')) {
            const [minutes, seconds] = timeStr.split(':').map(Number);
            return minutes * 60 + seconds;
        } else {
            return Number(timeStr) * 60;
        }
    };

    const ranges = timeString.split(",").map(range => {
        const [start, end] = range.split("-").map(parseTime);
        return {start, end};
    });

    const {start, end} = ranges[0] || {start: 0, end: 0};

    if (end < 1200 && start === 0) {
        return {start: 5, end: end - 5};
    }
    return {start, end};
}
