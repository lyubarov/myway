import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const parseDate = (date) => {
  if (date && date.seconds && date.nanoseconds) {
    return new Date(date.seconds * 1000);
  }

  if (typeof date !== "string" || !date) {
    console.error("Invalid or missing date string:", date);
    return new Date();
  }

  const dateParts = date.split(" at ");
  if (dateParts.length !== 2) {
    console.error("Invalid date format:", date);
    return new Date();
  }

  const [month, day, year] = dateParts[0].split(" ");
  const [time, timeZone] = dateParts[1].split(" UTC");

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const dateObj = new Date(
    `${year}-${monthMap[month]}-${day}T${time}:00:00${timeZone}`
  );

  return dateObj;
};

export default function CountdownTimer({ start }) {
  if (!start) {
    console.error("Start date is required");
    return null;
  }

  const initialDate = parseDate(start);
  const targetDate = addMonths(initialDate, 3).getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {[
        { value: timeLeft.days, label: "днів" },
        { value: timeLeft.hours, label: "годин" },
        { value: timeLeft.minutes, label: "хвилин" },
        { value: timeLeft.seconds, label: "секунд" },
      ].map((item, index, arr) => (
        <View
          key={index}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {item.value < 10 ? `0${item.value}` : item.value}
            </Text>
            <Text
              allowFontScaling={false}
              style={{ fontSize: 14, color: "#D1D5DB" }}
            >
              {item.label}
            </Text>
          </View>

          {index < arr.length - 1 && (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
                marginHorizontal: 16,
              }}
            >
              :
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
