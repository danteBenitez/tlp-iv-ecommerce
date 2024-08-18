import { ROLES } from "../../consts/roles.js";
import { Role } from "../../models/role.model.js";
import { UserRole } from "../../models/user-roles.model.js";
import { User } from "../../models/user.model.js";
import { encryptionService } from "../../services/encryption.service.js";

export async function seedAdmin() {
  const adminRole = await Role.findOne({
    where: {
      name: ROLES.ADMIN,
    },
  });

  if (!adminRole) {
    throw new Error(
      "Rol de administrador faltante. Sincronice la base de datos"
    );
  }

  const adminUser = await UserRole.findOne({
    where: {
      role_id: adminRole.role_id,
    },
  });

  if (!adminUser) {
    // Si no hay usuario con el rol de administrador,
    // creamos uno génerico.
    const user = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: await encryptionService.encrypt("admin"),
    });
    // Y le añadimos el rol correspondiente.
    user.addRole(adminRole);
  }

  return adminUser;
}
