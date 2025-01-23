import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Fetch a tongue twister from the backend
export const getTongueTwister = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/gettonguetwister`);
    if (response.data && response.data.tt) {
      return response.data.tt; // Return the tongue twister text
    }
    throw new Error("Tongue twister not found in response");
  } catch (error) {
    console.error("Error fetching tongue twister:", error);
    throw error; // Rethrow the error for the calling function to handle
  }
};

// Assess the pronunciation based on the audio and reference text
// export const assessPronunciation = async (audioBlob, refText) => {
//   const formData = new FormData();
//   formData.append("audio_data", audioBlob);
//   formData.append("reftext", refText);

//   try {
//     const response = await axios.post(`${BASE_URL}/ackaud`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data", // Ensure proper content type for form data
//       },
//     });

//     // Check if the response contains the expected data
//     if (response.data) {
//       return response.data; // Return the assessment result
//     }
//     throw new Error("No data returned from pronunciation assessment");
//   } catch (error) {
//     console.error("Error assessing pronunciation:", error);
//     throw error; // Rethrow the error to be handled in the calling function
//   }
// };
// Assess the pronunciation based on the audio and reference text
export const assessPronunciation = async (audioBlob, refText) => {
  const formData = new FormData();
  formData.append("audio_data", audioBlob);
  formData.append("reftext", refText); // Pass the reference text

  try {
    const response = await axios.post(`${BASE_URL}/ackaud`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Response from backend:", response);

    if (response.data) {
      return response.data; // Return the assessment result
    }
    throw new Error("No data returned from pronunciation assessment");
  } catch (error) {
    console.error("Error assessing pronunciation:", error);
    throw error;
  }
};



