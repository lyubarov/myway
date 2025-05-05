type SVGProps = React.SVGProps<SVGSVGElement>;

const TrashIcon = (props: SVGProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <path
      stroke="#F55"
      strokeLinecap="round"
      strokeWidth="1.5"
      d="M1.583 4.485h13.5"
    ></path>
    <path
      fill="#F55"
      stroke="#F55"
      strokeWidth="1.5"
      d="m3.316 6.486.12.007a35.3 35.3 0 0 0 .266 5.697l-.118.018a35.4 35.4 0 0 1-.268-5.722Zm.613 7.187.127-.02c.234.408.602.725 1.04.896v.128a2.2 2.2 0 0 1-1.167-1.004Zm2.667 1.137v-.12h3.47v.12zm4.97-.133v-.128c.437-.171.805-.488 1.039-.895l.127.019c-.254.464-.67.822-1.166 1.004Zm1.512-2.469-.12-.018c.243-1.889.333-3.794.268-5.697l.12-.007a35.4 35.4 0 0 1-.268 5.722ZM5.044 4.425h6.573l.007.12H5.037z"
    ></path>
    <path
      stroke="#F55"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.635 4.485v-.54a2.696 2.696 0 1 1 5.391 0v.54M6.713 7.372v4.469M9.948 7.372v4.469"
    ></path>
  </svg>
);

export default TrashIcon;
