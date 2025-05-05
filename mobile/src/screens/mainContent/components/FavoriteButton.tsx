import { TouchableOpacity } from "react-native";
import { FavoriteIcon } from "@assets/svg/TypeFoodIcons";
import { useUsersProduct } from "@utils/infoContext";
import { useAuth } from "src/firebase/context/authContext";

interface FavoriteButtonProps {
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
  };
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  product,
}: {
  product: any;
}) => {
  const { handleToggleFavorite, favorites } = useUsersProduct();
  const { isDarkMode } = useAuth();

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  return (
    <TouchableOpacity
      onPress={() => handleToggleFavorite(product)}
      className=" px-3  rounded-full ml-[6px] items-center justify-center"
      style={{
        backgroundColor: isFavorite ? "#25C3B4" : "rgba(37, 195, 180, 0.2)",

        borderWidth: 0.5,
        borderColor: "rgba(37, 195, 180, 0.2)",
      }}
    >
      <FavoriteIcon opacity={isFavorite ? 1 : 0.2} isFavorite={isFavorite} />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
