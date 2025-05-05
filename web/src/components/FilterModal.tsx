import { useEffect, useState } from "react";

interface ICheckbox {
  label: string;
  checked: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  title: string;
  options: {
    myStatus: ICheckbox[];
    referralStatus: ICheckbox[];
  };
  onClose: () => void;
  onSave: (newFilters: {
    myStatus: ICheckbox[];
    referralStatus: ICheckbox[];
  }) => void;
}

export const FilterModal = ({
  isOpen,
  title,
  onClose,
  onSave,
  options,
}: FilterModalProps) => {
  const [checkboxes, setCheckboxes] = useState<ICheckbox[]>([]);

  useEffect(() => {
    setCheckboxes(options);
  }, [options]);

  const handleSave = () => {
    onSave(checkboxes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>
        <div className="space-y-2 mb-4">
          {checkboxes.map((item, index) => (
            <div key={index}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() =>
                  setCheckboxes((prev) =>
                    prev.map((el, i) =>
                      i === index ? { ...el, checked: !el.checked } : el
                    )
                  )
                }
              />
              <label className="text-black ml-2">{item.label}</label>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300">
            Скасувати
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white"
          >
            Застосувати
          </button>
        </div>
      </div>
    </div>
  );
};
