import { notifications as seedNotifications } from "@/lib/data";

export type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
};

let notificationsList: NotificationItem[] = [...seedNotifications];
const listeners = new Set<() => void>();

export function getNotifications(): NotificationItem[] {
  return notificationsList;
}

export function addNotification(item: Omit<NotificationItem, "id">) {
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    unread: true,
    ...item,
  };
  notificationsList = [newNotif, ...notificationsList];
  listeners.forEach((fn) => fn());
}

export function markAllNotificationsRead() {
  notificationsList = notificationsList.map((n) => ({ ...n, unread: false }));
  listeners.forEach((fn) => fn());
}

export function subscribeNotifications(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
