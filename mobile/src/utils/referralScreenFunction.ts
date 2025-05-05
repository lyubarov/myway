import { useAuth } from "src/firebase/context/authContext";
import { addUserNotification, updateOnlyWallet, updateReferralStatus, updateUsersReferralAchievement } from "src/firebase/db";
import { sendNotificationToUsers } from "src/firebase/notification";

const STATUS_CARDS = [
    {
      title: "реферальний експерт",
      volume: "10 000 грн",
      income: "7%",
      colors: ["#000", "#7400ef"],
      titleColors: ["#9f60de", "#7d36c5"],
      border: "#8540cb",
      icon: require("@assets/icons/stepsIcons/rocket.png"),
      position: "-top-9 -right-4 max-w-[144px] w-full h-[200px]",
    },
    {
      title: "майстер впливу",
      volume: "20 000 грн",
      income: "10%",
      colors: ["#000", "#4d32fd"],
      titleColors: ["#aea2ff", "#452de1"],
      border: "#4b33e2",
      icon: require("@assets/icons/stepsIcons/star.png"),
      position: "-top-9 -right-5 max-w-[152px] w-full h-[157px]",
    },
    {
      title: "лідер спільноти",
      volume: "30 000 грн",
      income: "14%",
      colors: ["#000", "#f94fec"],
      titleColors: ["#ffc5fb", "#f94fec"],
      border: "#f950ec",

      icon: require("@assets/icons/stepsIcons/crown.png"),
      position: "-top-8 -right-6 max-w-[185px] w-full h-[147px]",
    },
    {
      title: "амбассадор бренду",
      volume: "40 000 грн",
      income: "20%",
      colors: ["#000", "#11b9d3"],
      titleColors: ["#75d6e7", "#3aa2b4"],
      border: "#11b9d3",

      icon: require("@assets/icons/stepsIcons/diamond.png"),
      position: "-top-3 -right-5 max-w-[144px] w-full h-[134px]",
    },
];
export const myRefStatus = (number: number, user: { myReferralsAchievement: number, uid: string,wallet:number }) => {
    const { refreshUserData } = useAuth()

      const sendNotification = async (title:string,body:string) => {
       await sendNotificationToUsers(user.uid, title,body,"NotificationScreen")
      }

  const update = async (ach: number, status: string, title: string, body: string) => {
        if (user?.myReferralsAchievement !== ach) {
          await updateUsersReferralAchievement(user.uid, ach, status)
            await refreshUserData(user.uid)
            await addUserNotification(user.uid, "Вітаємо з новим досягненням!", "Вам призначенно нову знижку.", "achievement")
            await sendNotification (title, body)
        }
  }
  const updateStatus = async () => {
        await updateReferralStatus(user.uid)
}
   const sum =
     user?.referrals?.reduce(
     (acc: number, friend: { spent: number; status: boolean; reviewMonue: number }) => {
      if (!friend.status) {
        acc += friend.reviewMonue || 0;
      }
      return acc;
    },
    0
     ) || 0;
  if (sum !== 0) {
    updateStatus()
  console.log(sum);
  }
  const updateWallet = async (percent:number) => {
    const newWallet = user.wallet + sum * percent / 100;
    await updateOnlyWallet(user.uid, newWallet)
    await refreshUserData(user.uid)
  }

  switch (true) {
  case (number < 10000):
    if (sum !== 0) {
      updateWallet(7);
    }
    return { id: 1, goal: 10000, achievement: 7 };

  case (number < 20000):
    if (sum !== 0) {
      updateWallet(10);
    }
    update(
      7,
      STATUS_CARDS[0].title,
      "🔥 Ти – експерт у реферальному світі!",
      "Твої запрошення працюють! Отримуй 7% доходу та рухайся до нових вершин!"
    );
    return { id: 2, goal: 20000, achievement: 10 };

  case (number < 30000):
    if (sum !== 0) {
      updateWallet(14);
    }
    update(
      10,
      STATUS_CARDS[1].title,
      "🌟 Вплив – твоя сила!",
      "Ти досяг нового рівня та тепер отримуєш 10% доходу! Продовжуй залучати друзів!"
    );
    return { id: 3, goal: 30000, achievement: 14 };

  case (number < 40000):
    if (sum !== 0) {
      updateWallet(20);
    }
    update(
      14,
      STATUS_CARDS[2].title,
      "👑 Ти будуєш справжню команду!",
      "Вона росте, а разом із нею – і твій дохід! Отримуй 14% і веди команду вперед!"
    );
    return { id: 4, goal: 40000, achievement: 20 };

  case (number >= 40000):
    if (sum !== 0) {
      updateWallet(20);
    }
    update(
      20,
      STATUS_CARDS[3].title,
      "🚀 Вершина підкорена!",
      "Тепер ти – амбасадор бренду! Максимальні 20% доходу – це лише початок твого успіху!"
    );
    return { id: 5, goal: 40000, achievement: 20 };

  default:
    return; 
}

    } 

export const updatedReferralCards = (number:number, user: { myReferralsAchievement:number, uid:string}) => {
    const status = myRefStatus(number, user);    
  
      const data = STATUS_CARDS.map((card, index) => ({
          ...card,
          active: index === status.id-2,
      }))
      return data
  }