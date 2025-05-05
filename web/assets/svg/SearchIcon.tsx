type SVGProps = React.SVGProps<SVGSVGElement>;

export const SearchIcon = (props: SVGProps) => {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8332 12.8334L10.3332 10.3334M3.1665 7.33341C3.1665 5.03223 5.03198 3.16675 7.33317 3.16675C9.63437 3.16675 11.4998 5.03223 11.4998 7.33341C11.4998 9.63461 9.63437 11.5001 7.33317 11.5001C5.03198 11.5001 3.1665 9.63461 3.1665 7.33341Z"
        stroke="#CBCBCB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
