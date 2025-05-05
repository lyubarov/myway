import React, { SetStateAction, useEffect, useState } from "react";
import AddProductIcon from "../../assets/svg/AddProductIcon";
import { ContentBlockOne } from "../components/ContentBlockOne";
import { ContentBlockTwo } from "../components/ContentBlockTwo";
import {
  createBlock,
  getBlocksFromCatalog,
  updateBlockOrder,
} from "../firebase/db";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ContentPageProps {
  setAddNewProduct: React.Dispatch<SetStateAction<boolean>>;
  onBlockSelect: React.Dispatch<SetStateAction<string | null>>;
}

interface Block {
  id: string;
  title: string;
  category: string;
  order?: number;
}

const DraggableBlock: React.FC<{
  block: Block;
  index: number;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  setAddNewProduct: React.Dispatch<SetStateAction<boolean>>;
  onBlockSelect: React.Dispatch<SetStateAction<string | null>>;
  onBlockDelete: (id: string) => void;
}> = ({
  block,
  index,
  moveBlock,
  setAddNewProduct,
  onBlockSelect,
  onBlockDelete,
}) => {
  const [, dragRef] = useDrag({
    type: "BLOCK",
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: "BLOCK",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  });

  const combinedRef = (node: HTMLElement | null) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <div>
      <div className="flex items-center">
        <span className="mr-3 text-lg">{block.order}</span>{" "}
        {block.category !== "Банери" ? (
          <ContentBlockOne
            block={block}
            setAddNewProduct={setAddNewProduct}
            onBlockSelect={onBlockSelect}
            index={index}
            ref={combinedRef}
            onBlockDelete={onBlockDelete}
          />
        ) : (
          <ContentBlockTwo
            block={block}
            ref={combinedRef}
            index={index}
            onBlockSelect={onBlockSelect}
            onBlockDelete={onBlockDelete}
          />
        )}
      </div>
    </div>
  );
};

export const ContentPage: React.FC<ContentPageProps> = ({
  setAddNewProduct,
  onBlockSelect,
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data: Partial<Block>[] | undefined = await getBlocksFromCatalog();
        const transformedData: Block[] = (data ?? [])
          .map((block) => ({
            id: block.id || "",
            title: block.title || "",
            category: block.category || "",
            order: block.order || 0,
          }))
          .sort((a, b) => a.order! - b.order!);

        setBlocks(transformedData);
      } catch (error) {
        console.error("Помилка при отриманні продукту:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleCreateBlock = async () => {
    try {
      await createBlock();

      const updatedBlocks = await getBlocksFromCatalog();
      const transformedBlocks: Block[] = updatedBlocks.map((block, index) => ({
        id: block.id,
        title: "",
        category: "Товари",
        order: index + 1,
      }));

      setBlocks(transformedBlocks);
    } catch (error) {
      console.error("Помилка під час створення блоку:", error);
    }
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);

    updatedBlocks.forEach((block, index) => {
      block.order = index + 1;
    });

    updateBlockOrder(updatedBlocks);

    setBlocks(updatedBlocks);
  };

  const handleBlockDelete = (id: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text-darkBlack text-[40px] font-normal mb-3">Контент</h1>
      <p className="text-darkStroke mb-5">
        Контент / <span className="text-darkBlack">Головна</span>
      </p>
      <div className="grid grid-cols-3 gap-5">
        {loading ? (
          <div>Loading</div>
        ) : (
          blocks.map((block, index) => (
            <DraggableBlock
              key={block.id}
              block={block}
              index={index}
              moveBlock={moveBlock}
              setAddNewProduct={setAddNewProduct}
              onBlockSelect={onBlockSelect}
              onBlockDelete={handleBlockDelete}
            />
          ))
        )}
        {/* <div className="max-w-[381px] w-full h-[112px] flex items-center justify-center bg-white">
          <button
            className="flex text-black cursor-pointer"
            onClick={handleCreateBlock}
          >
            <AddProductIcon />
            Додати блок
          </button>
        </div> */}
      </div>
    </DndProvider>
  );
};
