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
import {
  deleteBlock,
  deleteProductFromBlock,
  getProductsFromBlock,
  updateBlockFields,
  // updateProductsOrder,
} from "../firebase/db";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  status: string;
  availability: string;
  recommended: string;
  composition: string;
  description: string;
  videoLink: string;
  images: string[];
}

interface Block {
  id: string;
  title: string;
  category: string;
}
interface UpdatedFields {
  title?: string;
  category?: string;
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
interface ContentBlockOneProps {
  block: Block;
  setAddNewProduct: React.Dispatch<SetStateAction<boolean>>;
  onBlockSelect: React.Dispatch<SetStateAction<string | null>>;
  onBlockDelete: (id: string) => void;
  index: number;
}

const DraggableProduct: React.FC<{
  product: Product;
  index: number;
  moveProduct: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
}> = ({ product, index, moveProduct, onDelete }) => {
  const [, dragRef] = useDrag({
    type: "PRODUCT",
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: "PRODUCT",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveProduct(item.index, index);
        item.index = index;
      }
    },
  });

  const combinedRef = (node: HTMLElement | null) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <div
      ref={combinedRef}
      className="flex justify-between items-center px-4 py-[14px]"
    >
      <span className="text-[14px] font-normal text-darkBlack">
        {product.name}
      </span>
      <div className="flex items-center gap-2">
        <button
          className="p-2 text-lightRed hover:text-red-600"
          onClick={() => onDelete(product.id)}
        >
          <TrashIcon />
        </button>
        <button className="p-2 text-darkStroke cursor-move">
          <ContentInfoIcon />
        </button>
      </div>
    </div>
  );
};

export const ContentBlockOne = forwardRef<HTMLDivElement, ContentBlockOneProps>(
  ({ block, setAddNewProduct, onBlockSelect, onBlockDelete, index }, ref) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [blockState, setBlock] = useState<Block>({
      id: block.id,
      title: block.title,
      category: block.category,
    });

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const data: Product[] | undefined = await getProductsFromBlock(
            block.id
          );
          setProducts(data ?? []);
        } catch (error) {
          console.error("Помилка при отриманні продуктів:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [block.id]);

    const handleDeleteProduct = async (id: string) => {
      try {
        await deleteProductFromBlock(block.id, id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      } catch (error) {
        console.error("Помилка під час видалення продукту:", error);
      }
    };

    const moveProduct = useCallback(
      async (fromIndex: number, toIndex: number) => {
        const updatedProducts = [...products];
        const [movedProduct] = updatedProducts.splice(fromIndex, 1);
        updatedProducts.splice(toIndex, 0, movedProduct);
        setProducts(updatedProducts);

        // try {
        //   await updateProductsOrder(
        //     block.id,
        //     updatedProducts.map((p) => p.id)
        //   );
        // } catch (error) {
        //   console.error("Помилка при оновленні порядку продуктів:", error);
        // }
      },
      [products]
    );

    const debouncedUpdateBlock = useCallback(
      debounce(async (updatedFields: UpdatedFields) => {
        try {
          await updateBlockFields(block.id, updatedFields);
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
      <div ref={ref} className="p-6 bg-white  max-w-[381px] w-full h-full">
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

          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-darkBlack">
              Товари
              <span className="text-red ml-1">*</span>
            </label>
            <div className="border border-lightGrey ">
              <div
                onClick={() => {
                  setAddNewProduct(true);
                  onBlockSelect(block.id);
                }}
                className="w-full text-darkStroke flex items-center justify-between cursor-pointer p-4 border-b border-lightGrey"
              >
                <span className="text-[14px] font-normal text-darkStroke">
                  Додати товар
                </span>
                <button
                  className="text-darkStroke"
                  onClick={() => setAddNewProduct(true)}
                >
                  <AddProductIcon />
                </button>
              </div>

              <DndProvider backend={HTML5Backend}>
                <div className="divide-y divide-lightGrey">
                  {loading ? (
                    <div>Loading</div>
                  ) : products ? (
                    products.map((product, index) => (
                      <DraggableProduct
                        key={product.id}
                        product={product}
                        index={index}
                        moveProduct={moveProduct}
                        onDelete={handleDeleteProduct}
                      />
                    ))
                  ) : (
                    <div>Товари відсутні.</div>
                  )}
                </div>
              </DndProvider>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
