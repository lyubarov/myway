import { useEffect, useState } from "react";
import { getOrders } from "../../firebase/db";
import { Timestamp } from "firebase/firestore";
import CircleChart from "../CircleChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Order {
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
  paymentByWayl: number;
  createdAt: Timestamp;
  products: {
    product: { id: string; name: string; price: string };
    quantity: number;
  }[];
}

interface Option {
  value: string;
  label: string;
}

const options: Option[] = [
  { value: "daily", label: "День" },
  { value: "weekly", label: "Тиждень" },
  { value: "monthly", label: "Місяць" },
  { value: "yearly", label: "Рік" },
];

const getFilteredDate = (time: string): Date => {
  const now = new Date();
  switch (time) {
    case "daily":
      now.setDate(now.getDate() - 1);
      break;
    case "weekly":
      now.setDate(now.getDate() - 7);
      break;
    case "monthly":
      now.setMonth(now.getMonth() - 1);
      break;
    case "yearly":
      now.setFullYear(now.getFullYear() - 1);
      break;
    default:
      break;
  }
  return now;
};

export default function PaymentReport() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState({ payment: "yearly" });

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await getOrders();
      setOrders(ordersData as Order[]);
    };
    fetchOrders();
  }, []);

  let byCard: number = 0;
  let byWayl: number = 0;

  const filteredOrders = orders.filter((order) => {
    const orderDate = order.createdAt.toDate();
    orderDate.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      return orderDate >= startDate && orderDate <= endDate;
    } else {
      const filteredDate = getFilteredDate(selectedOption.payment);
      return orderDate > filteredDate;
    }
  });

  for (const order of filteredOrders) {
    byCard += order.totalAmount;
    byWayl += order.paymentByWayl ?? 0;
  }

  return (
    <div>
      <div className="flex flex-row gap-2 justify-between mb-5 relative">
        <p className="text-lg font-medium mb-3">Звіт по оплаті</p>
        <div className="absolute -right-3 -top-1 flex flex-row gap-1">
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date || undefined)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate || new Date()}
              placeholderText="Від"
              className="w-[73px] py-1 bg-LightBack text-darkText text-[12px] h-8 px-1"
              dateFormat="dd.MM.yyyy"
            />
          </div>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date || undefined)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              placeholderText="До"
              className="w-[73px] py-1 bg-LightBack text-darkText text-[12px] h-8 px-1"
              dateFormat="dd.MM.yyyy"
            />
          </div>
        </div>
      </div>
      <div className="text-black ">
        <div className="flex justify-center items-center w-full h-[200px]">
          <CircleChart
            value1={byCard}
            value2={byWayl}
            label1={`Оплата карткою`}
            label2={`Оплата вейлами`}
          />
        </div>
      </div>
    </div>
  );
}
