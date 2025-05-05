import axios from "axios";

const API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = "77148f941c603b873411402a4e93157d"; 


export async function getOrderStatus(ttnNumber: string) {
  const requestData = {
    apiKey: API_KEY,
    modelName: "TrackingDocument",
    calledMethod: "getStatusDocuments",
    methodProperties: {
      Documents: [
        {
          DocumentNumber: ttnNumber, 
          Phone: "", 
        },
      ],
    },
  };

  try {
    const response = await axios.post(API_URL, requestData);
    
    if (response.data.success && response.data.data.length > 0) {
      return response.data.data[0].Status; // ✅ Повертаємо інформацію про статус
    } else {
      console.error("❌ Помилка отримання статусу:", response.data.errors);
      return null;
    }
  } catch (error) {
    console.error("❌ Виникла помилка під час отримання статусу:", error);
    return null;
  }
}