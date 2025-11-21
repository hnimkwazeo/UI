export interface ParsedSubtitle {
    id: number;
    startTime: number;
    endTime: number;
    vietnamese: string;
    english: string;
}

const timeToSeconds = (time: string): number => {
    const parts = time.split(/[:,]/);
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    const milliseconds = parseInt(parts[3], 10);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};

export const parseSubtitle = (srtContent: string): ParsedSubtitle[] => {
    if (!srtContent) return [];

    const blocks = srtContent.trim().split(/\n\s*\n/);

    return blocks.map(block => {
        const lines = block.trim().split('\n');
        if (lines.length < 4) return null;

        const id = parseInt(lines[0], 10);
        const timeMatch = lines[1].split(' --> ');
        const startTime = timeToSeconds(timeMatch[0]);
        const endTime = timeToSeconds(timeMatch[1]);

        const vietnamese = lines[2];
        const english = lines[3];

        return { id, startTime, endTime, vietnamese, english };
    }).filter((item): item is ParsedSubtitle => item !== null);
};
