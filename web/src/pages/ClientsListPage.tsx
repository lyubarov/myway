import { useCallback, useEffect, useState } from "react";
import TableFilterIcon from "../../assets/svg/TableFilterIcon";
import TableSortIcon from "../../assets/svg/TableSortIcon";
import { Pagination, PaginationPropsForPages } from "../components/Pagination";
import { MyInput } from "../components/ui/MyInput";
import { getUsers } from "../firebase/db";
import { useAuth } from "../firebase/context/authContext";
import { FilterModal } from "../components/FilterModal";

interface Orders {
  displayName: string;
  status: string;
  referralStatusName: string;
  email: string;
  phoneNumber: string;
  dateOfBirthday: {
    day: string;
    month: string;
    year: string;
  };
}

type TSortOptions = "none" | "a" | "d";

const monthNamesToNumbers: { [key: string]: number } = {
  січень: 1,
  лютий: 2,
  березень: 3,
  квітень: 4,
  травень: 5,
  червень: 6,
  липень: 7,
  серпень: 8,
  вересень: 9,
  жовтень: 10,
  листопад: 11,
  грудень: 12,
};
const referralStatusOptions = [
  {
    label: "Без статусу",
    checked: false,
  },
  {
    label: "Реферал",
    checked: false,
  },
  {
    label: "Реферальний експерт",
    checked: false,
  },
  {
    label: "Майстер впливу",
    checked: false,
  },
  {
    label: "Лідер спільноти",
    checked: false,
  },
  {
    label: "Амбассадор бренду",
    checked: false,
  },
];
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

export const ClientsListPage: React.FC<PaginationPropsForPages> = ({
  currentPage,
  onPageChange,
}) => {
  const [users, setUsers] = useState<Orders[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<TSortOptions>("none");
  const { itemsPerPage } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [filterOptions, setFilterOptions] = useState([]);
  const [filterOptions, setFilterOptions] = useState<{
    myStatus: typeof myStatusOptions;
    referralStatus: typeof referralStatusOptions;
  }>({
    myStatus: myStatusOptions,
    referralStatus: referralStatusOptions,
  });
  const [activeFilterGroup, setActiveFilterGroup] = useState<
    "myStatus" | "referralStatus" | null
  >(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        if (!Array.isArray(usersData)) {
          console.error("Помилка: отримані дані не є масивом", usersData);
          return;
        }

        const formattedUsers: Orders[] = usersData.map((user) => ({
          displayName: user.displayName || "Невідомий користувач",
          status: user.status,
          referralStatusName: user.referralStatusName,
          email: user.email || "Немає email",
          phoneNumber: user.phoneNumber,
          dateOfBirthday: {
            day: user.dateOfBirthday?.day || "01",
            month: user.dateOfBirthday?.month || "січень",
            year: user.dateOfBirthday?.year || "2000",
          },
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Помилка при отриманні користувачів:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = () => {
    switch (sortOrder) {
      case "none": {
        setSortOrder("a");
        break;
      }
      case "a": {
        setSortOrder("d");
        break;
      }
      case "d": {
        setSortOrder("none");
        break;
      }
    }
  };

  const sortOrders = useCallback((orders: Orders[], ascend: TSortOptions) => {
    if (ascend == "none") return orders;
    return orders.sort((a, b) => {
      return ascend == "a"
        ? a.displayName.localeCompare(b.displayName)
        : -a.displayName.localeCompare(b.displayName);
    });
  }, []);

  const getMonthNumber = (monthName?: string): number | null => {
    if (!monthName) return null;
    return monthNamesToNumbers[monthName.toLowerCase()] || null;
  };
  const totalPage = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // const filteredOrders = sortOrders(
  //   users.filter((user) => {
  //     const fullName = `${user.displayName}`.toLowerCase();
  //     const matchesSearch = fullName.includes(searchQuery.toLowerCase());

  //     // Переконуємося, що поля існують і є рядками
  //     const userStatus = user.status?.toLowerCase() || "";
  //     const userRefStatus = user.referralStatusName?.toLowerCase() || "";

  //     const selectedFilters = filterOptions
  //       .filter((option) => option.checked)
  //       .map((option) => option.label.toLowerCase());

  //     const matchesFilter = selectedFilters.some(
  //       (filter) =>
  //         userStatus.includes(filter) || userRefStatus.includes(filter)
  //     );

  //     return matchesSearch && (selectedFilters.length === 0 || matchesFilter);
  //   }),
  //   sortOrder
  // );
  const filteredOrders = sortOrders(
    users.filter((user) => {
      const fullName = `${user.displayName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());

      const userStatus = user.status?.toLowerCase() || "";
      const userRefStatus = user.referralStatusName?.toLowerCase() || "";

      const selectedUserStatuses = filterOptions.myStatus
        .filter((option) => option.checked)
        .map((option) => option.label.toLowerCase());

      const selectedReferralStatuses = filterOptions.referralStatus
        .filter((option) => option.checked)
        .map((option) => option.label.toLowerCase());

      // Перевірка, чи юзер відповідає хоча б одному фільтру
      const matchesUserStatus = selectedUserStatuses.includes("без статуса")
        ? userStatus === "" || selectedUserStatuses.includes(userStatus)
        : selectedUserStatuses.length === 0 ||
          selectedUserStatuses.includes(userStatus);

      const matchesReferralStatus = selectedReferralStatuses.includes(
        "без статусу"
      )
        ? userRefStatus === "" ||
          selectedReferralStatuses.includes(userRefStatus)
        : selectedReferralStatuses.length === 0 ||
          selectedReferralStatuses.includes(userRefStatus);

      const matchesFilter = matchesUserStatus && matchesReferralStatus;

      // Перевіряємо пошук + фільтрацію
      return matchesSearch && matchesFilter;
    }),
    sortOrder
  );

  const paginatedOrders = [...filteredOrders].slice(startIndex, endIndex);

  return (
    <>
      <h1 className="text-4xl font-medium font-main text-blackText mb-6">
        Список клієнтів
      </h1>
      <p className="text-base font-medium font-main text-blackText mb-4">
        Клієнти
      </p>
      <MyInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="bg-white shadow-md overflow-hidden p-5">
        <table className="flex-1 flex-col min-w-full border border-lightGrey text-darkText">
          <thead className="items-center">
            <tr className="border border-lightGrey">
              <th className="text-center border border-lightGrey p-3 font-medium">
                #
              </th>
              <th className="text-left border border-lightGrey px-3 ">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Ім'я</span>
                  <div className="flex space-x-1">
                    <button onClick={handleSort}>
                      <TableSortIcon />
                    </button>
                  </div>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Статус</span>
                  <span className="flex space-x-1">
                    <button
                      onClick={() => {
                        setActiveFilterGroup("myStatus");
                        setIsModalOpen(true);
                      }}
                    >
                      <TableFilterIcon />
                    </button>
                  </span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">
                    Реферальний статус
                  </span>
                  <button
                    onClick={() => {
                      setActiveFilterGroup("referralStatus");
                      setIsModalOpen(true);
                    }}
                  >
                    <TableFilterIcon />
                  </button>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Пошта</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Телефон</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Д.н</span>
                </div>
              </th>
              {/* <th className="text-left border border-lightGrey px-3" /> */}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((user, index) => (
              <tr key={index} className="border border-lightGrey items-center">
                <td className="text-center border border-lightGrey p-4 ">
                  {startIndex + index + 1}
                </td>
                <td className="px-3 py-2.5 text-[14px] font-medium border border-lightGrey w-[240px]">
                  {user.displayName}
                </td>
                <td className="text-[14px] px-1 text-start font-medium border border-lightGrey">
                  {user.status ? user.status : "-"}
                </td>
                <td className="text-[14px] px-1 text-start font-medium border border-lightGrey">
                  {user.referralStatusName !== "" || user.referralStatusName
                    ? user.referralStatusName
                    : "-"}
                </td>
                <td className="text-[14px] px-1 text-start font-medium border border-lightGrey">
                  {user.email}
                </td>
                <td className="text-[14px] px-1 text-center font-medium border border-lightGrey">
                  {user.phoneNumber
                    ? `0${user.phoneNumber.replace(/\s+/g, "")}`
                    : "Немає номера"}
                </td>
                <td className="text-[14px] px-1 text-center font-medium border border-lightGrey">
                  {String(user.dateOfBirthday?.day).padStart(2, "0")}/{" "}
                  {String(getMonthNumber(user.dateOfBirthday?.month)).padStart(
                    2,
                    "0"
                  )}
                  / {user.dateOfBirthday?.year}
                </td>
                {/* <td className="p-2">
                  <div className="flex border border-lightGrey p-[10px] justify-center">
                    <EditIcon />
                  </div>
                </td> */}
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
          title={
            activeFilterGroup === "referralStatus"
              ? "Реферальний статус"
              : "Мій статус"
          }
          options={
            activeFilterGroup === "referralStatus"
              ? filterOptions.referralStatus
              : filterOptions.myStatus
          }
          onClose={() => {
            setIsModalOpen(false);
            setActiveFilterGroup(null);
          }}
          onSave={(updatedOptions) => {
            setFilterOptions((prev) => ({
              ...prev,
              [activeFilterGroup!]: updatedOptions,
            }));
            setIsModalOpen(false);
            setActiveFilterGroup(null);
          }}
        />
      </div>
    </>
  );
};
