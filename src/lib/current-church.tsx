import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Branch } from "@/types/domain";
import { getBranches, subscribeBranches } from "@/lib/stores/branches-store";
import { getSession, setSessionBranch, subscribeSession } from "@/lib/stores/session-store";

type Ctx = {
  currentChurchId: string;
  setCurrentChurchId: (id: string) => void;
  current: Branch;
  branchesList: Branch[];
};

const C = createContext<Ctx | null>(null);

export function CurrentChurchProvider({ children }: { children: ReactNode }) {
  const [branchesList, setBranchesList] = useState<Branch[]>(getBranches());
  const [session, setSessionState] = useState(getSession());

  useEffect(() => {
    const unsubB = subscribeBranches(() => setBranchesList(getBranches()));
    const unsubS = subscribeSession(() => setSessionState(getSession()));
    return () => {
      unsubB();
      unsubS();
    };
  }, []);

  const currentBranch =
    branchesList.find((b) => b.id === session.branch || b.name === session.branch) ||
    branchesList[0];

  const handleSetCurrentChurchId = (idOrName: string) => {
    const target = branchesList.find((b) => b.id === idOrName || b.name === idOrName);
    if (target) {
      setSessionBranch(target.name);
    } else {
      setSessionBranch(idOrName);
    }
  };

  return (
    <C.Provider
      value={{
        currentChurchId: currentBranch?.id || "b1",
        setCurrentChurchId: handleSetCurrentChurchId,
        current: currentBranch,
        branchesList,
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useCurrentChurch() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useCurrentChurch must be inside CurrentChurchProvider");
  return ctx;
}
