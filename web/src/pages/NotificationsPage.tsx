import { PopupNotificationBlockTwo } from "../components/PopupNotification";
import { PushNotificationBlockTwo } from "../components/PushNotificationBlockTwo";
import { SystemNotificationBlockOne } from "../components/SystemNotificationBlockOne";

export default function NotificationsPage() {
  return (
    <>
      <h1 className="text-darkBlack text-[40px] font-normal mb-3">Контент</h1>
      <p className="text-darkStroke mb-5">
        Контент / <span className="text-darkBlack">Сповіщення</span>
      </p>
      <div className="flex flex-row space-x-5">
        <SystemNotificationBlockOne />
        <PushNotificationBlockTwo />
        <PopupNotificationBlockTwo />
      </div>
    </>
  );
}
