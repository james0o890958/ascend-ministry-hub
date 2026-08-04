import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role } from "@/types/domain";
import { getSession, setSessionRole, subscribeSession } from "@/lib/stores/session-store";
import { getMemberById, subscribeMembers } from "@/lib/stores/members-store";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  userId: string;
  userName: string;
};

const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState(getSession());
  const [member, setMemberState] = useState(() => getMemberById(session.memberId));

  useEffect(() => {
    const unsubSession = subscribeSession(() => {
      const s = getSession();
      setSessionState(s);
      setMemberState(getMemberById(s.memberId));
    });
    const unsubMembers = subscribeMembers(() => {
      const s = getSession();
      setMemberState(getMemberById(s.memberId));
    });
    return () => {
      unsubSession();
      unsubMembers();
    };
  }, [session.memberId]);

  const handleSetRole = (newRole: Role) => {
    setSessionRole(newRole);
  };

  const userName = member ? member.name : "Pst. D. Okafor";

  return (
    <RoleContext.Provider
      value={{
        role: session.role,
        setRole: handleSetRole,
        userId: session.memberId,
        userName,
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
