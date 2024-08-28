export const ROLES = {
    ADMIN: "admin",
    SELLER: "seller",
    BUYER: "buyer"
}

/** Roles permitidos a ser asignados a usuarios no administradores */
export const ALLOWED_ROLES = [ROLES.SELLER, ROLES.BUYER];

/** Roles permitidos a ser asignados por administradores */
export const ADMIN_ALLOWED_ROLES = [ROLES.SELLER, ROLES.BUYER, ROLES.ADMIN];