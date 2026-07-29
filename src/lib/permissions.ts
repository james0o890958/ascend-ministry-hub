import { Role } from "@/types/domain";

export function canSwitchBranch(role: Role): boolean {
  return role === "Admin";
}

export function canCreateBranch(role: Role): boolean {
  return role === "Admin";
}

export function isBranchAdminOrPastor(role: Role): boolean {
  return role === "Admin" || role === "Branch Admin" || role === "Pastor";
}

export function canAssignRoles(role: Role, userBranch: string, targetBranch: string): boolean {
  if (role === "Admin") return true;
  if (role === "Branch Admin" || role === "Pastor") {
    return userBranch === targetBranch;
  }
  return false;
}

export function allowedAssignableRoles(role: Role): Role[] {
  if (role === "Admin") {
    return ["Admin", "Branch Admin", "Pastor", "PCF Leader", "Cell Leader", "Member"];
  }
  if (role === "Branch Admin" || role === "Pastor") {
    // Cannot promote anyone to Admin or assign across branches
    return ["Branch Admin", "Pastor", "PCF Leader", "Cell Leader", "Member"];
  }
  return [];
}

export function canConfigureBranch(role: Role, userBranch: string, targetBranch: string): boolean {
  if (role === "Admin") return true;
  if (role === "Branch Admin" || role === "Pastor") {
    return userBranch === targetBranch;
  }
  return false;
}

export function canManageCells(role: Role, userBranch: string, targetBranch: string): boolean {
  if (role === "Admin") return true;
  if (role === "Branch Admin" || role === "Pastor") {
    return userBranch === targetBranch;
  }
  return false;
}

export function canCreateGlobalEvent(role: Role): boolean {
  return role === "Admin";
}

export function canCreateBranchEvent(role: Role, userBranch: string, targetBranch: string): boolean {
  if (role === "Admin") return true;
  if (role === "Branch Admin" || role === "Pastor") {
    return userBranch === targetBranch;
  }
  return false;
}

export function canRecordGiving(role: Role, userBranch: string, targetBranch: string): boolean {
  if (role === "Admin") return true;
  if (role === "Branch Admin" || role === "Pastor") {
    return userBranch === targetBranch;
  }
  return false;
}

export function canAddSoul(_role: Role): boolean {
  // Plain member and above can add and follow up on souls (PO Question 2 confirmed)
  return true;
}

export function canConvertSoul(role: Role, userBranch: string, targetBranch: string): boolean {
  if (role === "Admin") return true;
  if (role === "Branch Admin" || role === "Pastor" || role === "Cell Leader" || role === "PCF Leader") {
    return userBranch === targetBranch;
  }
  return false;
}

export function canSetHigherStartingStage(role: Role): boolean {
  // Cell Leader and above (including Admin, Branch Admin, Pastor) can set starting stage (PO Question 4 confirmed)
  return role === "Admin" || role === "Branch Admin" || role === "Pastor" || role === "PCF Leader" || role === "Cell Leader";
}

export function canConfigureGivingTypes(role: Role): boolean {
  return role === "Admin";
}

export function canViewBranchKPIs(role: Role): boolean {
  return role !== "Member";
}

export function canViewGlobalKPIs(role: Role): boolean {
  return role === "Admin";
}
