import { useState } from "react";
import DateTimePicker from "./DateTimePicker";
import { NotificationData, updateNotification } from "../firebase/db";
import { format } from "date-fns";
interface AddNotificationProps {
  notification: NotificationData;
  handleChangeProduct: () => void;
  typeNotification: "system" | "push" | "popup";
}
export const ChangeNotification: React.FC<AddNotificationProps> = ({
  notification,
  handleChangeProduct,
  typeNotification,
}) => {
  const scheduledDateTime =
    notification.scheduledTime?.toDate?.() instanceof Date
      ? notification.scheduledTime.toDate()
      : new Date();
  const isoTime = scheduledDateTime.toISOString();

  const [title, setTitle] = useState(notification.title);
  const [body, setBody] = useState(notification.body);
  const [category, setCategory] = useState(notification.category || "");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    scheduledDateTime instanceof Date ? scheduledDateTime : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(isoTime);

  const handleChangeNotification = async () => {
    if (
      title.trim() === "" ||
      body.trim() === "" ||
      category.trim() === "" ||
      !selectedDate ||
      !selectedTime
    ) {
      window.alert("Заповніть всі поля!");
      return;
    }
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const parsedTime = new Date(selectedTime);
    const formattedTime = format(parsedTime, "HH:mm");

    try {
      await updateNotification(notification.id, {
        title,
        body,
        category,
        date: formattedDate,
        time: formattedTime,
        type: typeNotification,
        screen: "NotificationScreen",
      });

      // Очистка форми після додавання
      setTitle("");
      setBody("");
      setCategory("");
      setSelectedDate(null);
      setSelectedTime(null);
      handleChangeProduct();
    } catch (error) {
      console.error("❌ Помилка при оновленні сповіщення:", error);
      window.alert("❌ Помилка при оновленні сповіщення!");
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
          value={body}
          onChange={(e) => setBody(e.target.value)}
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
        onClick={() => handleChangeNotification()}
        className="py-4 border border-gray-500 text-black w-full bg-gray-50"
      >
        Оновити
      </button>
    </div>
  );
};
