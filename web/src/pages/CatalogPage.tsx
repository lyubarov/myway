import { Pagination, PaginationPropsForPages } from "../components/Pagination";
import { MyInput } from "../components/ui/MyInput";
import EditCardIcon from "../../assets/svg/EditCardIcon";
import { useEffect, useState } from "react";
import { getAllProductsFromBlocks } from "../firebase/db";

interface CatalogPageProps extends PaginationPropsForPages {
  onProductClick: (productId: string, blockId: string) => void;
}
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

export const CatalogPage: React.FC<CatalogPageProps> = ({
  currentPage,
  onPageChange,
  onProductClick,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categorySelect, setCategorySelect] = useState("");

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
  const filteredProducts = products.filter((product) => {
    const fullName = product.name.toLowerCase();
    const categoryMatch =
      categorySelect === "" ||
      product.category.toLowerCase().includes(categorySelect.toLowerCase());

    return categoryMatch && fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <h1 className="text-4xl font-medium font-main text-blackText mb-6">
        Список товарів
      </h1>
      <p className="text-darkStroke mb-5">
        Контент / <span className="text-darkBlack">Список товарів</span>
      </p>
      <MyInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="bg-white shadow-md overflow-hidden p-5">
        <p className="text-black">Категорія:</p>
        <select
          onChange={(e) => setCategorySelect(e.target.value ?? "")}
          className="my-4 sm:mt-0 border border-gray-300 bg-white text-darkBlack  px-3 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="">Категорія:</option>
          <option value="Вітаміни">Вітаміни та мінерали</option>
          <option value="Суперфуд">Суперфуд</option>
          <option value="Спортивне харчування">Спортивне харчування</option>
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {loading ? (
            <div>Loading</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-row relative items-center bg-white px-5 pt-5 pb-2  border border-gray-200 hover:shadow-lg transition"
              >
                <img
                  src={product.images[0]}
                  alt="Product"
                  className="w-20 h-20 object-cover"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-darkBlack">
                    {product.name}
                  </h2>
                  <p className="text-darkText text-[14px] font-medium">
                    {product.category}
                  </p>
                  <p className="text-lg font-medium text-darkBlack">
                    {product.price}₴
                  </p>
                  <p className="text-darkBlack text-[14px] ">
                    {Number(product.availability) > 0
                      ? "В наявності"
                      : "Очікується"}
                  </p>
                  <button
                    className="absolute top-6 right-6"
                    onClick={() => onProductClick(product.id, product.blockId)}
                  >
                    <EditCardIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <Pagination
          totalPages={1}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
