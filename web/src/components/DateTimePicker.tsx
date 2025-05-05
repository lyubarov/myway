import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface DateTimePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
}
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  return (
    <div className="space-y-2 my-5">
      <label className="text-[14px] font-medium text-darkBlack">
        Дата та час: <span className="text-red">*</span>
      </label>
      <div className="flex gap-2">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd.MM.yyyy"
          placeholderText="Дата"
          className="w-full p-2 border border-gray-300 bg-white text-darkBlack rounded-md"
        />
        <DatePicker
          selected={selectedTime ? new Date(selectedTime) : null}
          onChange={(time: Date | null) =>
            setSelectedTime(time ? time.toISOString() : null)
          }
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          placeholderText="Час"
          className="w-full p-2 border border-gray-300 bg-white text-darkBlack rounded-md"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
