import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { removeFromCart, updateCartQuantity } from "src/firebase/db";
import { useUsersProduct } from "@utils/infoContext";
import { useAuth } from "src/firebase/context/authContext";
import CloseIconSmall from "@assets/svg/CloseIconSmall";

const ItemsInCart = ({
  setDisabled,
}: {
  setDisabled?: (value: boolean) => void;
}) => {
  const { cartProducts, fetchCartProducts } = useUsersProduct();
  const { currentUser, userFromDB, isDarkMode } = useAuth();
  const toggleAddValue = (productId: string) => {
    increaseQuantity(productId);
  };
  const toggleMinValue = (productId: string) => {
    decreaseQuantity(productId);
  };
  const increaseQuantity = async (productId: string) => {
    const updatedCart = cartProducts.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    await updateCartQuantity(currentUser?.uid, updatedCart);
    fetchCartProducts();
  };

  const decreaseQuantity = async (productId: string) => {
    const updatedCart = cartProducts
      .map((item) => {
        if (item.product.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          if ((item.quantity = 1)) {
            handleRemoveItem(productId);
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    await updateCartQuantity(currentUser?.uid, updatedCart);
    fetchCartProducts();
  };
  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(currentUser?.uid, productId);
    await fetchCartProducts();
  };
  const discountedPrice = (item: any) => {
    const basePrice = Number(item.product.price);

    const discount = item.product.discount ? Number(item.product.discount) : 0;

    const priceAfterDiscount = basePrice * ((100 - Number(discount)) / 100);

    const achievementDiscount = userFromDB?.myAchievement
      ? (100 - Number(userFromDB.myAchievement)) / 100
      : 1;

    const finalPrice = priceAfterDiscount * achievementDiscount;

    return finalPrice;
  };
  return (
    <View>
      {cartProducts.map((item) => {
        console.log(item.product);
        if (setDisabled) {
          if (Number(item?.product?.availability) < item?.quantity) {
            setDisabled(true);
          } else setDisabled(false);
        }
        return (
          <View
            key={item.product.id}
            className="flex-row py-[18px] justify-between border-b border-lightGrey"
          >
            <View className="flex-row">
              <View>
                <Image
                  source={{ uri: item.product.images[0] }}
                  className="w-[92px] h-[92px]"
                />
              </View>
              <View className="items-start">
                <Text
                  allowFontScaling={false}
                  className="font-bold text-base mb-2"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  {item.product.name}
                </Text>
                <Text
                  allowFontScaling={false}
                  className="font-medium text-xs mb-2 max-w-[120px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  {item.product.category}
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-base"
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                >
                  {parseFloat(discountedPrice(item).toFixed(1))}₴
                </Text>
                <Text
                  allowFontScaling={false}
                  className={`font-semibold text-xs ${
                    Number(item?.product?.availability) >= item?.quantity
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {Number(item?.product?.availability) >= item?.quantity
                    ? "в наявності"
                    : "нема наявності"}
                </Text>
              </View>
            </View>
            <View className="items-end justify-between">
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.product.id)}
              >
                <CloseIconSmall color={"#b1bfbd"} />
              </TouchableOpacity>
              <View
                className="border-0.5 border-green px-3 items-center rounded-[40px] flex-row"
                style={{ backgroundColor: "rgba(37, 195, 180, 0.2)" }}
              >
                <TouchableOpacity
                  onPress={() => toggleMinValue(item.product.id)}
                >
                  <Text
                    allowFontScaling={false}
                    className="mr-4 text-[26px] font-light"
                    style={{
                      color: isDarkMode ? "white" : "black",
                    }}
                  >
                    –
                  </Text>
                </TouchableOpacity>
                <TextInput
                  value={String(item.quantity)}
                  style={{
                    color: isDarkMode ? "white" : "black",
                  }}
                />
                <TouchableOpacity
                  onPress={() => toggleAddValue(item.product.id)}
                >
                  <Text
                    allowFontScaling={false}
                    className="ml-4 text-[26px] font-light"
                    style={{
                      color: isDarkMode ? "white" : "black",
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
export default ItemsInCart;
