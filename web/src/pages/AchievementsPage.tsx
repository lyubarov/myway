import { useEffect, useState } from "react";
import AddProductIcon from "../../assets/svg/AddProductIcon";
import EditIcon from "../../assets/svg/EditIcon";
import TrashIcon from "../../assets/svg/TrashIcon";
import {
  createAchievement,
  deleteAchievementById,
  getAchievements,
  updateAchievement,
} from "../firebase/db";
import { AchievementModal } from "../components/AchievementModal";

interface Achievements {
  id: string;
  name: string;
  waylMoney: number;
  img: string;
  description: string;
}
export const AchievementsPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [achievements, setAchievements] = useState<Achievements[]>([]);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievements | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await getAchievements()) || [];
      setAchievements(data as Achievements[]);
      console.log("dsfsfdsfs", data);
    };
    fetchData();
  }, []);

  const handleAddAchievement = async (
    name: string,
    imageUrl: string,
    waylMoney: number,
    description: string
  ) => {
    try {
      const newAchievement = await createAchievement(
        name,
        waylMoney,
        imageUrl,
        description
      );
      if (newAchievement && newAchievement.id) {
        setAchievements((prev) => [...prev, newAchievement]);
      }
      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteAchievementById(id);
    setAchievements((prev) =>
      prev.filter((achievement) => achievement.id !== id)
    );
  };

  const handleUpdateAchievement = async (
    id: string,
    name: string,
    imageUrl: string,
    value: number,
    description: string
  ) => {
    try {
      await updateAchievement(id, name, imageUrl, value, description);

      setAchievements((prev) =>
        prev.map((achievement) =>
          achievement.id === id
            ? { ...achievement, name, value, description }
            : achievement
        )
      );

      setEditingAchievement(null);
      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1 className="text-darkBlack text-[40px] font-normal mb-3">Контент</h1>
      <p className="text-darkStroke mb-5">
        Контент / <span className="text-darkBlack">Досягнення</span>
      </p>
      <div className="p-6 bg-white w-full">
        <h2 className="text-[14px] font-medium text-darkBlack mb-5">
          Список досягнень
        </h2>

        <div className="space-y-2">
          <div className="border border-lightGrey">
            <div
              onClick={() => {
                setEditingAchievement(null);
                setIsOpenModal(true);
              }}
              className="w-full text-darkStroke flex items-center justify-between cursor-pointer p-4 border-b border-lightGrey"
            >
              <span className="text-[14px] font-normal text-darkStroke">
                Додати досягнення
              </span>
              <button className="text-darkStroke">
                <AddProductIcon />
              </button>
            </div>

            <div className="divide-y divide-lightGrey">
              {achievements.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center px-4 py-[14px]"
                >
                  <span className="text-[14px] font-normal text-darkStroke">
                    {product.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-lightRed hover:text-red-600"
                    >
                      <TrashIcon />
                    </button>
                    <button
                      onClick={() => {
                        setEditingAchievement(product);
                        setIsOpenModal(true);
                      }}
                      className=" text-darkStroke"
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AchievementModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          onSave={handleAddAchievement}
          onChange={handleUpdateAchievement}
          achievement={editingAchievement}
        />
      </div>
    </>
  );
};
