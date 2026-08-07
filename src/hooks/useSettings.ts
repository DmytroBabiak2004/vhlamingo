import { useCallback, useEffect, useState } from "react";
import { AppSettings } from "@/types";
import { getSettings, saveSettings } from "@/storage/storage";

const DEFAULTS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: "dark",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getSettings().then((s) => {
      if (isMounted) {
        setSettings(s);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next).catch(() => undefined);
      return next;
    });
  }, []);

  return { settings, isLoading, update };
}
