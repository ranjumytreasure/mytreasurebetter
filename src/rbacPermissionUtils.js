import rbacData from '../src/rbac.json'

export const hasPermission = (role, permission) => {
    return rbacData.roles[role] && rbacData.roles[role].includes(permission);
};