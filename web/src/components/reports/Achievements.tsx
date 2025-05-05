import { useEffect, useState } from "react";
import { getAchievements } from "../../firebase/db";
import { useAuth } from "../../firebase/context/authContext";
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";

export default function Achievements() {
  const { users } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [achievementCounts, setAchievementCounts] = useState<{
    [key: string]: { count: number; totalReward: number };
  }>({});

  useEffect(() => {
    const fetchAchievements = async () => {
      const achievements = await getAchievements();
      setAchievements(achievements);
    };
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (users.length > 0 && achievements.length > 0) {
      const counts: { [key: string]: { count: number; totalReward: number } } =
        {};

      // Ініціалізуємо counts для кожного досягнення зі значеннями 0
      achievements.forEach((achievement) => {
        counts[achievement.id] = { count: 0, totalReward: 0 };
      });

      // Проходимо по кожному користувачу
      users.forEach((user) => {
        achievements.forEach((achievement) => {
          user.achievementList?.forEach((ach) => {
            if (ach.includes(achievement.id)) {
              // Якщо користувач має це досягнення, збільшуємо лічильник виконань
              counts[achievement.id].count += 1;
              // Додаємо винагороду
              counts[achievement.id].totalReward += achievement.waylMoney || 0;
            }
          });
        });
      });

      // Оновлюємо стан з підрахунками
      setAchievementCounts(counts);
    }
  }, [users, achievements]);
  const exportToExcel = () => {
    const data = achievements.map((achievement) => ({
      Досягнення: achievement.name,
      "К-ть. виконань": achievementCounts[achievement.id]?.count || 0,
      "Нараховано вейлів": achievementCounts[achievement.id]?.totalReward || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Досягнення");

    XLSX.writeFile(wb, "Achievements.xlsx");
  };
  return (
    <div>
      <div className="flex flex-row gap-2 justify-between mb-4">
        <p className="text-lg font-medium text-darkText">Досягнення</p>
        <div className="flex flex-row gap-2">
          <div className="relative w-[82px]"></div>
          <button
            onClick={exportToExcel}
            className="bg-LightBack w-8 h-8 flex items-center justify-center"
          >
            <FiDownload className="text-darkText" />
          </button>
        </div>
      </div>

      <div className="w-full h-[200px] border-t border-#E5E5E5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-visible">
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 16px",
          }}
        >
          <thead>
            <tr>
              <th
                className="text-[14px]"
                style={{ textAlign: "start", width: "33%" }}
              >
                Досягнення
              </th>
              <th
                className="text-[14px]"
                style={{ textAlign: "start", width: "33%" }}
              >
                К-ть. виконань
              </th>
              <th
                className="text-[14px]"
                style={{ textAlign: "start", width: "33%" }}
              >
                Нараховано вейлів
              </th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement) => (
              <tr key={achievement.id}>
                <td
                  className="text-[12px] text-darkText"
                  style={{ textAlign: "start" }}
                >
                  {achievement.name}
                </td>
                <td
                  className="text-[12px] text-darkText"
                  style={{ textAlign: "start" }}
                >
                  {achievementCounts[achievement.id]?.count || 0}
                </td>
                <td
                  className="text-[12px] text-darkText"
                  style={{ textAlign: "start" }}
                >
                  {achievementCounts[achievement.id]?.totalReward || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
