import { FiDownload } from "react-icons/fi";
import { useAuth } from "../../firebase/context/authContext";
import * as XLSX from "xlsx";

export const ClientList = () => {
  const { users } = useAuth();

  const exportToExcel = () => {
    const data = users.map((user) => ({
      Клієнт: user.displayName || "Користувач",
      "Статус реферала": user.referralStatusName || "Реферал",
      "К-ть. рефералів": user.referrals?.length || 0,
      "Сума накопичень":
        user.referrals
          ?.map((referral) => referral.spent)
          .reduce((acc, curr) => acc + Number(curr), 0) || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(data); // Перетворюємо масив в Excel лист
    const wb = XLSX.utils.book_new(); // Створюємо нову книгу Excel
    XLSX.utils.book_append_sheet(wb, ws, "Клієнтська аналітика"); // Додаємо лист до книги

    // Генеруємо файл Excel та ініціюємо його завантаження
    XLSX.writeFile(wb, "ClientListReport.xlsx");
  };
  return (
    <div>
      <div className="flex flex-row gap-2 justify-between mb-4 items-center">
        <p className="text-lg font-medium text-darkText">
          Реферальна аналітика
        </p>
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
      <div className="w-full h-[304px] border-t border-E5E5E5 pt-4 pr-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-visible">
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="text-left py-2 text-[14px] font-medium">Клієнт</th>
              <th className="text-left py-2 text-[14px] font-medium">
                Статус реферала
              </th>
              <th className="text-left py-2 text-[14px] font-medium">
                К-ть. рефералів
              </th>
              <th className="text-left py-2 text-[14px] font-medium">
                Сума накопичень
              </th>
              <th className="w-[70px]"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.uid}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 text-[12px] text-darkStroke">
                  {user.displayName || "Користувач"}
                </td>
                <td className="py-2 text-[12px] text-darkStroke">
                  {user.referralStatusName || "Реферал"}
                </td>
                <td className="py-2 text-[12px] text-darkStroke">
                  {user.referrals?.length || 0}
                </td>
                <td className="py-2 text-[12px] text-darkStroke">
                  {user.referrals
                    ?.map((referral) => referral.spent)
                    .reduce((acc, curr) => acc + Number(curr), 0) || 0}
                </td>
                <td className="w-[70px]"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
