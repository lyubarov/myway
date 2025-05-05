import { useAuth } from "src/firebase/context/authContext"
import { addUserNotification, updateUserAchievement } from "src/firebase/db"
import { sendNotificationToUsers } from "src/firebase/notification"

export const myStatus = (number: number, user: { myAchievement: number, uid: string }) => {
    const {refreshUserData,userFromDB}=useAuth()
    const update = async (ach: number,status:string, title:string, body:string) => {
        if (user?.myAchievement !== ach) {
            await updateUserAchievement(user.uid, ach,status)
          await refreshUserData(user.uid)
          await addUserNotification(userFromDB.uid, title, body, "achievement")
          await sendNotification (title, body)
        }
    }
  const sendNotification = async (title:string,body:string) => {
    await sendNotificationToUsers(user.uid, title,body,"NotificationScreen")
  }
  if (number < 1000) {
        return {id:1, goal:1000, achievement:1}
    } else if (number < 5000) {
        update(1,STATUS_CARDS[0].title, "🎉 Твоя перша вигода – знижка 1%!","Це лише початок! Купуй і відкривай більше переваг!")
        return {id:2,  goal:5000, achievement:2}
    } else if (number < 10000) {
        update(2,STATUS_CARDS[1].title,"🛍️ Ти піднявся рівнем вище!","Тепер у тебе 2% знижки! Наступний рівень уже поруч!")

        return {id:3,  goal:10000, achievement:3}
    } else if (number < 15000) {
        update(3,STATUS_CARDS[2].title,"💎 Вигоди ростуть! Твоя знижка 3%!","Зроби ще крок, щоб отримати більше!")

        return {id:4,  goal:15000, achievement:4}
    } else if (number < 20000) {
                update(4,STATUS_CARDS[3].title,"🔥 4% знижки – твоя!","Купуй із вигодою та піднімайся на новий рівень!")

        return {id:5,  goal:20000, achievement:5}
    } else if (number < 25000) {
                update(5,STATUS_CARDS[4].title,"💰 Вигідний статус! Тепер твоя знижка 5%!","Чим більше покупок – тим більше бонусів!")

        return {id:6,  goal:25000, achievement:6}
    } else if (number < 30000) {
                update(6,STATUS_CARDS[5].title,"🥈 Срібний рівень – срібні вигоди!","6% знижки на всі покупки! Вже за крок до золотого рівня!")

        return {id:7,  goal:30000, achievement:7}
    } else if (number < 35000) {
                update(7,STATUS_CARDS[6].title,"🏅 Ти став Золотим клієнтом!","7% знижки – насолоджуйся вигодами!")

        return {id:8,  goal:35000, achievement:8}
    } else if (number < 40000) {
                update(8,STATUS_CARDS[7].title,"⚡ 8% знижки – це твоя нагорода!","Роби покупки з вигодою та продовжуй рости!")

        return {id:9,  goal:40000, achievement:9}
    } else if (number < 45000) {
                update(9,STATUS_CARDS[8].title,"💼 Партнерська вигода – 9% знижки!","Ще більше переваг на кожному рівні!")

        return {id:10,  goal:45000, achievement:10}
    } else if (number < 50000) {
                update(10,STATUS_CARDS[9].title,"🎖️ 10% знижки – найвищий рівень вигоди!","Твій статус говорить сам за себе!")

        return {id:11,  goal:50000, achievement:15}
  } else if (number > 50000) {
    update(15, STATUS_CARDS[10].title, "🏆 15% знижки – ти на вершині!", "Твій шлях до ексклюзивних можливостей відкрито!")

    return { id: 12, goal: 50000, achievement: 15 }
  }
    else return {id:12,  goal:50000, achievement:15}
}
  const STATUS_CARDS = [
    {
      title: "новенький",
      volume: "1000 грн",
      income: "1%",
      colors: ["#000", "#1f92d5"],
      titleColors: ["#86d2ff", "#1f92d5"],
      border: "#1f92d5",
      icon: require("@assets/icons/myStatus/1.png"),
      position: "-top-5 -right-10",
      active: false,
    },
    {
      title: "покупець",
      volume: "5000 грн",
      income: "2%",
      colors: ["#000", "#ff64c3"],
      titleColors: ["#ff9fda", "#d0529f"],
      border: "#d0529f",
      icon: require("@assets/icons/myStatus/2.png"),
      position: "-top-7 -right-6 w-[140px] h-[150px] ",
      active: true,
    },
    {
      title: "преміальний покупець",
      volume: "10 000 грн",
      income: "3%",
      colors: ["#000", "#ff7a46"],
      titleColors: ["#ffae8d", "#ff7037"],
      border: "#ff7037",

      icon: require("@assets/icons/myStatus/3.png"),
      position: "-top-8 -right-7",
      active: false,
    },
    {
      title: "ексклюзивний покупець",
      volume: "15 000 грн",
      income: "4%",
      colors: ["#000", "#df2a69"],
      titleColors: ["#ff90b7", "#b82357"],
      border: "#b82357",

      icon: require("@assets/icons/myStatus/4.png"),
      position: "-top-1 -right-9",
      active: false,
    },
    {
      title: "постійний клієнт",
      volume: "20 000 грн",
      income: "5%",
      colors: ["#000", "#324afd"],
      titleColors: ["#7584ff", "#1d30c9"],
      border: "#1d30c9",
      icon: require("@assets/icons/myStatus/5.png"),
      position: "-top-4 -right-9",
      active: false,
    },
    {
      title: "срібний клієнт",
      volume: "25 000 грн",
      income: "6%",
      colors: ["#000", "#66fbff"],
      titleColors: ["#b4fdff", "#38cbd0"],
      border: "#38cbd0",
      icon: require("@assets/icons/myStatus/6.png"),
      position: "-top-4 -right-4",
      active: false,
    },
    {
      title: "золотий клієнт",
      volume: "30 000 грн",
      income: "7%",
      colors: ["#000", "#ffe641"],
      titleColors: ["#fdee8d", "#d6c137"],
      border: "#d6c137",

      icon: require("@assets/icons/myStatus/7.png"),
      position: "top-0 right-0",
      active: false,
    },
    {
      title: "майстер балансу",
      volume: "35 000 грн",
      income: "8%",
      colors: ["#000", "#7422b2"],
      titleColors: ["#ca85ff", "#661e9d"],
      border: "#661e9d",

      icon: require("@assets/icons/myStatus/8.png"),
      position: "-top-6 -right-5",
      active: false,
    },
    {
      title: "партнер",
      volume: "40 000 грн",
      income: "9%",
      colors: ["#000", "#fd0734"],
      titleColors: ["#f599a7", "#c8062a"],
      border: "#c8062a",
      icon: require("@assets/icons/myStatus/9.png"),
      position: "-top-0 -right-0",
      active: false,
    },
    {
      title: "платиновий партнер",
      volume: "45 000 грн",
      income: "10%",
      colors: ["#000", "#36fffd"],
      titleColors: ["#7bf5f5", "#12c2c2"],
      border: "#12c2c2",
      icon: require("@assets/icons/myStatus/10.png"),
      position: "-top-0 -right-6",
      active: false,
    },
    {
      title: "легенда My Way",
      volume: "50 000 грн",
      income: "15%",
      colors: ["#000", "#ff3cf3"],
      titleColors: ["#f786f0", "#d533cb"],
      border: "#d533cb",

      icon: require("@assets/icons/myStatus/11.png"),
      position: "top-3 -right-5",
      active: false,
    },
  ];
export const updatedStatusCards = (number:number, user: { myAchievement:number, uid:string}) => {
    const status = myStatus(number, user);

    const data = STATUS_CARDS.map((card, index) => ({
        ...card,
        active: index === status.id-2,
    }))
  
    return data
}