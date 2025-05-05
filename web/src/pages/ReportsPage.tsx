import { ClientList } from "../components/reports/ClientList";
import PaymentReport from "../components/reports/PaymentReport";
import { NewClients } from "../components/reports/NewClients";
import Achievements from "../components/reports/Achievements";
import Orders from "../components/reports/Orders";
import Warehouse from "../components/reports/Warehouse";

export const ReportsPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-medium font-main text-blackText mb-5">
        Звіти
      </h1>
      <div className="flex flex-col gap-5 text-black">
        <div className="flex gap-5">
          <div className="flex gap-5">
            {/* Перший графік */}
            <div className="w-[294px] h-[285px] bg-white p-4">
              <PaymentReport />
            </div>
            {/* Другий графік */}
            <div className="w-[294px] h-[285px] bg-white p-4">
              <NewClients />
            </div>
          </div>
          {/* Третій графік */}
          <div className="max-w-[608px] w-full h-[285px] bg-white p-4">
            <Achievements />
          </div>
        </div>
        <div className="flex gap-5">
          {/* дрйгий рядок перша колонка*/}
          <div className="max-w-[617px] w-full h-[400px] bg-white p-4">
            <Orders />
          </div>

          {/* дрйгий рядок перша колонка*/}

          <div className="max-w-[608px] w-full h-[400px] bg-white p-4">
            <Warehouse />
          </div>
        </div>
        {/* третій рядок */}
        <div className="w-full h-[400px] bg-white p-4">
          <ClientList />
        </div>
      </div>
    </div>
  );
};
