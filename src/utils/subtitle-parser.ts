export interface ParsedSubtitle {
    id: number;
    startTime: number;
    endTime: number;
    vietnamese: string;
    english: string;
}

const timeToSeconds = (time: string): number => {
    // Xử lý định dạng thời gian của file SRT (00:00:01,500 --> 00:00:04,000)
    const parts = time.split(/[:,]/);
    if (parts.length < 4) return 0; // Fallback an toàn

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    const milliseconds = parseInt(parts[3], 10);
    
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};

export const parseSubtitle = (srtContent: string): ParsedSubtitle[] => {
    if (!srtContent) return [];

    // Tách các block bằng dòng trống (chuẩn SRT)
    const blocks = srtContent.trim().split(/\n\s*\n/);

    return blocks.map(block => {
        const lines = block.trim().split('\n');
        
        // Kiểm tra xem block có đủ dữ liệu không (ít nhất phải có ID, time, và 1 dòng sub)
        // Nếu cấu trúc file của bạn là: ID -> Time -> Tiếng Việt -> Tiếng Anh (4 dòng)
        if (lines.length < 3) return null; 

        const id = parseInt(lines[0], 10);
        
        // Xử lý dòng time (dòng thứ 2)
        const timeLine = lines[1];
        if (!timeLine || !timeLine.includes('-->')) return null;
        
        const timeMatch = timeLine.split(' --> ');
        const startTime = timeToSeconds(timeMatch[0]);
        const endTime = timeToSeconds(timeMatch[1]);

        // Xử lý nội dung (Giả định dòng 3 là Tiếng Việt, dòng 4 là Tiếng Anh)
        // Nếu file chỉ có 3 dòng (thiếu tiếng Anh), ta gán chuỗi rỗng
        const vietnamese = lines[2] || "";
        const english = lines[3] || ""; 

        return { id, startTime, endTime, vietnamese, english };
    }).filter((item): item is ParsedSubtitle => item !== null);
};