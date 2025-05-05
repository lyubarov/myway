import { useEffect, useState } from "react";
import { getAllProductsFromBlocks } from "../../firebase/db";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";

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

export default function Warehouse() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
  const exportToExcel = () => {
    const data = products.map((product) => ({
      Категорія: product.category,
      "Назва товару": product.name,
      Залишки: product.availability,
    }));

    const ws = XLSX.utils.json_to_sheet(data); // Перетворюємо масив в Excel лист
    const wb = XLSX.utils.book_new(); // Створюємо нову книгу Excel
    XLSX.utils.book_append_sheet(wb, ws, "Складська аналітика"); // Додаємо лист до книги

    // Генеруємо файл Excel та ініціюємо його завантаження
    XLSX.writeFile(wb, "WarehouseReport.xlsx");
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="flex flex-row gap-2 justify-between mb-4 items-center">
            <p className="text-lg font-medium text-darkText ">
              Складська аналітика
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
          <div className="w-full h-[304px] border-t border-E5E5E5  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-visible">
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
                    Назва товару
                  </th>
                  <th
                    className="text-[14px]"
                    style={{ textAlign: "start", width: "33%" }}
                  >
                    Залишки
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
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
                      {product.availability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
