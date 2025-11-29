import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/voice"; 

export const voiceService = {
  chatWithVoice: async (audioFile: Blob) => {
    const formData = new FormData();
    
    formData.append("file", audioFile, "voice_message.webm"); 

    try {
      const response = await axios.post(`${API_URL}/chat`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Voice API Error:", error);
      throw error;
    }
  }
};