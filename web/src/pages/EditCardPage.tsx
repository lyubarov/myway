import { useEffect, useState } from "react";
import ContentInfoIcon from "../../assets/svg/ContentInfoIcon";
import TrashIcon from "../../assets/svg/TrashIcon";
import UploadIcon from "../../assets/svg/UploadIcon";
import {
  addProductToCatalog,
  getProductById,
  getProductsFromBlock,
  updateDataInCatalog,
} from "../firebase/db";
import {
  deleteImageFromStorage,
  uploadImageToStorage,
} from "../firebase/storage";
import { FaAngleDown } from "react-icons/fa";
import { CloseIcon } from "../../assets/svg/CloseIcon";

interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  subCategory: string;
  status: string;
  availability: string;
  recommended: string[];
  composition: string;
  description: string;
  videoLink: string;
  images: string[];
}
export default function EditCardPage({
  productId,
  selectedBlockId,
  clickOnFinish,
}: {
  productId: string | null;
  selectedBlockId: string | null;
  clickOnFinish: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState(""); // Поле для введеного тексту
  const [recommended, setRecommended] = useState<string[]>([]);

  const initialFormData: Product = {
    id: "",
    name: "",
    price: "",
    discount: "",
    category: "",
    subCategory: "",
    status: "",
    availability: "",
    recommended: [],
    composition: "",
    description: "",
    videoLink: "",
    images: [],
  };

  const [formData, setFormData] = useState<Product>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(selectedBlockId, productId);
        if (selectedBlockId) {
          const allProducts = await getProductsFromBlock(selectedBlockId);
          if (data && "images" in data && Array.isArray(data.images)) {
            const images = data.images as string[];
            setUploadedImages(images);
            setFormData((prev) => ({ ...prev, images }));
          } else {
            setUploadedImages([]);
            setFormData((prev) => ({ ...prev, images: [] }));
          }
          if (allProducts) {
            const fixedProducts = allProducts.map((p) => ({
              ...p,
              recommended: Array.isArray(p.recommended)
                ? p.recommended
                : [p.recommended],
            }));
            setProducts(fixedProducts);
          }

          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Помилка при отриманні продукту:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [selectedBlockId, productId]);

  console.log(products);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаємо помилку при зміні поля
    setValidationErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = {
      name: "Назва",
      price: "Ціна",
      category: "Категорія",
      subCategory: "Підкатегорія",
      status: "Статус",
      availability: "Наявність",
      composition: "Склад",
      description: "Опис",
      images: "Фото товару",
    };

    const errors: Record<string, boolean> = {};
    const missingFields = Object.entries(requiredFields).filter(([key]) => {
      if (key === "images") {
        const hasError = !uploadedImages || uploadedImages.length === 0;
        errors[key] = hasError;
        return hasError;
      }
      const hasError = !formData[key as keyof Product];
      errors[key] = hasError;
      return hasError;
    });

    setValidationErrors(errors);

    if (missingFields.length > 0) {
      const missingFieldsNames = missingFields
        .map(([_, name]) => name)
        .join(", ");
      alert(`Будь ласка, заповніть обов'язкові поля: ${missingFieldsNames}`);
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const updatedFormData = { ...formData, images: [...uploadedImages] };
      await addProductToCatalog(selectedBlockId, updatedFormData);
      setFormData(initialFormData);
      setUploadedImages([]);
      alert("Товар успішно створено!");
      clickOnFinish();
    } catch (error) {
      console.error("Помилка під час створення товару: ", error);
      alert("Не вдалося створити товар.");
    }
  };
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const updatedFormData = { ...formData, images: uploadedImages };
      await updateDataInCatalog(selectedBlockId, productId, updatedFormData);
      clickOnFinish();
    } catch (error) {
      console.error("Помилка під час оновлення товару: ", error);
      alert("Не вдалося оновити товар.");
    }
  };
  const handleFileDownload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("Файл не обрано");
      return;
    }

    try {
      const path = `goods/${Date.now()}_${file.name}`;
      const downloadURL = await uploadImageToStorage(file, path);
      console.log("Завантажено за адресою:", downloadURL);
      setUploadedImages((prev) => [...prev, downloadURL]);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  };
  const handleDeleteImage = async (index: number, imageUrl: string) => {
    try {
      const path = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0]);

      await deleteImageFromStorage(path);

      const updatedImages = formData.images.filter((img) => img !== imageUrl);
      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
      }));
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));

      if (productId) {
        await updateDataInCatalog(selectedBlockId, productId, {
          ...formData,
          images: updatedImages,
        });
      }

      console.log("Зображення успішно видалено локально та з Firebase.");
    } catch (error) {
      console.error("Помилка під час видалення зображення:", error);
      alert("Не вдалося видалити зображення. Спробуйте ще раз.");
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value); // Оновлюємо поточне введене значення

    if (value.length > 0) {
      // Фільтруємо продукти за введеним значенням
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) &&
          !recommended.includes(product.name) // Запобігаємо дублюванню
      );
      setFilteredProducts(filtered);
      setShowDropdown(true);
    } else {
      // Якщо поле порожнє — показуємо всі товари
      setFilteredProducts(products);
      setShowDropdown(true);
    }
  };

  const handleSelectProduct = (productName: string) => {
    if (!recommended.includes(productName)) {
      setRecommended([...recommended, productName]); // Додаємо вибраний товар у список
    }
    setSearchText(""); // Очищаємо введене значення
    setShowDropdown(false); // Закриваємо випадаючий список
  };

  // Початковий стан фільтрованого списку — всі товари
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const subCategoryOptions =
    formData.category === "Вітаміни та мінерали"
      ? [
          "Жіноче здоров'я",
          "Чоловіче здоров'я",
          "Дитяче здоров'я",
          "Імунітет",
          "Шкіра, нігті, волосся",
          "Кістки, суглоби, хрящі",
          "Зір",
          "Серцево-судинна система",
          "Енергія та бадьорість",
          "Розумова активність та концентрація",
          "Антиоксидантний захист",
          "Детоксикація та очищення",
        ]
      : formData.category === "Спортивне харчування"
      ? [
          "Набір м'ясової маси",
          "Відновлення після тренувань",
          "Збільшення витривалості",
          "Спалювання жиру",
          "Підтримка м'язів і суглобів",
          "Енергія та бадьорість",
        ]
      : formData.category === "Суперфуд"
      ? [
          "Детокс і очищення",
          "Імунітет",
          "Енергія та життєві сили",
          "Антиоксидантний захист",
          "Підтримка травлення",
          "Здоров'я шкіри та молодість",
        ]
      : [];

  return (
    <div>
      <div className="flex gap-4 mb-9 relative">
        <div
          className="absolute -top-4 -right-4 cursor-pointer border border-black rounded-full p-2 bg-black"
          onClick={() => clickOnFinish()}
        >
          <CloseIcon />
        </div>
        <div className="space-y-2 items-center max-w-[564px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Назва <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData?.name}
            onChange={handleChange}
            placeholder="Магній В6"
            className={`w-full p-2 border ${
              validationErrors.name ? "border-red" : "border-gray-300"
            } bg-white text-darkBlack`}
          />
        </div>
        <div className="space-y-2 items-center max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Ціна (грн): <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="price"
            value={formData?.price || ""}
            onChange={handleChange}
            placeholder="1400"
            className={`w-full p-2 border ${
              validationErrors.price ? "border-red" : "border-gray-300"
            } bg-white text-darkBlack`}
          />
        </div>
        <div className="space-y-2 items-center max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Знижка (акційний товар):
          </label>
          <input
            type="text"
            name="discount"
            value={formData?.discount || ""}
            onChange={handleChange}
            placeholder="20%"
            className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-9">
        <div className="space-y-2 max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Категорія
            <span className="text-red">*</span>
          </label>
          <select
            name="category"
            value={formData?.category}
            onChange={handleChange}
            className={`w-full p-2 border ${
              validationErrors.category ? "border-red" : "border-gray-300"
            }  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-darkBlack`}
          >
            <option value="">Оберіть категорію</option>
            <option value="Вітаміни та мінерали">Вітаміни та мінерали</option>
            <option value="Спортивне харчування">Спортивне харчування</option>
            <option value="Суперфуд">Суперфуд</option>
          </select>
        </div>
        <div className="space-y-2 max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Підкатегорія
            <span className="text-red">*</span>
          </label>
          <select
            name="subCategory"
            value={formData?.subCategory}
            onChange={handleChange}
            className={`w-full p-2 border ${
              validationErrors.subCategory ? "border-red" : "border-gray-300"
            }  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-darkBlack`}
          >
            <option value="">Оберіть категорію</option>
            {subCategoryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Статус:
            <span className="text-red">*</span>
          </label>
          <select
            name="status"
            value={formData?.status}
            onChange={handleChange}
            className={`w-full p-2 border ${
              validationErrors.status ? "border-red" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-darkBlack`}
          >
            <option value="">Оберіть статус</option>

            <option value="Новинка">Новинка</option>
            <option value="Популярний">Популярний</option>
            <option value="Розпродаж">Акція</option>
          </select>
        </div>

        <div className="space-y-2 items-center max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Наявнісь: <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="availability"
            value={formData?.availability}
            onChange={handleChange}
            placeholder="1000 шт"
            className={`w-full p-2 border ${
              validationErrors.availability ? "border-red" : "border-gray-300"
            } bg-white text-darkBlack`}
          />
        </div>
        {/* <div className="space-y-2 max-w-[274px] w-full ">
          <label className="text-[14px] font-medium text-darkBlack">
            Рекомендовані товари:
          </label>
          <div className="relative">
            <input
              type="text"
              name="recommended"
              value={formData?.recommended}
              onChange={handleChange}
              placeholder="Кальцій, Омега 3"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
            />
            <FaAngleDown className="fill-black absolute top-3 right-3" />
          </div>
        </div> */}

        <div className="space-y-2 max-w-[274px] w-full">
          <label className="text-[14px] font-medium text-darkBlack">
            Рекомендовані товари:
          </label>
          <div className="relative">
            <input
              type="text"
              name="recommended"
              value={searchText}
              onChange={handleSearch}
              placeholder="Кальцій, Омега 3"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
            />
            <FaAngleDown
              onClick={() => setShowDropdown(!showDropdown)}
              className="fill-black absolute top-3 right-3 cursor-pointer"
            />

            {/* Випадаючий список */}
            {showDropdown && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10 max-h-48 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleSelectProduct(product.name)}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <p className="text-black">{product.name}</p>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">Нічого не знайдено</li>
                )}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {recommended.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-black cursor-pointer"
                onClick={() =>
                  setRecommended(recommended.filter((r) => r !== item))
                }
              >
                {item} ✕
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2 items-center w-full mb-9">
        <label className="text-[14px] font-medium text-darkBlack">
          Склад: <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="composition"
          value={formData?.composition}
          onChange={handleChange}
          placeholder="Магній цитрат + Вітамін В6"
          className={`w-full p-2 border ${
            validationErrors.composition ? "border-red" : "border-gray-300"
          } bg-white text-darkBlack`}
        />
      </div>
      <div className="space-y-2 items-center mb-4">
        <label className="text-[14px] font-medium text-darkBlack">
          Опис <span className="text-red">*</span>
        </label>
        <textarea
          name="description"
          value={formData?.description}
          onChange={handleChange}
          placeholder="Магній В6 — ідеальне поєднання для підтримки нервової системи..."
          className={`w-full p-2 border ${
            validationErrors.description ? "border-red" : "border-gray-300"
          } bg-white h-[200px] text-darkBlack`}
        />
      </div>
      <div className="space-y-2 items-center w-full mb-9">
        <label className="text-[14px] font-medium text-darkBlack">
          Посилання на відео:
        </label>
        <input
          type="text"
          name="videoLink"
          value={formData?.videoLink}
          onChange={handleChange}
          placeholder="https://www.youtube.com"
          className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
        />
      </div>
      <div className="space-y-2 items-center w-full mb-9">
        <label className="text-[14px] font-medium text-darkBlack">
          Фото товару: <span className="text-red">*</span>
        </label>
        <div
          className={`flex gap-3 ${
            validationErrors.images ? "border-2 border-red p-2" : ""
          }`}
        >
          {uploadedImages ? (
            uploadedImages.map((img, index) => (
              <div
                key={index}
                className="relative border border-lightGrey p-4 max-w-[112px] h-[112px]"
              >
                <img src={img} alt="mag" />
                <TrashIcon
                  className="absolute bottom-1 right-1 cursor-pointer"
                  onClick={() => handleDeleteImage(index, img)}
                />
                <ContentInfoIcon className="absolute top-1 right-1 cursor-pointer" />
              </div>
            ))
          ) : (
            <></>
          )}
          <div className="max-w-[112px] w-full h-[112px] flex items-center justify-center border border-lightGrey">
            <button
              className="flex text-black cursor-pointer"
              onClick={() => document.getElementById("upload-photo")!.click()}
            >
              <UploadIcon />
              Додати
            </button>
            <input
              id="upload-photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileDownload}
            />
          </div>
        </div>
      </div>
      {productId ? (
        <button
          onClick={handleUpdate}
          className="border border-lightGrey px-4 py-3 text-darkBlack bg-white "
        >
          Змінити
        </button>
      ) : (
        <button
          onClick={handleCreate}
          className="border border-lightGrey px-4 py-3 text-darkBlack bg-white"
        >
          Додати
        </button>
      )}
      <button
        onClick={() => clickOnFinish()}
        className="border border-lightGrey px-4 py-3 text-darkBlack bg-white  ml-4"
      >
        Відмінити
      </button>
    </div>
  );
}
