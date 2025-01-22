import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getTongueTwister = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/gettonguetwister`);
    return response.data.tt;
  } catch (error) {
    console.error("Error fetching tongue twister:", error);
  }
};

export const assessPronunciation = async (audioBlob, refText) => {
  const formData = new FormData();
  formData.append("audio_data", audioBlob);
  formData.append("reftext", refText);

  try {
    const response = await axios.post(`${BASE_URL}/ackaud`, formData);
    return response.data;
  } catch (error) {
    console.error("Error assessing pronunciation:", error);
  }
};
