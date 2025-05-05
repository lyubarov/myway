import { useEffect, useState } from "react";
import AddProductIcon from "../../assets/svg/AddProductIcon";
import TrashIcon from "../../assets/svg/TrashIcon";
import { AddNotification } from "./AddNotification";
import EditCardIcon from "../../assets/svg/EditCardIcon";
import {
  deleteNotification,
  getAllNotifications,
  NotificationData,
} from "../firebase/db";
import { ChangeNotification } from "./ChangeNotification";
export const PopupNotificationBlockTwo = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getAllNotifications();
      setNotifications(data);
    };

    fetchNotifications();
  }, [refresh]);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [changeIsOpen, setChangeIsOpen] = useState(null);

  const handleChangeIsAdd = () => {
    setAddIsOpen(!addIsOpen);
  };
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteNotification(id);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("❌ Помилка при видаленні:", error);
    }
  };

  return (
    <div className="p-6 bg-white  max-w-[381px] w-full h-full">
      <h2 className="text-[14px] font-medium text-darkBlack mb-5">
        Поп-ап повідомлення
      </h2>

      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-darkBlack">
          Сповіщення
        </label>
        <div className="border border-lightGrey ">
          <div
            onClick={handleChangeIsAdd}
            className="w-full text-darkStroke flex items-center justify-between cursor-pointer p-4 border-b border-lightGrey"
          >
            <span className="text-[14px] font-normal text-darkStroke">
              Додати сповіщення
            </span>
            <button className="text-darkStroke">
              <AddProductIcon />
            </button>
          </div>
          {addIsOpen && (
            <AddNotification
              handleAddProduct={() => {
                handleChangeIsAdd();
                setRefresh((prev) => !prev);
              }}
              typeNotification="popup"
            />
          )}

          <div className="divide-y divide-lightGrey">
            {notifications.filter(
              (notification) => notification.type === "popup"
            ).length > 0 ? (
              notifications
                .filter((notification) => notification.type === "popup")
                .map((product) => (
                  <div key={product.id}>
                    <div className="flex justify-between items-center px-4 py-[14px]">
                      <span className="text-[14px] font-normal text-darkStroke">
                        {product.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            product.id && handleDeleteProduct(product.id)
                          }
                          className="p-2 text-lightRed hover:text-red-600"
                        >
                          <TrashIcon />
                        </button>
                        <button
                          onClick={() => {
                            if (changeIsOpen) {
                              setChangeIsOpen(null);
                            } else setChangeIsOpen(product);
                          }}
                          className="p-2 text-darkStroke"
                        >
                          <EditCardIcon />
                        </button>
                      </div>
                    </div>
                    {changeIsOpen?.id == product.id && (
                      <ChangeNotification
                        notification={changeIsOpen}
                        handleChangeProduct={() => {
                          setChangeIsOpen(null);
                          setRefresh((prev) => !prev);
                        }}
                        typeNotification="push"
                      />
                    )}
                  </div>
                ))
            ) : (
              <p className="text-black py-4 text-center">
                Сповіщення відсутні.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
