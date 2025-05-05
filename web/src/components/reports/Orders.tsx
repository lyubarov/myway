import { useEffect, useState } from "react";
import { getAllProductsFromBlocks, getOrders } from "../../firebase/db";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  status: string;
  availability: string;
  blockId: string;
  recommended: string;
  composition: string;
  description: string;
  videoLink: string;
  images: string[];
}

export default function Orders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productOrderCounts, setProductOrderCounts] = useState<
    Map<string, number>
  >(new Map());
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsFromBlocks();
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Помилка при отриманні продуктів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await getOrders();
      const counts = new Map<string, number>();

      ordersData.forEach((order) => {
        const orderDate = order.createdAt.toDate();
        if (
          (!startDate && !endDate) ||
          (startDate &&
            endDate &&
            orderDate >= startDate &&
            orderDate <= endDate)
        ) {
          order.products.forEach((product) => {
            counts.set(
              product.product.id,
              (counts.get(product.product.id) || 0) + product.quantity
            );
          });
        }
      });

      setProductOrderCounts(counts);
    };

    fetchOrders();
  }, [startDate, endDate]);

  const exportToExcel = () => {
    const data = products.map((product) => ({
      Категорія: product.category,
      Назва: product.name,
      Кількість: productOrderCounts.get(product.id) || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Замовлення");
    XLSX.writeFile(wb, "OrdersReport.xlsx");
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="flex flex-row gap-2 justify-between mb-4 items-center">
            <p className="text-lg font-medium text-darkText">
              Звіт по продуктам
            </p>
            <div className="flex flex-row gap-2">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) =>
                    setStartDate(date || undefined)
                  }
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
                  onChange={(date: Date | null) =>
                    setEndDate(date || undefined)
                  }
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
              <button
                onClick={exportToExcel}
                className="bg-LightBack w-8 h-8 flex items-center justify-center"
              >
                <FiDownload className="text-darkText" />
              </button>
            </div>
          </div>
          <div className="w-full h-[304px] border-t border-E5E5E5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-visible">
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
                    Категорія
                  </th>
                  <th
                    className="text-[14px]"
                    style={{ textAlign: "start", width: "33%" }}
                  >
                    Назва
                  </th>
                  <th
                    className="text-[14px]"
                    style={{ textAlign: "start", width: "33%" }}
                  >
                    Кількість
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const orderCount = productOrderCounts.get(product.id) || 0;
                  return (
                    <tr key={product.id}>
                      <td
                        className="text-[12px] text-darkText"
                        style={{ textAlign: "start", width: "33%" }}
                      >
                        {product.category}
                      </td>
                      <td
                        className="text-[12px] text-darkText"
                        style={{ textAlign: "start", width: "33%" }}
                      >
                        {product.name}
                      </td>
                      <td
                        className="text-[12px] text-darkText"
                        style={{ textAlign: "start", width: "33%" }}
                      >
                        {orderCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
