import { seedAdmin } from "./admin.seeder.js";
import { seedRoles } from "./roles.seeder.js";

export async function seedDatabase() {
    await seedRoles();
    await seedAdmin();
}