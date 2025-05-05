import RightArrow from "../../assets/svg/RightArrow";
import ArrowDown from "../../assets/svg/ArrowDown";
import LeftArrow from "../../assets/svg/LeftArrow";
import { useAuth } from "../firebase/context/authContext";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export type PaginationPropsForPages = Omit<PaginationProps, "totalPages">;

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const { itemsPerPage, changePerPage } = useAuth();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-5">
      <button
        className={`p-[10px] border ${currentPage === 1 ? "bg-gray-200" : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <LeftArrow color={currentPage === 1 ? "lightGrey" : "black"} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`p-[10px] border text-[14px] ${
            currentPage === i + 1
              ? "border-black text-black bg-white"
              : "border-lightGrey text-darkStroke"
          }`}
          onClick={() => handlePageChange(i + 1)}
        >
          <p className="w-5 h-5">{i + 1}</p>
        </button>
      ))}

      <button
        className={`p-[10px] border ${
          currentPage === totalPages ? "bg-gray-200" : ""
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <RightArrow
          color={currentPage === totalPages ? "lightGrey" : "black"}
        />
      </button>

      <div className="flex items-center space-x-2">
        <div className="relative w-28">
          <select
            className="w-full h-10 text-[14px] border border-greyGrey px-3 pr-8 text-darkStroke font-medium bg-white"
            value={itemsPerPage}
            onChange={(e) => changePerPage(parseInt(e.target.value, 10))}
          >
            {[5, 10, 15, 20].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {/* <span className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
            <ArrowDown />
          </span> */}
        </div>
        <span className="text-darkStroke">/ Сторінка</span>
      </div>
    </div>
  );
};
