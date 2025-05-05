interface CustomButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}
const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-green-500 text-white py-2 px-4 rounded-md font-medium transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ${className}`}
    >
      {label}
    </button>
  );
};

export default CustomButton;
