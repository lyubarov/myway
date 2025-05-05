const RightArrow = ({ color }: { color: string }) => (
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
      d="M8.959 7.292 11.875 10 8.96 12.708"
    ></path>
  </svg>
);

export default RightArrow;
