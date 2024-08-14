import { Product } from "./product.model.js";
import { Purchase } from "./purchase.model.js";
import { PurchasedProduct } from "./purchased-product.model.js";
import { Role } from "./role.model.js";
import { User } from "./user.model.js";

export function defineRelations() {
  // Una compra consta de muchos productos comprados
  Purchase.hasMany(PurchasedProduct);
  PurchasedProduct.belongsTo(Purchase);

  // Un producto comprado referencia un producto
  PurchasedProduct.belongsTo(Product);
  // Un mismo producto puede comprarse varias veces
  Product.hasMany(PurchasedProduct);

  // Un usuario pertenece a un rol
  Role.belongsTo(Role);
  // A un rol pertenecen varios usuarios
  Role.hasMany(User);

  // Un usuario (vendedor) tiene varios productos
  User.hasMany(Product);
  // Un producto pertenece a un usuario,
  // su vendedor
  Product.belongsTo(User);
}
