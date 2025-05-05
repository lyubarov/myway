const LeftArrow = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      d="M11.042 7.292 8.125 10l2.917 2.708"
    ></path>
  </svg>
);

export default LeftArrow;
