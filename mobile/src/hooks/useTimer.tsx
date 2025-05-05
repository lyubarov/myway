import { useEffect, useState } from "react";

export const useTimer = (refreshPeriod: number = 1000) => {
  const [currentTime, setCurrentTime] = useState<number>(60);
  const [isActivatedTime, setIsActivatedTime] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;

    if (isActivatedTime && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, refreshPeriod);
    } else if (currentTime === 0) {
      clearInterval(interval);
      setIsActivatedTime(false);
    }

    return () => clearInterval(interval);
  }, [isActivatedTime, currentTime, refreshPeriod]);

  const startTimer = () => {
    if (currentTime > 0 && currentTime !== 60) {
      setIsActivatedTime(true);
    }
  };

  const resetTimer = () => {
    setCurrentTime(60);
    setIsActivatedTime(false);
    setTimeout(() => {
      setIsActivatedTime(true);
    }, 1000);
  };

  const stopTimer = () => {
    setIsActivatedTime(false);
  };

  return {
    currentTime,
    isActivatedTime,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
