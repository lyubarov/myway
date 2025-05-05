import { useEffect, useState } from "react";
import { CloseIcon } from "../../assets/svg/CloseIcon";
import {
  getAllProductsFromBlocks,
  updateProductAvailability,
} from "../firebase/db";
import { updateOrderStatus } from "../firebase/db";
import DropDown from "../../assets/svg/DropDown";

interface Orders {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  totalAmount: number;
  deliveryType: {
    name: string;
    description: string;
  };
  paymentType: string;
  city: string;
  branch: string;
  number: string;
  orderNumber: string;
  ttn: string;
  createdAt: {
    toDate: () => Date;
  };
  products: Array<{
    product: {
      id: string;
      name: string;
      images: string[];
    };
    quantity: number;
  }>;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chosenOrder: Orders;
}

const statusOptions = [
  // "в обробці",
  "передано на доставку",
  // "очікує відправлення",
  // "доставлено",
  // "оплачено",
];

export const OrderModal = ({
  isOpen,
  onClose,
  chosenOrder,
}: FilterModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(chosenOrder?.status);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setSelectedStatus(chosenOrder?.status);
  }, [chosenOrder]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsFromBlocks();
        setProducts(data);
      } catch (error) {
        console.error("Помилка при отриманні продуктів:", error);
      }
    };

    fetchProducts();
  }, []);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrderStatus(chosenOrder.id, newStatus);
      setSelectedStatus(newStatus);

      if (newStatus === "передано на доставку") {
        for (const oneProduct of chosenOrder.products) {
          const { product, quantity } = oneProduct;
          await updateProductAvailability(product.id, quantity);
        }
      }
    } catch (error) {
      console.error("Помилка при оновленні статусу:", error);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white  max-w-[1200px] w-full p-6 relative min-h-[600px]">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 text-white bg-black border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <CloseIcon />
        </button>
        <div className="flex gap-4 mb-9">
          <div className="space-y-2 items-center max-w-[564px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              # ТТН
            </label>
            <input
              type="text"
              name="name"
              value={chosenOrder.ttn || chosenOrder.orderNumber}
              placeholder="Магній В6"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled // Забороняємо змінювати поле
            />
          </div>
          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Отримувач
            </label>
            <input
              type="text"
              name="price"
              value={`${chosenOrder.firstName} ${chosenOrder.lastName}`}
              placeholder="1400"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled // Забороняємо змінювати поле
            />
          </div>
          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Статус<span className="text-red">*</span>
            </label>
            <div className="relative">
              <div
                className="flex items-center justify-between p-2 border border-gray-300 bg-white text-darkBlack cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedStatus}</span>
                <DropDown />
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 text-darkBlack bg-white border border-gray-300 shadow-lg z-10">
                  {statusOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleStatusChange(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Оплата
            </label>
            <input
              type="text"
              name="discount"
              value={chosenOrder?.paymentType}
              placeholder="Оплата"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled // Забороняємо змінювати поле
            />
          </div>
          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Ціна (грн)
            </label>
            <input
              type="text"
              name="discount"
              value={chosenOrder?.totalAmount}
              placeholder="Ціна"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled // Забороняємо змінювати поле
            />
          </div>
        </div>
        <div className="space-y-2  min-w-[380px] w-full mb-9">
          <label className="text-[14px] font-medium text-darkBlack">
            Адреса доставки
          </label>
          <input
            type="text"
            name="discount"
            value={chosenOrder?.city + ", " + chosenOrder?.branch}
            placeholder="Адреса"
            className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
            disabled
          />
        </div>
        <div className="flex gap-4 mb-9">
          <div className="space-y-2 max-w-[550px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Спосіб доставки
            </label>
            <input
              type="text"
              name="discount"
              value={
                chosenOrder?.deliveryType.name +
                ", " +
                chosenOrder?.deliveryType.description
              }
              placeholder="Спосіб доставки"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled
            />
          </div>

          <div className="space-y-2 max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Телефон
            </label>
            <input
              type="text"
              name="discount"
              value={"+380 " + chosenOrder?.number}
              placeholder="20%"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled // Забороняємо змінювати поле
            />
          </div>

          <div className="space-y-2 items-center max-w-[274px] w-full">
            <label className="text-[14px] font-medium text-darkBlack">
              Дата:
            </label>
            <input
              type="text"
              name="availability"
              value={chosenOrder?.createdAt.toDate().toLocaleDateString()}
              placeholder="1000 шт"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
              disabled
            />
          </div>
        </div>

        {/* Фото */}
        <div className=" items-center w-full">
          <label className="text-[14px] font-medium text-darkBlack ">
            Замовлення:
          </label>
          <div className="flex flex-row gap-3 flex-wrap overflow-y-auto max-h-[220px] mt-3">
            {chosenOrder.products.map((product) => (
              <div
                key={product.product.id}
                className="text-black flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.product.id)}
                  onChange={() => handleProductSelect(product.product.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex flex-row items-start ">
                  <img
                    src={
                      products.find(
                        (prod) => prod.name === product.product.name
                      )?.images[0]
                    }
                    alt={product.product.name}
                    className="w-[72px] h-[72px] object-cover"
                  />
                  <div>
                    <p className="text-[18px] font-bold">
                      {product.product.name}
                    </p>
                    <p className="text-[14px]">
                      Кількість - {product.quantity}
                    </p>
                    <p className="text-[14px]">
                      Наявність:{" "}
                      {
                        products.find(
                          (prod) => prod.name === product.product.name
                        )?.availability
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
