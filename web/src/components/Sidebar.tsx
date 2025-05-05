import { useEffect, useState } from "react";
import { OrdersListPage } from "../pages/OrdersListPage";
import OrdersIcon from "../../assets/svg/OrdersIcon";
import ClientsIcon from "../../assets/svg/ClientsIcon";
import CatalogIcon from "../../assets/svg/CatalogIcon";
import ContentIcon from "../../assets/svg/ContentIcon";
import { ClientsListPage } from "../pages/ClientsListPage";
import { CatalogPage } from "../pages/CatalogPage";
import ArrowDown from "../../assets/svg/ArrowDown";
import { ContentPage } from "../pages/ContentPage";
import NotificationsPage from "../pages/NotificationsPage";
import { AchievementsPage } from "../pages/AchievementsPage";
import EditCardPage from "../pages/EditCardPage";
import { useAuth } from "../firebase/context/authContext";
import { signOut } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import ResourcesPage from "../pages/ResourcesPage";
import ReportIcon from "../../assets/svg/ReportIcon";
import { ReportsPage } from "../pages/ReportsPage";
import { ProfilePage } from "../pages/ProfilePage";
import Logo from "../../assets/icons/Logo.png";
import ProfileIcon from "../../assets/icons/icon.png";
import { ClubOfLeaders } from "../pages/ClubOfLeaders";

export const Sidebar = () => {
  const { userLoggedIn, currentUser, userFromBD } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoggedIn && userLoggedIn !== null) {
      navigate("/login");
    }
  }, [userLoggedIn, navigate]);

  const [activePage, setActivePage] = useState("orders");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [activeContentSubpage, setActiveContentSubpage] = useState("main");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    "08937692-af9b-455e-97f2-7cbe039c6215"
  );
  const [addNewProduct, setAddNewProduct] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMenuItemClick = (itemId: string, hasSubItems: boolean) => {
    setActivePage(itemId);
    if (hasSubItems) {
      setIsContentExpanded(!isContentExpanded);
    } else {
      setIsContentExpanded(false);
    }
  };

  const menuItems =
    userFromBD?.role === "Адміністратор"
      ? [
          { id: "orders", label: "Замовлення", icon: <OrdersIcon /> },
          { id: "clients", label: "Клієнти", icon: <ClientsIcon /> },
          { id: "catalog", label: "Каталог", icon: <CatalogIcon /> },
          { id: "reports", label: "Звіти", icon: <ReportIcon /> },
          {
            id: "content",
            label: "Контент",
            icon: <ContentIcon />,
            hasSubItems: true,
          },
        ]
      : userFromBD?.role === "Бухгалтер"
      ? [
          { id: "orders", label: "Замовлення", icon: <OrdersIcon /> },
          { id: "reports", label: "Звіти", icon: <ReportIcon /> },
        ]
      : userFromBD?.role === "Складський працівник"
      ? [
          { id: "orders", label: "Замовлення", icon: <OrdersIcon /> },
          { id: "catalog", label: "Каталог", icon: <CatalogIcon /> },
        ]
      : userFromBD?.role === "Контент-менеджер"
      ? [
          { id: "catalog", label: "Каталог", icon: <CatalogIcon /> },
          {
            id: "content",
            label: "Контент",
            icon: <ContentIcon />,
            hasSubItems: true,
          },
        ]
      : [];

  const contentSubItems = [
    { id: "main", label: "Головна" },
    { id: "notifications", label: "Сповіщення" },
    { id: "achievements", label: "Досягнення" },
    { id: "clubOfLeaders", label: "Клуб лідерів" },
    { id: "resources", label: "Ресурси" },
  ];
  useEffect(() => {
    setAddNewProduct(false);
    setActiveContentSubpage("main");
  }, [activePage]);

  const renderContent = () => {
    if (activePage === "content") {
      switch (activeContentSubpage) {
        case "main":
          return addNewProduct ? (
            <EditCardPage
              productId={null}
              selectedBlockId={selectedBlockId}
              clickOnFinish={() => {
                setActivePage("catalog");
              }}
            />
          ) : (
            <ContentPage
              setAddNewProduct={setAddNewProduct}
              onBlockSelect={setSelectedBlockId}
            />
          );
        case "notifications":
          return <NotificationsPage />;
        case "achievements":
          return <AchievementsPage />;
        case "clubOfLeaders":
          return (
            <ClubOfLeaders
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          );
        case "resources":
          return <ResourcesPage />;
        default:
          return null;
      }
    }

    switch (activePage) {
      case "profile":
        return <ProfilePage />;
      case "orders":
        return (
          <OrdersListPage
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        );
      case "clients":
        return (
          <ClientsListPage
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        );

      case "catalog":
        return (
          <CatalogPage
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onProductClick={(productId: string, blockId: string) => {
              setSelectedProductId(productId);
              setActivePage("productDetails");
              setSelectedBlockId(blockId);
            }}
          />
        );
      case "reports":
        return <ReportsPage />;
      case "productDetails":
        return selectedProductId ? (
          <EditCardPage
            productId={selectedProductId}
            selectedBlockId={selectedBlockId}
            clickOnFinish={() => {
              setActivePage("catalog");
            }}
          />
        ) : (
          <div>Please select a product.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="bg-darkBlack text-white max-w-[163px] w-full flex flex-col">
        <div className="py-3 px-7">
          <img src={Logo} alt="logo" />
        </div>
        <ul className="flex-grow">
          {menuItems.map((item) => (
            <li key={item.id}>
              <div
                className={`flex flex-row items-center p-3 gap-2 cursor-pointer hover:bg-darkStroke ${
                  activePage === item.id ? "bg-darkStroke" : ""
                }`}
                onClick={() =>
                  handleMenuItemClick(item.id, item.hasSubItems || false)
                }
              >
                {item.icon}
                {item.label}
                {item.hasSubItems && (
                  <span
                    className={`ml-auto transform ${
                      isContentExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ArrowDown />
                  </span>
                )}
              </div>
              {item.id === "content" && isContentExpanded && (
                <ul className="bg-contentBg">
                  {contentSubItems.map((subItem) => (
                    <li
                      key={subItem.id}
                      className={`pl-3 py-2 cursor-pointer text-darkStroke ${
                        activeContentSubpage === subItem.id ? "text-white" : ""
                      }`}
                      onClick={() => setActiveContentSubpage(subItem.id)}
                    >
                      {subItem.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="p-3 pb-8 flex justify-between">
          <button
            onClick={() => {
              setActivePage("profile");
            }}
            className="flex flex-row items-center max-w-[150px] bg-darkBlack"
          >
            <div className="w-6 h-6 rounded-full bg-darkStroke">
              <img src={userFromBD?.photoURL || ProfileIcon} alt="photo" />
            </div>

            <p className="text-white text-[12px] w-[60px] truncate">
              {userFromBD?.displayName}
            </p>
          </button>
          <button
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="text-[12px] text-darkStroke bg-darkBlack"
          >
            {currentUser ? "Вихід" : "Вхід"}
          </button>
        </div>
      </div>

      <div className="flex-grow bg-gray-100 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};
