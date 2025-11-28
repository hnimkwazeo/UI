import axios from "axios";

// URL trỏ về Backend Java Spring Boot
const API_URL = "http://localhost:8080/api/v1/voice"; 

export const voiceService = {
  // Chỉ giữ lại chức năng Chat Voice
  chatWithVoice: async (audioFile: Blob) => {
    const formData = new FormData();
    
    // 'file' là tên tham số mà VoiceController.java đang chờ (@RequestParam("file"))
    formData.append("file", audioFile, "voice_message.webm"); 

    try {
      const response = await axios.post(`${API_URL}/chat`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Nếu App của bạn có Auth, nhớ thêm Token vào đây
          // "Authorization": `Bearer ${token}` 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Voice API Error:", error);
      throw error;
    }
  }
};