export const ProductList: React.FC = () => {
  const products = ["Магній B6", "Залізо", "Вітаміни групи B"];

  return (
    <div>
      <label className="block text-sm mb-1">
        Товари<span className="text-red-500">*</span>
      </label>

      <button className="flex items-center gap-2 border p-2 w-full mb-2">
        <span>Додати товар</span>
        <span className="text-xl">+</span>
      </button>

      <div className="space-y-2">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between border p-2 "
          >
            <span>{product}</span>
            <div className="flex gap-2">
              {/* <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
              <MenuIcon className="w-5 h-5 cursor-pointer" /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
