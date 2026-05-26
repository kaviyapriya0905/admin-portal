export const getUserRoleName = (user: any): string | undefined => {
  if (!user) return undefined;
  if (user.email === "company-admin@gwcdata.ai") return "company-admin";
  const role = user.role || user.Role;
  if (typeof role === "string") return role;
  return (
    role?.name || role?.role_name || role?.roleName || role?.role || undefined
  );
};

export const formatRoleName = (roleStr?: string): string => {
  if (!roleStr) return "Admin";
  return roleStr
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Company Admin — top-level admin who manages the entire network of temples.
 * Has full access: onboard temples, onboard admins, view everything.
 */
export const isCompanyAdminRole = (user: any): boolean => {
  if (!user) return false;
  if (user.email === "company-admin@gwcdata.ai") return true;

  const roleName = getUserRoleName(user)?.toLowerCase() || "";
  return roleName === "company-admin";
};

/**
 * Temple Admin (Super Admin) - manages a specific temple.
 * Can manage admins within their temple but cannot onboard new temples.
 */
export const isTempleAdminRole = (user: any): boolean => {
  const roleName = getUserRoleName(user)?.toLowerCase();
  return roleName === "temple-admin";
};

/**
 * isAdminManagerRole — any role that can manage admins (both company-admin and temple-admin).
 */
export const isAdminManagerRole = (user: any): boolean => {
  return isCompanyAdminRole(user) || isTempleAdminRole(user);
};
