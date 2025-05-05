import { useEffect, useState } from "react";
import { Tip } from "../firebase/db";
import { uploadImageToStorage } from "../firebase/storage";
import UploadIcon from "../../assets/svg/UploadIcon";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, imageUrl: string, description: string) => void;
  onChange: (
    id: string,
    title: string,
    imgUrl: string,
    description: string
  ) => void;
  tip?: Tip | null;
}
export const TipModal = ({
  isOpen,
  onClose,
  onSave,
  onChange,
  tip,
}: TipModalProps) => {
  const [title, setTitle] = useState(tip?.title ?? "");
  const [imageUrl, setImageUrl] = useState(tip?.imageUrl ?? "");
  const [description, setDescription] = useState<string>(
    tip?.description || ""
  );

  useEffect(() => {
    if (tip) {
      setTitle(tip.title || "");
      setImageUrl(tip.imageUrl || "");
      setDescription(tip.description || "");
    } else {
      setTitle("");
      setImageUrl("");
      setDescription("");
    }
  }, [tip]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("Файл не обрано");
      return;
    }

    try {
      const path = `resources/tipsImages${Date.now()}_${file.name}`;
      const downloadURL = await uploadImageToStorage(file, path);
      console.log("Завантажено за адресою:", downloadURL);
      setImageUrl(downloadURL);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !description) {
      alert("Будь ласка, заповніть всі поля.");
      return;
    }

    if (tip?.id) {
      onChange(tip.id, title, imageUrl, description);
    } else {
      onSave(title, imageUrl, description);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6  w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Додати нову корисну пораду
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Назва поради
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 text-black bg-white"
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
            className="px-4 py-2 bg-blue-600 text-white"
          >
            {tip ? "Змінити" : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
};
