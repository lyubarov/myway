import { useEffect, useState } from "react";
import {
  createTip,
  deleteTip,
  getAllTips,
  Tip,
  updateTip,
} from "../firebase/db";
import TrashIcon from "../../assets/svg/TrashIcon";
import EditIcon from "../../assets/svg/EditIcon";
import AddProductIcon from "../../assets/svg/AddProductIcon";
import { TipModal } from "../components/TipModal";

const ResourcesPage = () => {
  const [loading, setLoading] = useState(true);
  const [tips, setTips] = useState<Tip[]>([]);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTip = async (
    title: string,
    imageUrl: string,
    description: string
  ) => {
    try {
      const newTip = await createTip(title, imageUrl, description);
      if (newTip && newTip.id) {
        setTips((prev) => [...prev, newTip]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTip = async (id: string) => {
    await deleteTip(id);
    setTips((prev) => prev.filter((tip) => tip.id !== id));
  };

  const handleEditTip = async (
    id: string,
    title: string,
    imageUrl: string,
    description: string
  ) => {
    try {
      await updateTip(id, title, imageUrl, description);

      setTips((prev) =>
        prev.map((tip) =>
          tip.id === id ? { ...tip, title, imageUrl, description } : tip
        )
      );

      setEditingTip(null);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const tips = await getAllTips();
        setTips(tips);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);
  return (
    <>
      <h1 className="text-darkBlack text-[40px] font-normal mb-3">Ресурси</h1>
      <p className="text-darkStroke mb-5">
        Контент / <span className="text-darkBlack">Ресурси</span>
      </p>
      <div className="p-6 bg-white w-full">
        <h2 className="text-[14px] font-medium text-darkBlack mb-5">
          Корисні поради
        </h2>
        <div className="space-y-2">
          <div className="border border-lightGrey">
            <div
              onClick={() => {
                setEditingTip(null);
                setIsModalOpen(true);
              }}
              className="w-full text-darkStroke flex items-center justify-between cursor-pointer p-4 border-b border-lightGrey"
            >
              <span className="text-[14px] font-normal text-darkStroke">
                Додати пораду
              </span>
              <button className="text-darkStroke">
                <AddProductIcon />
              </button>
            </div>
            {!loading &&
              tips.map((item) => (
                <div className="divide-y divide-lightGrey">
                  <div
                    key={item.id}
                    className="flex justify-between items-center px-4 py-[14px]"
                  >
                    <span className="text-[14px] font-normal text-darkStroke">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteTip(item.id)}
                        className="text-lightRed hover:text-red-600"
                      >
                        <TrashIcon />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTip(item);
                          setIsModalOpen(true);
                        }}
                        className=" text-darkStroke"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <TipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTip}
          onChange={handleEditTip}
          tip={editingTip}
        ></TipModal>
      </div>
    </>
  );
};

export default ResourcesPage;
