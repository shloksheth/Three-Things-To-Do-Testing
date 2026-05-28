import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { format, parse, isSameMinute, isFuture } from 'date-fns';

export const useNotifications = () => {
  const { events } = useStore();

  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkEvents = setInterval(() => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const todayStr = format(now, 'yyyy-MM-dd');
      const timeStr = format(now, 'HH:mm');

      events.forEach(event => {
        if (event.notify && event.date === todayStr && event.time === timeStr) {
          new Notification("Three Things Reminder", {
            body: event.title,
            icon: "/three-things-to-do/favicon.svg"
          });

          // Disable notify so it doesn't fire again
          useStore.getState().updateEvent(event.id, { notify: false });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkEvents);
  }, [events]);
};
