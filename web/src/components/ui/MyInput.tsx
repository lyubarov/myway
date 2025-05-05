import { SearchIcon } from "../../../assets/svg/SearchIcon";

interface MyInputProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const MyInput: React.FC<MyInputProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="mb-5 relative min-w-[388px]">
      <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Пошук..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-white border border-lightGrey pl-9 p-3 max-w-[388px] w-full text-darkBlack"
      />
    </div>
  );
};
