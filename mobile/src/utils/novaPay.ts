import axios from "axios";

const API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = "6e6abc26e2c2764cfc3efd009d15c2a9"; 
// const API_KEY = "77148f941c603b873411402a4e93157d"; 



export async function getCities(search = "") {
  const requestData = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "getCities",
    methodProperties: {
      FindByString: search,
    },
  };

  try {
    const response = await axios.post(API_URL, requestData);
    return response.data.data;
  } catch (error) {
    console.error("Помилка отримання міст:", error);
    return [];
  }
}

export async function getWarehouses(cityRef: string) {
  
  const requestData = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: cityRef,
    },
  };

  try {
    const response = await axios.post(API_URL, requestData);
    return response.data.data;
  } catch (error) {
    console.error("Помилка отримання відділень:", error);
    return [];
  }
}
export async function getStreets(cityRef: string, search: string) {

  const requestData = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "getStreet",
    methodProperties: {
      CityRef: cityRef, 
      FindByString: search, 
    },
  };

  try {
    const response = await axios.post(API_URL, requestData);
    return response.data.data; 
  } catch (error) {
    console.error("Помилка отримання вулиць:", error);
    return [];
  }
}

export async function createOrder(orderData: any) {
  const cleanedPhone = orderData.recipientPhone.replace(/\D/g, ""); 
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const requestData = {
    apiKey: API_KEY,
    modelName: "InternetDocument",
    calledMethod: "save",
    methodProperties: {
      NewAddress: "1", // Чи нова адреса (1 - так, 0 - ні)
      PayerType: "Sender", // Хто платить: Sender (відправник), Recipient (отримувач), ThirdPerson (третя сторона)
      PaymentMethod: "NonCash", // Спосіб оплати: Cash (готівка), NonCash (безготівка)
      CargoType: "Parcel",// Тип вантажу: Cargo (вантаж), Parcel (посилка), Documents (документи)
      DateTime:formattedDate,
      VolumeGeneral: "0.1", // Загальний об'єм (в м³)
      Weight: "1", // Вага (кг)
      ServiceType: "WarehouseWarehouse", // Тип доставки: WarehouseWarehouse (відділення-відділення)
      SeatsAmount: orderData.seatsAmount || "1", // Кількість місць
      Description: orderData.description || "Товари", // Опис відправлення
      Cost: orderData.cost || "500", // Вартість замовлення

      CitySender: "e717110a-4b33-11e4-ab6d-005056801329",
      SenderAddress: "dab4d4a2-d5fb-11e9-b0c5-005056b24375", 
      Sender: "b6b47c9f-57db-11ea-8133-005056881c6b", 
      ContactSender:"b72d4245-57db-11ea-8133-005056881c6b",
      SenderContactName: "Пономарьова Наталія Сергіівна",
      SendersPhone: "380979055785", 
      
      CityRecipient: orderData.cityRecipient, // Ref міста отримувача
      RecipientAddress: orderData.recipientWarehouse, // Ref відділення отримувача
      Recipient: orderData.recipientRef, // Ref отримувача
      ContactRecipient:orderData.contactRecipient,
      // RecipientContactName: orderData.recipientName, // Ім'я отримувача
      RecipientsPhone: cleanedPhone, // Телефон отримувача
    },
  };

  try {
    const response = await axios.post(API_URL, JSON.stringify(requestData));
    if (response.data.success) {
      console.log("✅ Замовлення успішно створено:", response.data.data);
      const ttn = response.data.data?.[0].IntDocNumber;

      return ttn; 
    } else {
      console.error("❌ Помилка створення замовлення:", response.data.errors);
      return null;
    }
  } catch (error) {
    console.error("❌ Виникла помилка:", error);
    return null;
  }
}

interface CreateRecipientParams {
  cityRef: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export async function getRecipientRef({
  firstName,
  lastName,
  phone,
}: CreateRecipientParams): Promise<string> {
  const cleanedPhone = phone.replace(/\D/g, ""); 
        console.log("phone",cleanedPhone);
 const cleanedFirstName = firstName.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ]/g, "");
const cleanedLastName = lastName.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ]/g, "");


  try {
    const response = await axios.post(API_URL, {
      apiKey: API_KEY,
      modelName: "CounterpartyGeneral",
      calledMethod: "save",
      methodProperties: {
        CounterpartyType: "PrivatePerson",
        CounterpartyProperty: "Recipient", 
        FirstName: cleanedFirstName,
        MiddleName: "",
        LastName: cleanedLastName,
        Phone: cleanedPhone,
      },
    });

    const recipientContactRef = response.data.data?.[0].ContactPerson.data[0].Ref;
    const recipientRef = response.data.data?.[0].Ref;

    const refs ={recipientRef,recipientContactRef}

    if (!refs) {
      console.error("❌ Відповідь API:", response.data);
      throw new Error("❌ Не вдалося створити контрагента (отримувача)");
    }
    console.log("recipientRef==ЮЮ",refs);
    
    return refs;

  } catch (error) {

    console.error("❌ Помилка при створенні отримувача:", error);
    throw error;
  }
}
interface CreateRecipientContact {
  firstName: string;
  lastName: string;
  phone: string;
}
export async function createRecipientContact({
  firstName,
  lastName,
  phone,
}: CreateRecipientContact): Promise<string>{
  const cleanedPhone = phone.replace(/\D/g, "");

  const requestData = {
    apiKey: API_KEY,
    modelName: "CounterpartyGeneral",
    calledMethod: "save",
    methodProperties: {
      ContactType: "Recipient", // Контакт для отримувача
      FirstName: firstName, // Ім'я
      MiddleName: "",
      LastName: lastName, // Прізвище
      Phone: cleanedPhone, // Телефон
      CounterpartyType: "PrivatePerson",
      CounterpartyProperty: "Recipient"
    },
    
  };

  try {
    const response = await axios.post(API_URL, requestData);
    const contactRef = response.data.data?.[0]?.Ref;

    if (!contactRef) {
      console.error("❌ Помилка створення контакту для отримувача:", response.data);
      throw new Error("Не вдалося створити контакт для отримувача");
    }

    return contactRef;
  } catch (error) {
    console.error("❌ Помилка при створенні контакту для отримувача:", error);
    throw error;
  }
}