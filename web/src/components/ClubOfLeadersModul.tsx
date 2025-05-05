import { useEffect, useState, ChangeEvent } from "react";
import { CloseIcon } from "../../assets/svg/CloseIcon";
import { addOrUpdateClubOfLeaders, getClubOfLeaders } from "../firebase/db";
import UploadIcon from "../../assets/svg/UploadIcon";
import TrashIcon from "../../assets/svg/TrashIcon";
import {
  deleteImageFromStorage,
  uploadImageToStorage,
} from "../firebase/storage";

// Типізація для опису даних клубу
interface ClubOfLeadersData {
  title: string;
  датаПочатку: string | null;
  датаЗакінчення: string | null;
  зображення: string;
  description: string;
}

// Типізація для пропсів компонента
interface ClubOfLeadersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClubOfLeadersModal = ({
  isOpen,
  onClose,
}: ClubOfLeadersModalProps) => {
  const [info, setInfo] = useState<ClubOfLeadersData | null>(null);

  // Функція для завантаження даних
  useEffect(() => {
    const fetchData = async () => {
      const data = await getClubOfLeaders();
      setInfo(data);
    };
    fetchData();
  }, []);

  if (!isOpen || !info) return null;

  // Форматування дати
  const formatDate = (date: string | null, number: number) => {
    if (!date) return ""; // Якщо дата не існує, повертаємо порожній рядок

    const jsDate = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(jsDate.getTime())) {
      console.error("Invalid date value:", date);
      return "";
    }

    const day = String(jsDate.getDate()).padStart(2, "0");
    const month = String(jsDate.getMonth() + number + 1).padStart(2, "0");
    const year = jsDate.getFullYear();

    return `${year}-${month}-${day}`;
  };
  // Обробка завантаження файлу
  const handleFileDownload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("Файл не обрано");
      return;
    }

    try {
      // Якщо зображення вже є, видаляємо старе
      if (info.зображення) {
        await deleteImageFromStorage(info.зображення);
      }

      // Завантажуємо нове зображення
      const path = `leaders/${Date.now()}_${file.name}`;
      const downloadURL = await uploadImageToStorage(file, path);
      console.log("Завантажено за адресою:", downloadURL);

      setInfo((prev) => ({
        ...prev!,
        зображення: downloadURL,
      }));
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  };

  // Обробка видалення зображення
  const handleImageDelete = async () => {
    if (info.зображення) {
      // Видалити зображення зі сховища
      await deleteImageFromStorage(info.зображення);
      setInfo((prev) => ({
        ...prev!,
        зображення: "", // Очищаємо зображення
      }));
    }
  };

  // Обробка відправки форми
  const handleSubmit = async () => {
    const clubData = {
      title: info.title,
      startDate: info.датаПочатку,
      image: info.зображення,
      description: info.description,
    };
    try {
      await addOrUpdateClubOfLeaders(clubData);
      alert("Дані успішно збережено!");
    } catch (error) {
      console.error("Помилка збереження даних:", error);
    }
  };
  const handleDateChange =
    (field: "датаПочатку") => (event: ChangeEvent<HTMLInputElement>) => {
      const date = event.target.value;
      setInfo((prev) => ({
        ...prev!,
        [field]: date,
      }));
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-[1200px] w-full p-6 relative min-h-[500px] max-h-[90%] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute -top-0 -right-0 text-white bg-black border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <CloseIcon />
        </button>
        <div className="flex gap-4 mb-9 ">
          <div className="space-y-2 items-center max-w-[564px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Заголовок<span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={info.title || ""}
              placeholder="Заголовок"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              onChange={(e) => setInfo({ ...info, title: e.target.value })}
            />
          </div>
          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Дата початку<span className="text-red">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formatDate(info?.датаПочатку, 0) || ""}
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              onChange={handleDateChange("датаПочатку")}
            />
          </div>
          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Дата закінчення<span className="text-red">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formatDate(info?.датаПочатку, 3) || ""}
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled
            />
          </div>
        </div>
        <div className="space-y-2 items-center w-full mb-9">
          <label className="text-[14px] font-medium text-darkBlack">
            Фото товару: <span className="text-red">*</span>
          </label>
          <div className={`flex gap-3`}>
            {info.зображення !== "" ? (
              <div className="relative border border-lightGrey p-4 max-w-[112px] h-[112px]">
                <img src={info.зображення} alt="mag" />
                <TrashIcon
                  className="absolute bottom-1 right-1 cursor-pointer"
                  onClick={() => handleImageDelete()}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="max-w-[112px] w-full h-[112px] flex items-center justify-center border border-lightGrey">
              <button
                className="flex text-black cursor-pointer"
                onClick={() => document.getElementById("upload-photo")!.click()}
              >
                <UploadIcon />
                Замінити
              </button>
              <input
                id="upload-photo"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileDownload}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="space-y-2 items-center w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Опис
              <span className="text-red">*</span>
            </label>
            <p className="text-black">
              Використовуйте обгортки для позначення заголовку(1), параграфу(2),
              перенесення на наступний рядок(3Í).
            </p>

            <div className="flex flex-row gap-3">
              <p className="text-black font-bold"> {"1) <title:...>"}</p>
              <p className="text-black font-bold">{"2) <description:...>"}</p>
              <p className="text-black font-bold">{"3) /n"}</p>
            </div>
            <textarea
              name="description"
              value={info.description}
              placeholder="Магній В6"
              className="w-full h-[220px] p-2 border border-gray-300 bg-white text-darkBlack overflow-y-auto resize-none"
              onChange={(e) =>
                setInfo({
                  ...info,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mt-3"
            onClick={handleSubmit}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};
