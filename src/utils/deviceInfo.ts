
const DEVICE_ID_KEY = "uam_device_id";

function generateDeviceId(): string {
  return crypto.randomUUID();
}

function getBrowserName(): string {
  const ua = navigator.userAgent;

  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/")) return "Opera";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/")) return "Safari";

  return "Unknown Browser";
}

function getOperatingSystem(): string {
  const ua = navigator.userAgent;

  if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";

  return "Unknown OS";
}

function getDeviceType(): string {
  const ua = navigator.userAgent;

  if (/iPad|Tablet/i.test(ua)) return "Tablet";

  if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    return "Mobile";
  }

  return "Desktop";
}

export function getDeviceInfo() {
  if (typeof window === "undefined") {
    throw new Error(
      "Device information is only available in the browser.",
    );
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  const browser = getBrowserName();
  const os = getOperatingSystem();
  const deviceType = getDeviceType();

  return {
    deviceId,
    deviceName: `${browser} on ${os} • ${deviceType} • Device ID: ${deviceId}`,
    browser,
    operatingSystem: os,
    deviceType,
  };
}
