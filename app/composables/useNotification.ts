const isiOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (('standalone' in window.navigator) && (window.navigator as any).standalone === true);

const notificationsSupported = () =>
  ('serviceWorker' in navigator) &&
  (('Notification' in window) || ('showNotification' in ServiceWorkerRegistration.prototype));

const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!");
    }
    // iOS requires an installed Home Screen app
    if (isiOS() && !isStandalone()) {
        throw new Error("On iOS, enable notifications by adding this app to the Home Screen, then open it from there.");
    }
    if (!notificationsSupported()) {
        throw new Error("Notifications are not supported on this browser/device.");
    }
    if (!(window.isSecureContext || location.hostname === 'localhost')) {
        throw new Error("Notifications require HTTPS or localhost.");
    }
};

const registerSW = async () => {
    // Keep SW at site root for widest scope on GitHub Pages
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
};

const requestNotificationPermission = async () => {
    // Must be called from a user gesture on mobile
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error("Notification permission not granted");
    }
    return permission;
};

export async function sendNotification(title: string, options?: NotificationOptions) {
    checkPermission();
    const reg = await registerSW();
    await navigator.serviceWorker.ready;
    await requestNotificationPermission();

    // await reg.showNotification("Meow...!", {
    //     body: "Meow...!",
    //     icon: '4Logo.png',
    // });
    await reg.showNotification(title, {
      body: options?.body,
      icon: '/4Logo.png',
      tag: options?.tag,
      // ...options,
    });
};