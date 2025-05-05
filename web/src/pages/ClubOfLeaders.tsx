import { useEffect, useState } from "react";
import TableFilterIcon from "../../assets/svg/TableFilterIcon";
import { Pagination, PaginationPropsForPages } from "../components/Pagination";
import { MyInput } from "../components/ui/MyInput";
import { getUsers } from "../firebase/db";
import { useAuth } from "../firebase/context/authContext";
import { FilterModal } from "../components/FilterModal";
import { ClubOfLeadersModal } from "../components/ClubOfLeadersModul";

interface Orders {
  displayName: string;
  status: string;
  referralStatus: string;
  email: string;
  phoneNumber: string;
  dateOfBirthday: {
    day: string;
    month: string;
    year: string;
  };
}
const myStatusOptions = [
  {
    label: "Без статуса",
    checked: false,
  },
  {
    label: "Новенький",
    checked: false,
  },
  {
    label: "Покупець",
    checked: false,
  },
  {
    label: "Преміальний покупець",
    checked: false,
  },
  {
    label: "Ексклюзивний покупець",
    checked: false,
  },
  {
    label: "Постійний клієнт",
    checked: false,
  },
  {
    label: "Срібний клієнт",
    checked: false,
  },
  {
    label: "Золотий клієнт",
    checked: false,
  },
  {
    label: "Майстер балансу",
    checked: false,
  },
  {
    label: "Партнер",
    checked: false,
  },
  {
    label: "Платиновий партнер",
    checked: false,
  },
  {
    label: "Легенда My Way",
    checked: false,
  },
];

export const ClubOfLeaders: React.FC<PaginationPropsForPages> = ({
  currentPage,
  onPageChange,
}) => {
  const [users, setUsers] = useState<Orders[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { itemsPerPage } = useAuth();
  const [filterOptions, setFilterOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubOfLeadersOpen, setClubOfLeadersOpen] = useState(false);
  const handleCloseModal = () => {
    setClubOfLeadersOpen(!clubOfLeadersOpen);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        if (!Array.isArray(usersData)) {
          console.error("Помилка: отримані дані не є масивом", usersData);
          return;
        }

        const formattedUsers: Orders[] = usersData
          .map((user) => ({
            displayName: user.displayName || "Невідомий користувач",
            status: user.status || "ексклюзивний покупець",
            referralStatus: user.referralStatus || "реферальний експерт",
            email: user.email || "Немає email",
            phoneNumber: user.phoneNumber || "Немає телефону",
            dateOfBirthday: {
              day: user.dateOfBirthday?.day || "01",
              month: user.dateOfBirthday?.month || "січень",
              year: user.dateOfBirthday?.year || "2000",
            },
            medals: user.medals,
          }))
          .sort((a, b) => (b.medals || 0) - (a.medals || 0));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Помилка при отриманні користувачів:", error);
      }
    };

    fetchUsers();
  }, []);

  const totalPage = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.displayName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());

    // Переконуємося, що поля існують і є рядками
    const userStatus = user.status?.toLowerCase() || "";
    const userRefStatus = user.referralStatus?.toLowerCase() || "";

    const selectedFilters = filterOptions
      .filter((option) => option.checked)
      .map((option) => option.label.toLowerCase());

    const matchesFilter = selectedFilters.some(
      (filter) => userStatus.includes(filter) || userRefStatus.includes(filter)
    );

    return matchesSearch && (selectedFilters.length === 0 || matchesFilter);
  });

  const paginatedUsers = [...filteredUsers].slice(startIndex, endIndex);

  return (
    <>
      <h1 className="text-4xl font-medium font-main text-blackText mb-6">
        Список клієнтів
      </h1>
      <p className="text-base font-medium font-main text-blackText mb-4">
        Клієнти
      </p>
      <div className="flex flex-row justify-between items-center">
        <MyInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          onClick={handleCloseModal}
          className="bg-black text-[14px] p-3 mb-5 font-medium text-white"
        >
          Налаштування умов розіграшу
        </button>
      </div>
      <div className="bg-white shadow-md overflow-hidden p-5">
        <table className="flex-1 flex-col min-w-full border border-lightGrey text-darkText">
          <thead className="items-center">
            <tr className="border border-lightGrey">
              <th className="text-center border border-lightGrey p-3 font-medium">
                #
              </th>
              <th className="text-left border border-lightGrey px-3 w-[25%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Ім'я</span>
                </div>
              </th>

              <th className="text-left border border-lightGrey px-3 w-[25%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Вейли</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[25%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Пошта</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[25%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Телефон</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={index} className="border border-lightGrey items-center ">
                <td className="text-center border border-lightGrey p-4 ">
                  {startIndex + index + 1}
                </td>
                <td className="px-3 py-2.5 text-[14px] font-medium border border-lightGrey w-[25%]">
                  {user.displayName}
                </td>
                <td className="text-[14px] text-start px-3 font-medium border border-lightGrey w-[25%]">
                  {user.medals ? user.medals : 0}
                </td>
                <td className="text-[14px] text-start px-3 font-medium border border-lightGrey w-[25%]">
                  {user.email}
                </td>
                <td className="text-[14px] text-start px-3 font-medium border border-lightGrey w-[25%]">
                  {user.phoneNumber !== "Немає телефону" && "0"}
                  {user.phoneNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalPages={totalPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <FilterModal
          isOpen={isModalOpen}
          options={filterOptions}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={(newFilters) => setFilterOptions(newFilters)}
        ></FilterModal>
        <ClubOfLeadersModal
          isOpen={clubOfLeadersOpen}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
};
