// Augment Navigator to include iOS Safari PWA flag
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export const useNotification = () => {  
  const isiOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const notificationsSupported = () =>
  ('serviceWorker' in navigator) &&
  (('Notification' in window) || ('showNotification' in ServiceWorkerRegistration.prototype));

const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
      alert("No support for service worker!");
        throw new Error("No support for service worker!");
    }
    // iOS requires an installed Home Screen app
    if (isiOS() && !isStandalone()) {
      alert("On iOS, enable notifications by adding this app to the Home Screen, then open it from there.");
      throw new Error("On iOS, enable notifications by adding this app to the Home Screen, then open it from there.");
    }
    if (!notificationsSupported()) {
      alert("Notifications are not supported on this browser/device.");
      throw new Error("Notifications are not supported on this browser/device.");
    }
    if (!(window.isSecureContext || location.hostname === 'localhost')) {
      alert("Notifications require HTTPS or localhost.");
        throw new Error("Notifications require HTTPS or localhost.");
    }
};

const registerSW = async () => {
    // Keep SW at site root for widest scope on GitHub Pages
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
};

const requestPermission = async () => {
    // Must be called from a user gesture on mobile
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert("Notification permission not granted");
        throw new Error("Notification permission not granted");
    }
    return permission;
};

async function sendNotification(title: string, options?: NotificationOptions) {
    checkPermission();
    const reg = await registerSW();
    await navigator.serviceWorker.ready;
    await requestPermission();

    await reg.showNotification(title, {
        icon: '/4Logo.png',
        ...options,
    });
};

  return {
    sendNotification,
    requestPermission,
  }
}
