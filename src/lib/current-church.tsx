import { createContext, useContext, useState, ReactNode } from "react";
import { branches } from "@/lib/data";

type Ctx = {
  currentChurchId: string;
  setCurrentChurchId: (id: string) => void;
  current: typeof branches[number];
};

const C = createContext<Ctx | null>(null);

export function CurrentChurchProvider({ children }: { children: ReactNode }) {
  const [currentChurchId, setCurrentChurchId] = useState(branches[0].id);
  const current = branches.find((b) => b.id === currentChurchId) ?? branches[0];
  return <C.Provider value={{ currentChurchId, setCurrentChurchId, current }}>{children}</C.Provider>;
}

export function useCurrentChurch() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useCurrentChurch must be inside CurrentChurchProvider");
  return ctx;
}
