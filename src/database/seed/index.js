import { seedRoles } from "./roles.seeder.js";

export async function seedDatabase() {
    return Promise.all([seedRoles()]);
}