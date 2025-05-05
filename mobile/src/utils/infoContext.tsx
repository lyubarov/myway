import React, { useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "src/firebase/context/authContext";
import {
  addToCart,
  getBlocks,
  getCartProducts,
  getFavorites,
  getOrdersForUser,
  getProductsFromBlockById,
  getVitaminRecords,
  listenForOrderStatusChanges,
  toggleFavorite,
  updateReferrals,
} from "src/firebase/db";
import checkConditions from "./conditionCheck";
import { updateReferralCode } from "src/firebase/db";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
interface Vitamins {
  vitamin: Record<string, any>;
  time: string[];
  days: string[];
  status: boolean;
}
interface Blocks {
  id: string;
  category: string;
  title: string;
  banners?: string[];
}
interface InfoContextValue {
  blocks: Blocks[];
  products: Product[];
  cartProducts: { product: Product; quantity: number }[];
  setCartProducts: React.Dispatch<
    React.SetStateAction<{ product: Product; quantity: number }[]>
  >;
  modalBasketIsOpen: boolean;
  handleAddToBasket: (product: Product) => Promise<void>;
  setModalBasketIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  favorites: Product[];
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>;
  handleToggleFavorite: (product: Product) => Promise<void>;
  takingVitamins: Vitamins[];
  refreshTakingVitamins: React.Dispatch<React.SetStateAction<Vitamins[]>>;
  fetchCartProducts: () => Promise<void>;
  changeTypeFood: (label: string) => void;
  typeFood: string;
  totalAmount: number;
  loadingToBasket: boolean;
}

interface InfoProviderProps {
  children: ReactNode;
}

const InfoContext = React.createContext<InfoContextValue | null>(null);

export function useUsersProduct(): InfoContextValue {
  const context = useContext(InfoContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const handleDynamicLink = async (link: string, currentUserId: string) => {
  const urlParams = new URLSearchParams(link.split("?")[1]);
  const userId = urlParams.get("userId");

  if (userId && currentUserId) {
    await updateReferralCode(currentUserId, userId);
    await updateReferrals(userId, currentUserId);
  }
};

export function InfoProvider({ children }: InfoProviderProps) {
  const { currentUser, userFromDB, refreshUserData } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartProducts, setCartProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [modalBasketIsOpen, setModalBasketIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [takingVitamins, setTakingVitamins] = useState([]);
  const [typeFood, setTypeFood] = useState("Вітаміни та мінерали");
  const [blocks, setBlocks] = useState([]);
  const [loadingToBasket, setLoadingToBasket] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Отримуємо дані з AsyncStorage
        const storedProducts = await AsyncStorage.getItem("products");
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }

        const data = await getBlocks();
        setBlocks(data);

        let allProducts: Product[] = [];

        for (const block of data) {
          if (block.category === "Товари" || block.category === "Акції") {
            const productsFromBlock = await getProductsFromBlockById(block.id);
            allProducts = [...allProducts, ...productsFromBlock];
          }
        }

        // Перевіряємо чи змінилися дані
        const storedProductsStr = JSON.stringify(allProducts);
        if (storedProducts !== storedProductsStr) {
          await AsyncStorage.setItem("products", storedProductsStr);
          setProducts(allProducts);
        }
      } catch (error) {
        console.error("Помилка під час завантаження продуктів:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link) => {
      handleDynamicLink(link.url, currentUser.uid);
    });

    const checkInitialLink = async () => {
      const initialLink = await dynamicLinks().getInitialLink();
      if (initialLink) {
        handleDynamicLink(initialLink.url, currentUser.uid);
      }
    };

    if (currentUser) {
      if (!currentUser.referralCode) checkInitialLink();
    }

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userFromDB || !userFromDB.uid) return;

      try {
        const bool = await checkConditions(userFromDB);
        if (bool) {
          await refreshUserData(userFromDB.uid);
        }
      } catch (error) {
        console.error("Помилка під час завантаження Conditions:", error);
      }
    };

    fetchData();
  }, [userFromDB]);

  const fetchCartProducts = async () => {
    if (currentUser) {
      const products = await getCartProducts(currentUser.uid);
      setCartProducts(products || []);
    }
  };

  const handleAddToBasket = async (product: Product) => {
    if (!currentUser) {
      setCartProducts((prev) => {
        const productExists = prev.some(
          (item) => item.product.id === product.id
        );

        if (productExists) {
          return prev;
        }
        return [...prev, { product, quantity: 1 }];
      });
    } else {
      setLoadingToBasket(true);
      try {
        await addToCart(currentUser.uid, product);
        await fetchCartProducts();

        setModalBasketIsOpen(true);
      } catch (error) {
      } finally {
        setLoadingToBasket(false);
      }
    }
  };

  const fetchFavorites = async (uid?: string) => {
    if (!uid) return;
    const favs = await getFavorites(uid);
    setFavorites(favs);
  };
  const fetchTakingVitamins = async (uid?: string) => {
    if (!uid) return;
    const vitamins = await getVitaminRecords(uid);
    setTakingVitamins(vitamins);
  };

  const handleToggleFavorite = async (product: Product) => {
    if (!currentUser) return;
    await toggleFavorite(currentUser.uid, product);
    fetchFavorites(currentUser.uid);
  };

  useEffect(() => {
    fetchCartProducts();
    fetchFavorites(currentUser?.uid);
    fetchTakingVitamins(currentUser?.uid);
  }, [currentUser]);
  async function refreshTakingVitamins() {
    try {
      if (!currentUser) return;
      const vitamins = await getVitaminRecords(currentUser.uid);

      if (vitamins) {
        setTakingVitamins(vitamins);
      }
    } catch (error) {
      console.error("❌ Помилка під час отримання вітамінів:", error);
    } finally {
    }
  }
  const changeTypeFood = (label: string) => {
    setTypeFood(label);
  };

  const totalAmount = Array.isArray(cartProducts)
    ? cartProducts.reduce((sum: number, item) => {
        const product = item.product || item;
        if (!product || !product.price) return sum;

        const basePrice = Number(product.price) || 0;
        const discount = product.discount ? Number(product.discount) : 0;
        const priceAfterDiscount = basePrice * ((100 - discount) / 100);

        const achievementDiscount = userFromDB?.myAchievement
          ? (100 - Number(userFromDB.myAchievement)) / 100
          : 1;

        const finalPrice = priceAfterDiscount * achievementDiscount;
        return sum + finalPrice * Number(item.quantity || 1); // Default quantity to 1 if undefined
      }, 0)
    : 0;

  useEffect(() => {
    if (!userFromDB) return;

    let unsubscribers: (() => void)[] = [];

    const setupListeners = async () => {
      const orders = await getOrdersForUser(userFromDB.uid);

      orders.forEach((order) => {
        if (!orderListeners.has(order.id)) {
          const unsubscribe = listenForOrderStatusChanges(
            order.id,
            userFromDB.uid
          );
          if (typeof unsubscribe === "function") {
            unsubscribers.push(unsubscribe);
          }
        }
      });
    };

    setupListeners();

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [userFromDB]);

  const value: InfoContextValue = {
    blocks,
    products,
    cartProducts,
    setCartProducts,
    modalBasketIsOpen,
    handleAddToBasket,
    setModalBasketIsOpen,
    favorites,
    setFavorites,
    handleToggleFavorite,
    takingVitamins,
    refreshTakingVitamins,
    fetchCartProducts,
    changeTypeFood,
    typeFood,
    totalAmount,
    loadingToBasket,
  };

  return <InfoContext.Provider value={value}>{children}</InfoContext.Provider>;
}
