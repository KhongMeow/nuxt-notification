// Augment Navigator to include iOS Safari PWA flag
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

type NotifyOptions = NotificationOptions & {
  data?: { url?: string; [k: string]: unknown };
};

export const useNotification = () => {
  const isClient = typeof window !== 'undefined' && typeof navigator !== 'undefined';
  let regPromise: Promise<ServiceWorkerRegistration | null> | null = null;

  const isiOS = () =>
    isClient &&
    (/iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const isStandalone = () =>
    isClient &&
    (window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true);

  const isSupported = () =>
    isClient &&
    'serviceWorker' in navigator &&
    (('Notification' in window) || ('showNotification' in ServiceWorkerRegistration.prototype));

  const ensureSecure = () =>
    isClient && (window.isSecureContext || location.hostname === 'localhost');

  const registerSW = async () => {
    if (!isClient || !('serviceWorker' in navigator)) return null;
    if (regPromise) return regPromise;
    // public/ is served from site root in Nuxt
    regPromise = navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => null);
    return regPromise;
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isClient) return 'default';
    if (!isSupported()) throw new Error('Notifications are not supported on this browser/device.');
    if (!ensureSecure()) throw new Error('Notifications require HTTPS or localhost.');
    if (isiOS() && !isStandalone()) {
      throw new Error('On iOS, add this app to the Home Screen and open it from there to enable notifications.');
    }
    if (Notification.permission === 'granted') return 'granted';
    const result = await Notification.requestPermission();
    if (result !== 'granted') throw new Error('Notification permission not granted.');
    return result;
  };

  const sendNotification = async (title: string, options: NotifyOptions = {}) => {
    if (!isClient) return;
    if (!isSupported()) throw new Error('Notifications are not supported on this browser/device.');
    if (!ensureSecure()) throw new Error('Notifications require HTTPS or localhost.');

    // Ensure SW is ready
    const reg = await registerSW();
    await navigator.serviceWorker.ready;

    // Ensure permission
    if (Notification.permission !== 'granted') {
      await requestPermission();
    }

    const defaults: NotifyOptions = {
      body: '',
      icon: '/4Logo.png',
      badge: '/4Logo.png',
      tag: 'app-general',
      renotify: false,
      requireInteraction: false,
      data: { url: '/', ...(options.data || {}) },
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    const payload = { ...defaults, ...options, data: { ...defaults.data, ...(options.data || {}) } };

    // Prefer SW notification API; fallback to window Notification if needed
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, payload);
    } else if ('Notification' in window) {
      // Fallback (click handling is limited)
      const n = new Notification(title, payload);
      n.onclick = () => window.open(payload.data?.url || '/', '_self');
    } else {
      throw new Error('No available notification API.');
    }
  };

  return {
    isSupported,
    requestPermission,
    sendNotification,
    registerSW, // optional: call on app mount to pre-register
  };
};
