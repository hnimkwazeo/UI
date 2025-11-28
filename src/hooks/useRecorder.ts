import { useState, useRef } from "react";

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = []; // Reset bộ nhớ đệm

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Tạo file audio dạng webm (nhẹ và phổ biến)
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        chunksRef.current = [];
        
        // Tắt Micro sau khi ghi âm xong
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Lỗi truy cập Micro:", err);
      alert("Vui lòng cấp quyền truy cập Micro để sử dụng tính năng này.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Hàm này quan trọng: Để xóa file cũ sau khi đã gửi đi
  const resetRecorder = () => {
    setAudioBlob(null);
  };

  return { isRecording, audioBlob, startRecording, stopRecording, resetRecorder };
};