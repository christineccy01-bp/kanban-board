"use client";

import { useSyncExternalStore } from "react";
import { Switch } from "radix-ui";
import { useTheme } from "next-themes";

const noopSubscribe = () => () => {};

const DarkModeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  
  // The theme is unknown during SSR, so only reflect it once hydrated
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return (
    <div className="flex items-center">
      <label
        id="dark-mode-label"
        htmlFor="dark-mode"
        className="pr-2 text-sm leading-none text-black dark:text-white"
      >
        Dark mode
      </label>
      <Switch.Root
        className="relative h-[25px] w-[42px] cursor-pointer rounded-full bg-slate-300 data-[state=checked]:bg-neutral-600"
        id="dark-mode"
        checked={isHydrated && resolvedTheme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      >
        <Switch.Thumb
          id="dark-mode"
          aria-labelledby="dark-mode-label"
          className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"
        />
      </Switch.Root>
    </div>
  );
};

export default DarkModeSwitch;
