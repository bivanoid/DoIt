// utils/notification.ts

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
};

export const scheduleNotification = async (
    task: string,
    deadlineISO: string
) => {
    const granted = await requestNotificationPermission();
    if (!granted) {
        alert("Izin notifikasi ditolak. Aktifkan notifikasi di pengaturan browser.");
        return;
    }

    const delay = new Date(deadlineISO).getTime() - Date.now();
    if (delay <= 0) {
        alert("Deadline sudah lewat!");
        return;
    }

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: "SCHEDULE_NOTIFICATION",
            payload: {
                title: `Ada notifikasi`,
                body: task,
                delay,
            },
        });
    } else {
        setTimeout(() => {
            new Notification(`Ada notifikasi`, {
                body: task,
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-72x72.png",
                tag: `todo-${Date.now()}`,
            });
        }, delay);
    }
};