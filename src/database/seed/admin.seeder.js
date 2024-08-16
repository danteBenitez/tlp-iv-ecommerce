import { ROLES } from "../../consts/roles.js";
import { Role } from "../../models/role.model.js";
import { User } from "../../models/user.model.js";
import { encryptionService } from "../../services/encryption.service.js";

export async function seedAdmin() {
    const adminRole = await Role.findOne({
        where: {
            name: ROLES.ADMIN
        }
    });

    if (!adminRole) {
        throw new Error("Rol de administrador faltante. Sincronice la base de datos");
    }

    const adminUser = await User.findOrCreate({
        where: {
            role_id: adminRole.role_id
        },
        defaults: {
            username: "admin",
            email: "admin@example.com",
            password: await encryptionService.encrypt("admin"),
            role_id: 1
        }
    });

    return adminUser;
}