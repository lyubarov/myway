import AddProductIcon from "../../assets/svg/AddProductIcon";
import EditCardIcon from "../../assets/svg/EditCardIcon";
import { useState, useRef, useEffect } from "react";
import { uploadImageToStorage } from "../firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../firebase/context/authContext";
import { updateProfile, getAuth } from "firebase/auth";
import { updatePasswordFunc } from "../firebase/auth";
import { updateUserFields } from "../firebase/db";
import { CreateModalWindow } from "../components/CreateModalWindow";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ProfileIcon from "../../assets/icons/icon.png";

export const ProfilePage = () => {
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const { currentUser, userFromBD } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({
    name: userFromBD?.displayName,
    role: userFromBD?.role,
    email: userFromBD?.email,
  });
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const [initialUser, setInitialUser] = useState({
    name: userFromBD?.displayName,
    role: userFromBD?.role,
    email: userFromBD?.email,
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    const isChanged =
      user.name !== initialUser.name ||
      user.role !== initialUser.role ||
      user.email !== initialUser.email ||
      newPassword !== "";

    setIsSaveDisabled(!isChanged);
  }, [user, newPassword, initialUser]);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "usersAdmin", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPhotoURL(userData.photoURL || currentUser.photoURL || null);
        }
      } catch (error) {
        console.error("Помилка при отриманні фото:", error);
      }
    };

    fetchUserPhoto();
  }, [currentUser]);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const auth = getAuth();
    if (!file || !auth.currentUser) return;

    try {
      const path = `users/profile/${Date.now()}_${file.name}`;
      const downloadURL = await uploadImageToStorage(file, path);

      // Оновлюємо фото в Auth
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });

      // Оновлюємо фото в стейті
      setPhotoURL(downloadURL);

      // Оновлюємо фото в Firestore
      const userRef = doc(db, "usersAdmin", auth.currentUser.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
      });
    } catch (error) {
      console.error("Помилка при завантаженні фото:", error);
    }
  };

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = async () => {
    // Оновлення змін користувача
    const updatedFields = {
      name: user.name,
      role: user.role,
      email: user.email,
      photoURL: photoURL,
    };

    await updateUserFields(currentUser, updatedFields);
    if (newPassword) {
      await updatePasswordFunc(newPassword);
    }
    console.log("Зміни збережено");
  };

  const handleAddUser = () => {
    console.log("Додати нового користувача");
    setCreateModal(!createModal);
  };

  const handleEditUsers = () => {
    console.log("Редагувати список користувачів");
    setEditModal(!editModal);
  };
  return (
    <div>
      <h1 className="text-4xl font-medium font-main text-blackText mb-6">
        Контент
      </h1>
      <p className="text-darkStroke mb-5">
        Головна / <span className="text-darkBlack">Профіль</span>
      </p>
      <div className="w-full flex flex-row gap-5">
        <div className="bg-white text-black max-w-[866px] w-full p-5 flex items-center justify-between">
          <div className="flex flex-col gap-5">
            <div className="w-[98px] h-[98px] border border-gray-300 rounded-full relative">
              <img
                src={photoURL || ProfileIcon}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div
                onClick={handleEditPhotoClick}
                className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
              >
                <EditCardIcon />
              </div>
            </div>
            <button
              onClick={handleSaveChanges}
              disabled={isSaveDisabled}
              className={`text-white text-[14px] py-3 w-[150px] transition-all duration-200 ${
                isSaveDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 active:bg-gray-900"
              }`}
            >
              Зберегти зміни
            </button>
          </div>
          <div className="ml-5 flex flex-col gap-5">
            <div className="flex flex-row gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 text-[14px]"
                >
                  Ім'я
                </label>
                <input
                  id="name"
                  type="text"
                  value={user.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Ім'я"
                  className="p-2 border border-gray-300 bg-white w-[317px]"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 text-[14px]"
                >
                  Роль
                </label>
                <input
                  id="role"
                  type="text"
                  value={user.role || ""}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  placeholder="Роль"
                  className="p-2 border border-gray-300 bg-white w-[317px]"
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex flex-row gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 text-[14px]"
                >
                  Пошта
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Пошта"
                  className="p-2 border border-gray-300 bg-white w-[317px]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 text-[14px]"
                >
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={newPassword || ""}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Пароль"
                    className="p-2 border border-gray-300 bg-white text-black w-[317px]"
                  />
                  <div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={handleTogglePasswordVisibility}
                  >
                    {!isPasswordVisible ? (
                      <FiEyeOff size={20} className="text-black" />
                    ) : (
                      <FiEye size={20} className="text-black" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {userFromBD?.role === "Адміністратор" && (
          <div className="flex-1 flex flex-col justify-between gap-5">
            <button
              onClick={handleAddUser}
              className="text-black text-[14px] w-full bg-white py-9 flex flex-row gap-2 items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <AddProductIcon />
              Додати нового користувача
            </button>
            <button
              onClick={handleEditUsers}
              className="text-black text-[14px] w-full bg-white py-9 flex flex-row gap-2 items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <EditCardIcon />
              Редагувати список користувачів
            </button>
          </div>
        )}
        {createModal && (
          <CreateModalWindow onClose={() => handleAddUser()} type="create" />
        )}
        {editModal && (
          <CreateModalWindow onClose={() => handleEditUsers()} type="edit" />
        )}
      </div>
    </div>
  );
};
