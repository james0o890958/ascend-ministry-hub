import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Admin" | "Pastor" | "Cell Leader" | "Member";
export const ROLES: Role[] = ["Admin", "Pastor", "Cell Leader", "Member"];

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  userId: string;
  userName: string;
};

const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Admin");
  return (
    <RoleContext.Provider value={{ role, setRole, userId: "m1000", userName: "Pst. D. Okafor" }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const c = useContext(RoleContext);
  if (!c) throw new Error("useRole must be used within RoleProvider");
  return c;
}
