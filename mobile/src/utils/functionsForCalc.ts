 import moment from "moment";

export const getNextNotificationDate = (days: string[]): string => {
  const dayMapping: { [key: string]: number } = {
    Понеділок: 1,
    Вівторок: 2,
    Середа: 3,
    Четвер: 4,
    "П’ятниця": 5,
    Субота: 6,
    Неділя: 7,
  };

  const today = moment().isoWeekday(); // Отримуємо поточний день (1-7)
  const selectedDays = days.map((day) => dayMapping[day]); // Перетворюємо дні у числа

  // Сортуємо дні за зростанням і знаходимо найближчий день
  const nextDay = selectedDays
    .sort((a, b) => a - b)
    .find((day) => day > today) ?? selectedDays[0]; // Якщо немає майбутнього дня, беремо перший у списку

  const nextDate = moment().isoWeekday(nextDay); // Отримуємо дату найближчого дня
  if (nextDay < today) nextDate.add(7, "days"); // Якщо день вже минув, переходимо на наступний тиждень

  return nextDate.format("YYYY-MM-DD");
}
export const getAdjustedTime = (time: string): string => {
  return moment(time, "HH:mm")
    .format("HH:mm");
};
