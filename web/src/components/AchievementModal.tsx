import { useEffect, useState } from "react";
import UploadIcon from "../../assets/svg/UploadIcon";
import { uploadImageToStorage } from "../firebase/storage";

interface Achievements {
  id: string;
  name: string;
  waylMoney: number;
  description: string;
  img: string;
}
interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    imageUrl: string,
    waylMoney: number,
    description: string
  ) => void;
  onChange: (
    id: string,
    name: string,
    imageUrl: string,
    waylMoney: number,
    description: string
  ) => void;
  achievement?: Achievements | null;
}
export const AchievementModal = ({
  isOpen,
  onClose,
  onSave,
  onChange,
  achievement,
}: AchievementModalProps) => {
  const [name, setName] = useState<string>(achievement?.name || "");
  const [waylMoney, setValue] = useState<number | undefined>(
    achievement?.waylMoney
  );
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState<string>(
    achievement?.description || ""
  );

  useEffect(() => {
    if (achievement) {
      setName(achievement.name || "");
      setValue(achievement.waylMoney || undefined);
      setDescription(achievement.description || "");
      setImageUrl(achievement.img || "");
    } else {
      setName("");
      setValue(undefined);
      setDescription("");
      setImageUrl("");
    }
  }, [achievement]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("Файл не обрано");
      return;
    }

    try {
      const path = `resources/achievementsImages/achievement_${Date.now()}_${
        file.name
      }`;
      const downloadURL = await uploadImageToStorage(file, path);
      console.log("Завантажено за адресою:", downloadURL);
      setImageUrl(downloadURL);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !waylMoney) {
      alert("Будь ласка, заповніть всі поля.");
      return;
    }

    if (achievement?.id) {
      onChange(achievement.id, name, imageUrl, waylMoney, description);
    } else {
      onSave(name, imageUrl, waylMoney, description);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Додати нове досягнення
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Назва досягнення
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300  text-black bg-white"
            />
          </div>
          <div className="flex flex-row justify-between items-center">
            <button
              className="flex h-fit text-black cursor-pointer"
              onClick={() => document.getElementById("upload-photo")!.click()}
            >
              <UploadIcon />
              Додати зображення
            </button>
            <div className="h-20 w-20">
              {imageUrl == "" ? null : (
                <img className="h-20 w-20" src={imageUrl} alt="no image yet" />
              )}
            </div>
            <input
              id="upload-photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Значення
            </label>
            <input
              type="number"
              value={waylMoney}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full p-2 border border-gray-300  text-black bg-white"
            />
          </div>
          <label className="block text-sm font-medium text-black">Опис</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300  text-black bg-white"
            rows={4}
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 ">
            Скасувати
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white "
          >
            {achievement ? "Змінити" : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
};
