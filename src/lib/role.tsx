import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role } from "@/types/domain";
import { getSession, setSessionRole, subscribeSession } from "@/lib/stores/session-store";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  userId: string;
  userName: string;
};

const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState(getSession());

  useEffect(() => {
    return subscribeSession(() => {
      setSessionState(getSession());
    });
  }, []);

  const handleSetRole = (newRole: Role) => {
    setSessionRole(newRole);
  };

  return (
    <RoleContext.Provider
      value={{
        role: session.role,
        setRole: handleSetRole,
        userId: session.memberId,
        userName: "Pst. D. Okafor",
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const c = useContext(RoleContext);
  if (!c) throw new Error("useRole must be used within RoleProvider");
  return c;
}

export { ROLES } from "@/types/domain";
export type { Role };
