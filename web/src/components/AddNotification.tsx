import { useState } from "react";
import DateTimePicker from "./DateTimePicker";
import { addNotification } from "../firebase/db";
import { format, parseISO } from "date-fns";
interface AddNotificationProps {
  handleAddProduct: () => void;
  typeNotification: "system" | "push" | "popup";
}
export const AddNotification: React.FC<AddNotificationProps> = ({
  handleAddProduct,
  typeNotification,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleCreateNotification = async () => {
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      category.trim() === "" ||
      !selectedDate ||
      !selectedTime
    ) {
      window.alert("Заповніть всі поля!");
      return;
    }
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    console.log("selectedDate", selectedDate);
    console.log("formattedDate", formattedDate);
    console.log("selectedTime", selectedTime);
    const formattedTime = format(parseISO(selectedTime), "HH:mm");

    // const formattedTime = format(selectedTime, "HH:mm");
    console.log("formattedTime", formattedTime);
    try {
      await addNotification({
        title,
        description,
        category,
        date: formattedDate,
        time: formattedTime,
        type: typeNotification,
        screen: "NotificationScreen",
      });

      window.alert("✅ Сповіщення успішно додано!");

      // Очистка форми після додавання
      setTitle("");
      setDescription("");
      setCategory("");
      setSelectedDate(null);
      setSelectedTime(null);
      handleAddProduct();
    } catch (error) {
      console.error("❌ Помилка при створенні сповіщення:", error);
      window.alert("❌ Помилка при створенні сповіщення!");
    }
  };
  return (
    <div>
      <div className="space-y-2 items-center">
        <label className="text-[14px] font-medium text-darkBlack">
          Заголовок <span className="text-red">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новинки"
          className="w-full p-2 border border-gray-300 bg-white text-black"
        />
      </div>
      <div className="space-y-2 items-center">
        <label className="text-[14px] font-medium text-darkBlack">
          Опис <span className="text-red">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Магній В6 — ідеальне поєднання для підтримки нервової системи..."
          className="w-full p-2 border border-gray-300 bg-white h-[200px] text-darkBlack"
        />
      </div>
      <div className="relative space-y-2">
        <label className="block text-[14px] font-medium text-darkBlack">
          Категорія <span className="text-red ml-1">*</span>
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white text-darkBlack"
          >
            <option value="">Оберіть категорію</option>
            <option value="promotion">Акція</option>
            <option value="update">Оновлення</option>
            <option value="info">Інформація</option>
          </select>
        </div>
      </div>

      <DateTimePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      <button
        onClick={handleCreateNotification}
        className="py-4 border border-gray-500 text-black w-full bg-gray-50"
      >
        Додати
      </button>
    </div>
  );
};
