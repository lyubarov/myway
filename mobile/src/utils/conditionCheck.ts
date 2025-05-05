import { addAchievement, addUserNotification,getAllAchievements } from "src/firebase/db";
import { sendNotificationToUsers } from "src/firebase/notification";

    
export default async function checkConditions(userFromDB) {
    const { referrals = [], achievementList = [], wayWallet = 0, medals=0} = userFromDB;
    let updatedAchievements = ([...achievementList]);
    let newWallet = wayWallet;
  let newMedals = medals;
  const achievements= await getAllAchievements()

  const id1 = achievements.find(achievement => achievement.name == "Партнерський старт")
  const id2 = achievements.find(achievement => achievement.name == "Командний дух")
  const id3 = achievements.find(achievement => achievement.name == "Мотиватор")
  const id4 = achievements.find(achievement => achievement.name == "Топ - реферал")

    if (referrals.length >= 2 && !achievementList.includes(id1.id)) {
        updatedAchievements.push(id1.id);
        newWallet += id1.waylMoney; 
        newMedals += id1.waylMoney; 

    }
     if (referrals.length >= 3 && !achievementList.includes(id2.id)) {
          updatedAchievements.push(id2.id);
         newWallet += id2.waylMoney; 
         newMedals += id2.waylMoney; 

     }
     if (referrals.length >= 5 && !achievementList.includes(id3.id)) {
          updatedAchievements.push(id3.id);
         newWallet += id3.waylMoney; 
         newMedals += id3.waylMoney; 

    }
    if (referrals.length >= 7 && !achievementList.includes(id4.id)) {
          updatedAchievements.push(id4.id);
        newWallet += id4.waylMoney; 
        newMedals += id4.waylMoney; 

    }
      const sendNotification = async (title:string,body:string) => {
        await sendNotificationToUsers(userFromDB.uid, title,body,"NotificationScreen")
      }
    if (updatedAchievements.length > achievementList.length && newWallet > wayWallet) {
        addAchievement(userFromDB?.uid, updatedAchievements, newWallet, newMedals)
        addUserNotification(userFromDB.uid, "Вітаємо з новим рефералом!", "За вашим посиланням приєднався новий учасник.", "referral")
        addUserNotification(userFromDB.uid, "Ви отримали нові бонуси!", "Ви отримали нові бонуси за запрошеного друга!","achievement")
        await sendNotification ("💪 Твоя команда зростає – і твій дохід теж!", `+${newWallet-wayWallet} вейлів на рахунок!`)

        return true
    }
    
}