
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "@/lib/store";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({
  children,
}: StoreProviderProps) {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    setStore(makeStore());
  }, []);

  if (!store) {
    return null;
  }

  return <Provider store={store}>{children}</Provider>;
}
