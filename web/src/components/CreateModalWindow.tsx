import { useEffect, useState } from "react";
import { CloseIcon } from "../../assets/svg/CloseIcon";
import { NextIcon } from "../../assets/svg/NextIcon";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { signUpWithRole } from "../firebase/auth";
import { getAllUsers, updateUserFields } from "../firebase/db";
import AddProductIcon from "../../assets/svg/AddProductIcon";

interface User {
  id: string;
  displayName: string;
  role: string;
  email: string;
}

interface CreateModalWindowProps {
  onClose: () => void;
  type: "create" | "edit";
}

export const CreateModalWindow = ({
  onClose,
  type,
}: CreateModalWindowProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(type);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [user, setUser] = useState({
    name: "",
    role: "",
    email: "",
  });
  const [editUserFields, setEditUserFields] = useState({
    name: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    if (editingUser) {
      setEditUserFields({
        name: editingUser.displayName,
        role: editingUser.role,
        email: editingUser.email,
      });
    }
  }, [editingUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsers(users as User[]);
    };
    fetchUsers();
  }, []);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const [newPassword, setNewPassword] = useState("");
  const renderComponent = () => {
    switch (selectedRole) {
      case "create":
        return (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Додати нового користувача
            </h2>
            <button
              onClick={() => setSelectedRole("Адміністратор")}
              className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              Адміністратор
              <NextIcon />
            </button>
            <button
              onClick={() => setSelectedRole("Бухгалтер")}
              className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              Бухгалтер
              <NextIcon />
            </button>
            <button
              onClick={() => setSelectedRole("Складський працівник")}
              className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              Складський працівник
              <NextIcon />
            </button>
            <button
              onClick={() => setSelectedRole("Контент-менеджер")}
              className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              Контент-менеджер
              <NextIcon />
            </button>
          </div>
        );
      case "edit":
        return (
          <div className="max-h-[364px] overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-300">
            <div className="flex flex-col gap-2 max-w-[416px]">
              <h2 className="text-xl font-semibold text-black">
                Редагувати список користувачів
              </h2>
              <div>
                <p className="text-black text-[14px] mb-2 mt-3">
                  Адміністратор:
                </p>
                {users.filter((user) => user.role === "Адміністратор").length >
                0 ? (
                  users
                    .filter((user) => user.role === "Адміністратор")
                    .map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setEditingUser(user);
                          setSelectedRole("changes");
                        }}
                        className="mb-2 text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        {user.displayName}
                        <NextIcon />
                      </button>
                    ))
                ) : (
                  <button
                    onClick={() => setSelectedRole("Адміністратор")}
                    className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    Додати
                    <AddProductIcon />
                  </button>
                )}
              </div>
              <div>
                <p className="text-black text-[14px] mb-2 mt-3">Бухгалтер:</p>
                {users.filter((user) => user.role === "Бухгалтер").length >
                0 ? (
                  users
                    .filter((user) => user.role === "Бухгалтер")
                    .map((user) => (
                      <button
                        key={user.id} // Ensure each button has a unique key if you're rendering a list
                        onClick={() => {
                          setEditingUser(user);
                          setSelectedRole("changes");
                        }}
                        className="mb-2 text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        {user.displayName}
                        <NextIcon />
                      </button>
                    ))
                ) : (
                  <button
                    onClick={() => {
                      setSelectedRole("Бухгалтер");
                    }}
                    className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    Додати
                    <AddProductIcon />
                  </button>
                )}
              </div>
              <div>
                <p className="text-black text-[14px] mb-2 mt-3">
                  Складський працівник:
                </p>
                {users.filter((user) => user.role === "Складський працівник")
                  .length > 0 ? (
                  users
                    .filter((user) => user.role === "Складський працівник")
                    .map((user) => (
                      <button
                        key={user.id} // Ensure each button has a unique key if you're rendering a list
                        onClick={() => {
                          setEditingUser(user);
                          setSelectedRole("changes");
                        }}
                        className="mb-2 text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        {user.displayName}
                        <NextIcon />
                      </button>
                    ))
                ) : (
                  <button
                    onClick={() => setSelectedRole("Складський працівник")}
                    className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    Додати
                    <AddProductIcon />
                  </button>
                )}
              </div>
              <div>
                <p className="text-black text-[14px] mb-2 mt-3">
                  Контент-менеджер:
                </p>
                {users.filter((user) => user.role === "Контент-менеджер")
                  .length > 0 ? (
                  users
                    .filter((user) => user.role === "Контент-менеджер")
                    .map((user) => (
                      <button
                        key={user.id} // Ensure each button has a unique key if you're rendering a list
                        onClick={() => setSelectedRole("changes")}
                        className="mb-2 text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        {user.displayName}
                        <NextIcon />
                      </button>
                    ))
                ) : (
                  <button
                    onClick={() => setSelectedRole("Контент-менеджер")}
                    className="text-black text-[14px] w-full bg-lightGrey py-4 px-3 flex flex-row gap-2 items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    Додати
                    <AddProductIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case "Адміністратор":
        return createUserForm();
      case "Бухгалтер":
        return createUserForm();
      case "Складський працівник":
        return createUserForm();
      case "Контент-менеджер":
        return createUserForm();
      case "changes":
        return editUserForm();
    }
  };
  const handleSaveChanges = async () => {
    // Оновлення змін користувача
    const updatedFields = {
      name: editUserFields.name,
      role: editUserFields.role,
      email: editUserFields.email,
    };
    console.log(editingUser);

    await updateUserFields(editingUser, updatedFields);
    // if (newPassword) {
    //   await changeUserPassword(editUserForm.uid, newPassword);
    // }
    console.log("Зміни збережено");
  };
  const createUserForm = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 text-black">
          Додати нового користувача
        </h2>
        <p className="text-black text-[14px] mb-6 mt-8">Введіть дані</p>
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-row gap-3">
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
                className="p-2 border border-gray-300 bg-LightBack text-black  w-[214px]"
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
                value={selectedRole}
                placeholder="Роль"
                className="p-2 border border-gray-300 bg-LightBack text-black w-[214px]"
                disabled
              />
            </div>
          </div>
          <div className="flex flex-row gap-3">
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
                className="p-2 border border-gray-300 bg-LightBack text-black  w-[214px]"
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Пароль"
                  className="p-2 border border-gray-300 bg-LightBack text-black w-[214px]"
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
        <button
          onClick={handleAddUser}
          className="bg-black text-white px-4 py-4 w-full"
        >
          Додати користувача
        </button>
      </div>
    );
  };

  const isFormChanged = () => {
    if (!editingUser) return false;
    return (
      editUserFields.name !== editingUser.displayName ||
      editUserFields.email !== editingUser.email ||
      newPassword !== ""
    );
  };

  const editUserForm = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-black">
          Редагувати користувача
        </h2>
        <p className="text-black text-[16px] mb-6 mt-6">
          Роль користувача: {editingUser?.role}
        </p>
        <div className="flex flex-col gap-3 mb-8">
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
              value={editUserFields.name || ""}
              onChange={(e) =>
                setEditUserFields({ ...editUserFields, name: e.target.value })
              }
              placeholder="Ім'я"
              className="p-2 border border-gray-300 bg-LightBack text-black  w-[100%]"
            />
          </div>

          <div className="flex flex-col gap-3">
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
                value={editUserFields.email || ""}
                onChange={(e) =>
                  setEditUserFields({
                    ...editUserFields,
                    email: e.target.value,
                  })
                }
                placeholder="Пошта"
                className="p-2 border border-gray-300 bg-LightBack text-black  w-[100%]"
              />
            </div>
            {/* <div className="space-y-2">
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Пароль"
                  className="p-2 border border-gray-300 bg-LightBack text-black w-[100%]"
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
            </div> */}
          </div>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={!isFormChanged()}
          className={`w-full px-4 py-4 ${
            isFormChanged()
              ? "bg-black text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Зберегти зміни
        </button>
      </div>
    );
  };

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      role: selectedRole,
    }));
  }, [selectedRole]);

  const handleAddUser = async () => {
    if (!user.email || !user.name || !user.role) {
      console.log("Помилка: не всі поля заповнені");
      return;
    }
    await signUpWithRole(user.email, newPassword, user.name, user.role);

    console.log("Користувач створений");

    setSelectedRole("create");
    setUser({
      name: "",
      role: "",
      email: "",
    });
    setNewPassword("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 ">
      <div className="bg-white p-5 w-[480px] relative max-h-[453px]">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-black rounded-full"
        >
          <CloseIcon />
        </button>

        {renderComponent()}
      </div>
    </div>
  );
};
