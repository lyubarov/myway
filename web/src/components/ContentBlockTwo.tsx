import {
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import AddProductIcon from "../../assets/svg/AddProductIcon";
import ContentInfoIcon from "../../assets/svg/ContentInfoIcon";
import TrashIcon from "../../assets/svg/TrashIcon";
import UploadIcon from "../../assets/svg/UploadIcon";
import {
  addBannerToBlock,
  deleteBannerFromBlock,
  deleteBlock,
  getBannersFromBlock,
  updateBlockFields,
} from "../firebase/db";
import {
  addBannerToStorage,
  deleteBannerFromStorage,
} from "../firebase/storage";

interface Block {
  id: string;
  title: string;
  category: string;
}
interface UpdatedFields {
  title?: string;
  category?: string;
  banners?: (string | null)[];
}
interface Banners {
  description: string;
  id?: string;
  images: string;
  title: string;
}
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
interface ContentBlockTwoProps {
  block: Block;
  onBlockSelect: React.Dispatch<SetStateAction<string | null>>;
  onBlockDelete: (id: string) => void;
  index: number;
}
interface Banner {
  title: string;
  description: string;
  images: string;
}

export const ContentBlockTwo = forwardRef<HTMLDivElement, ContentBlockTwoProps>(
  ({ block, onBlockSelect, onBlockDelete, index }, ref) => {
    const [blockState, setBlock] = useState<Block>({
      id: block.id,
      title: block.title,
      category: block.category,
    });

    const [banners, setBanners] = useState<Banners[]>([]);
    const [newBanner, setNewBanner] = useState<Banner>({
      title: "",
      description: "",
      images: "",
    });
    const [addNew, setAddNew] = useState(false);

    useEffect(() => {
      const fetchBlockData = async () => {
        try {
          const data = await getBannersFromBlock(block.id);

          setBanners(data as Banners[]);
        } catch (error) {
          console.error("Помилка при отриманні даних блоку:", error);
        }
      };

      fetchBlockData();
    }, [block.id]);

    const debouncedUpdateBlock = useCallback(
      debounce(async (updatedFields: UpdatedFields) => {
        try {
          await updateBlockFields(block.id, updatedFields);
          console.log("Блок оновлено:", updatedFields);
        } catch (error) {
          console.error("Помилка під час оновлення блоку:", error);
        }
      }, 3000),
      [block.id]
    );

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setBlock((prev) => ({
        ...prev,
        [name]: value,
      }));

      debouncedUpdateBlock({ [name]: value });
    };

    const handleUploadBanner = async (file: File, bannerIndex: number) => {
      try {
        // Показуємо зображення перед завантаженням
        const objectURL = URL.createObjectURL(file); // тимчасове URL для зображення
        setNewBanner((prev) => ({
          ...prev,
          images: objectURL, // встановлюємо тимчасове зображення
        }));

        // Завантаження в Firebase
        const downloadURL = await addBannerToStorage(file);
        setNewBanner((prev) => ({
          ...prev,
          images: downloadURL, // оновлюємо на реальний URL після завантаження
        }));
      } catch (error) {
        console.error(
          `Помилка при завантаженні банера ${bannerIndex + 1}:`,
          error
        );
        alert("Не вдалося завантажити зображення.");
      }
    };

    const handleFileChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      bannerIndex: number
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUploadBanner(file, bannerIndex);
      }
    };

    const handleAddBanner = () => {
      setBanners((prev) => [
        ...prev,
        { title: "", description: "", images: "" },
      ]);
      setAddNew(true);
    };

    const handleDeleteBanner = async (banner: Banners, index: number) => {
      const bannerUrl = banner.images;

      if (bannerUrl) {
        try {
          // Видалення банера з Firebase Storage
          await deleteBannerFromStorage(bannerUrl);

          // Оновлення списку банерів в компоненті
          setBanners((prev) => prev.filter((_, i) => i !== index));

          if (!banner.id) {
            console.error("Помилка: у банера відсутній id");
            return;
          }
          await deleteBannerFromBlock(block.id, banner.id);

          // Оновлення полів блоку без цього банера
          const updatedBanners = banners.filter((_, i) => i !== index);
          const updatedFields: UpdatedFields = {
            banners: updatedBanners.map((banner) => banner.id ?? null),
          };

          // Оновлення блоку в Firebase з новими банерами
          await updateBlockFields(block.id, updatedFields);

          console.log(`Банер ${banner.id} успішно видалено!`);
        } catch (error) {
          console.error("Помилка під час видалення банера:", error);
          alert("Не вдалося видалити банер. Спробуйте ще раз.");
        }
      }
    };

    const handleAddNewBanner = async () => {
      if (newBanner.title && newBanner.description && newBanner.images) {
        await addBannerToBlock(block.id, newBanner);
        setBanners((prev) => [...prev, newBanner]);
        setNewBanner({ title: "", description: "", images: "" });
        setAddNew(false);
      } else {
        alert("Заповніть всі поля перед збереженням.");
      }
    };
    const handleDeleteBlock = async () => {
      const isConfirmed = window.confirm(
        "Ви впевнені, що хочете видалити цей блок? Це дію неможливо скасувати."
      );

      if (isConfirmed) {
        await deleteBlock(block.id);
        onBlockDelete(block.id);
      }
    };

    return (
      <div ref={ref} className="p-6 bg-white max-w-[381px] w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[14px] font-medium text-darkBlack">
            Блок {index + 1}
          </h2>
          <div className="flex items-center justify-center">
            <button
              className="p-2 text-darkStroke cursor-move"
              onClick={() => onBlockSelect(block.id)}
            >
              <ContentInfoIcon />
            </button>
            {/* <button onClick={handleDeleteBlock}>
              <TrashIcon />
            </button> */}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 items-center">
            <label className="text-[14px] font-medium text-darkBlack">
              Заголовок блоку <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={blockState.title}
              onChange={handleChange}
              placeholder="Новинки"
              className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-darkBlack">
              Тип блоку
              <span className="text-red ml-1">*</span>
            </label>
            <select
              name="category"
              value={blockState.category}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white text-darkBlack appearance-none"
            >
              <option value="Товари">Товари</option>
              <option value="Банери">Банери</option>
              <option value="Акції">Акції</option>
            </select>
          </div>

          {banners.map((banner, index) => (
            <div key={banner.id}>
              <label className="text-[14px] font-medium text-darkBlack flex justify-between items-center">
                <p className="pb-[10px]">{`Банер ${index + 1}`}</p>
                <ContentInfoIcon />
              </label>
              {banner.images !== "" && (
                <div className="flex gap-3">
                  <div className="relative max-w-[200px] w-full">
                    <img
                      src={banner.images}
                      alt={`banner-${index + 1}`}
                      className="w-full"
                    />
                    <TrashIcon
                      className="absolute bottom-1 right-1 cursor-pointer"
                      onClick={() => handleDeleteBanner(banner, index)}
                    />
                  </div>

                  <div className="cursor-pointer max-w-[129px] w-full border border-lightGrey text-black text-[14px] flex justify-center items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <UploadIcon />
                      Замінити
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </label>
                  </div>
                </div>
              )}
              {addNew && (
                <div className="w-full mt-4">
                  <label className="text-[14px] font-medium text-darkBlack flex justify-between items-center">
                    <p className="pb-[10px]">{`Банер ${index + 2}`}</p>
                  </label>
                  <div className="cursor-pointer w-full h-[112px] border border-lightGrey text-black text-[14px] flex justify-center items-center gap-2">
                    {newBanner.images ? (
                      <div className="flex gap-3">
                        <div className="relative max-w-[200px] w-full">
                          <img
                            src={banner.images}
                            alt={`banner-${index + 1}`}
                            className="w-full"
                          />
                          <TrashIcon
                            className="absolute bottom-1 right-1 cursor-pointer"
                            onClick={() => handleDeleteBanner(banner, index)}
                          />
                        </div>

                        <div className="cursor-pointer max-w-[129px] w-full border border-lightGrey text-black text-[14px] flex justify-center items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <UploadIcon />
                            Замінити
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, index)}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <UploadIcon />
                        Завантажити
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                      </label>
                    )}
                  </div>
                  <div className="space-y-2 items-center max-w-[564px] w-full">
                    <label className="text-[14px] font-medium text-darkBlack">
                      Назва <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newBanner.title}
                      onChange={(e) =>
                        setNewBanner((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Магній В6"
                      className="w-full p-2 border border-gray-300 bg-white text-darkBlack"
                    />
                  </div>
                  <div className="space-y-2 items-center mb-4">
                    <label className="text-[14px] font-medium text-darkBlack">
                      Опис <span className="text-red">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={newBanner.description}
                      onChange={(e) =>
                        setNewBanner((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Магній В6 — ідеальне поєднання для підтримки нервової системи..."
                      className="w-full p-2 border border-gray-300 bg-white h-[200px] text-darkBlack"
                    />
                  </div>
                  <button
                    onClick={handleAddNewBanner}
                    className="text-black border rounded-full py-2 w-full"
                  >
                    Створити
                  </button>
                </div>
              )}
            </div>
          ))}

          <div
            onClick={handleAddBanner}
            className="w-full text-darkStroke flex items-center justify-center cursor-pointer p-4 border border-lightGrey  m-0"
          >
            <span className="text-[14px] font-normal text-darkStroke">
              Додати банер
            </span>
            <button className="text-darkStroke">
              <AddProductIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
