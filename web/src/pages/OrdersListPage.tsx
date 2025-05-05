import { useEffect, useState, useRef } from "react";
import TableFilterIcon from "../../assets/svg/TableFilterIcon";
import { Pagination, PaginationPropsForPages } from "../components/Pagination";
import { MyInput } from "../components/ui/MyInput";
import {
  getOrders,
  updateOrderStatus,
  updateProductAvailability,
} from "../firebase/db";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../firebase/context/authContext";
import { FilterModal } from "../components/FilterModal";
import DropDown from "../../assets/svg/DropDown";
import { SortIcon } from "../../assets/svg/SortIcon";
import { ThreeDots } from "../../assets/svg/ThreeDots";
import { OrderModal } from "../components/OrderModal";
interface Orders {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
  city: string;
  branch: string;
  number: string;
  createdAt: Timestamp;
}
const options = [
  // {
  //   label: "в обробці",
  //   checked: false,
  // },
  {
    label: "передано на доставку",
    checked: false,
  },
  {
    label: "очікує відправлення",
    checked: false,
  },
  {
    label: "доставлено",
    checked: false,
  },
  // {
  //   label: "оплачено",
  //   checked: false,
  // },
];
export const OrdersListPage: React.FC<PaginationPropsForPages> = ({
  currentPage,
  onPageChange,
}) => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState(options);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const [sortAscending, setSortAscending] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [chosenOrder, setChosenOrder] = useState<Orders | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const { itemsPerPage } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await getOrders();
      setOrders(ordersData);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedOrder(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "Невідомо";

    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const totalPage = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());

    const selectedFilters = filterOptions
      .filter((option) => option.checked)
      .map((option) => option.label.toLowerCase());

    // Переконуємося, що order.status існує і є рядком
    const orderStatus = order.status ? order.status.toLowerCase() : "";

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => orderStatus.includes(filter));

    return matchesSearch && matchesFilter;
  });
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aDate = a.createdAt.toDate().getTime();
    const bDate = b.createdAt.toDate().getTime();
    return sortAscending ? aDate - bDate : bDate - aDate;
  });
  // const paginatedOrders = [...filteredOrders]
  //   .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  //   .slice(startIndex, endIndex);
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  const handleChangeStatus = (id: string, element: HTMLDivElement) => {
    setSelectedOrder(id);

    // Перевіряємо позицію відносно таблиці
    if (tableRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const spaceBelow = tableRect.bottom - elementRect.bottom;
      const dropdownHeight = 200; // Приблизна висота випадаючого списку

      setDropdownPosition(spaceBelow < dropdownHeight ? "top" : "bottom");
    }
  };

  // const handleStatusChange = async (
  //   orderId: string,
  //   newStatus: string,
  //   order: Orders
  // ) => {
  //   try {
  //     await updateOrderStatus(orderId, newStatus);

  //     const updatedOrders = orders.map((orderItem) =>
  //       orderItem.id === orderId
  //         ? { ...orderItem, status: newStatus }
  //         : orderItem
  //     );
  //     if (newStatus === "передано на доставку") {
  //       for (const oneProduct of order.products) {
  //         const { product, quantity } = oneProduct;
  //         await updateProductAvailability(product.id, quantity);
  //       }
  //     }

  //     setOrders(updatedOrders);

  //     setSelectedOrder(null);
  //   } catch (error) {
  //     console.error("Помилка при оновленні статусу:", error);
  //   }
  // };

  const handleSortByDate = () => {
    setSortAscending(!sortAscending); // Перемикаємо напрямок сортування
  };

  return (
    <>
      <h1 className="text-4xl font-medium font-main text-blackText mb-6">
        Список замовлень
      </h1>
      <p className="text-base font-medium font-main text-blackText mb-4">
        Замовлення
      </p>
      <MyInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="bg-white shadow-md overflow-hidden p-5">
        <table
          ref={tableRef}
          className="flex-1 flex-col min-w-full border border-lightGrey text-darkText"
        >
          <thead className="items-center">
            <tr className="border border-lightGrey">
              <th className="text-center border border-lightGrey p-3 font-medium">
                #
              </th>
              <th className="text-left border border-lightGrey px-3 w-[17%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Отримувач</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[12%]">
                <div className="flex items-center justify-between space-x-3">
                  <span className="text-xs font-medium">Статус</span>

                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    <TableFilterIcon />
                  </button>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[10%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Оплата</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-2 w-[7%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Ціна</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[15%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Спосіб доставки</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[15%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Адреса доставки</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[9%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Телефон</span>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[8%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Дата</span>
                  <button onClick={handleSortByDate}>
                    <SortIcon />
                  </button>
                </div>
              </th>
              <th className="text-left border border-lightGrey px-3 w-[4%]">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-xs font-medium">Інфо</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((item, index) => (
              <tr key={index} className="border border-lightGrey items-center">
                <td className="text-center border border-lightGrey p-4">
                  {startIndex + index + 1}
                </td>
                <td className="pl-3 py-2.5 text-[14px] font-medium border border-lightGrey">
                  {item.firstName} {item.lastName}
                </td>
                <td className="text-[14px] text-center font-medium border border-lightGrey">
                  <div
                    className="flex items-center justify-between relative cursor-pointer"
                    onClick={(e) =>
                      handleChangeStatus(item.id, e.currentTarget)
                    }
                  >
                    <span className="pl-2 text-start">{item.status}</span>
                  </div>
                </td>
                <td className="text-[14px] text-center font-medium border border-lightGrey">
                  {item.paymentMethod ? item.paymentMethod : "карткою"}
                </td>
                <td className="text-[14px] text-center font-medium border border-lightGrey">
                  {item.totalAmount} грн
                </td>
                <td className="text-[14px] text-center font-medium border border-lightGrey">
                  {item.deliveryMethod
                    ? item.deliveryMethod
                    : "Нова пошта, адресна"}
                </td>
                <td className=" text-[14px] text-center font-medium border border-lightGrey">
                  {item.city} {item.branch}
                </td>
                <td className="text-[14px] text-center font-medium border border-lightGrey px-2">
                  {item.number
                    ? `0${item.number.replace(/\s+/g, "")}`
                    : "Немає номера"}
                </td>
                <td className="text-[14px] text-center font-medium border border-lightGrey px-2">
                  {formatDate(item.createdAt)}
                </td>
                <th className="text-left border border-lightGrey px-3 w-[4%]">
                  <div
                    onClick={() => {
                      setIsInfoOpen(true);
                      setChosenOrder(item);
                    }}
                    className="flex items-center justify-between space-x-2 cursor-pointer"
                  >
                    <ThreeDots />
                  </div>
                </th>
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
        <OrderModal
          isOpen={isInfoOpen}
          onClose={() => {
            setIsInfoOpen(false);
          }}
          chosenOrder={chosenOrder}
        ></OrderModal>
      </div>
    </>
  );
};
