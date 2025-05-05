import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import CircleChart from "../CircleChart";
import { useAuth } from "../../firebase/context/authContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface User {
  uid: string;
  displayName?: string;
  referralCode?: string;
  createdAt: Timestamp;
}

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

export const NewClients = () => {
  const { users } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [usersWithReferral, setUsersWithReferral] = useState<User[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState({
    newClients: "yearly",
  });

  useEffect(() => {
    if (users.length > 0) {
      let filtered: User[] = users;

      if (startDate && endDate) {
        filtered = users.filter((user) => {
          const userDate = user.createdAt.toDate();
          userDate.setHours(0, 0, 0, 0);
          return userDate >= startDate && userDate <= endDate;
        });
      } else {
        const filteredDate = getFilteredDate(selectedOption.newClients);
        filtered = users.filter((user) => {
          const userDate = user.createdAt.toDate();
          userDate.setHours(0, 0, 0, 0);
          return userDate > filteredDate;
        });
      }

      setFilteredUsers(filtered);
      const usersWithReferral = filtered.filter((user) => {
        const referral = user.referralCode;
        return referral !== null;
      });
      setUsersWithReferral(usersWithReferral);
    }
  }, [users, startDate, endDate, selectedOption.newClients]);

  return (
    <div>
      <div className="flex flex-row gap-2 justify-between mb-5 relative">
        <p className="text-lg font-medium">Нові клієнти</p>
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
            value1={filteredUsers.length - usersWithReferral.length}
            value2={usersWithReferral.length}
            label1={`Нові клієнти`}
            label2={`Нові реферали`}
          />
        </div>
      </div>
    </div>
  );
};
