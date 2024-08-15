import { Product } from "./product.model.js";
import { Purchase } from "./purchase.model.js";
import { PurchasedProduct } from "./purchased-product.model.js";
import { Role } from "./role.model.js";
import { User } from "./user.model.js";

export function defineRelations() {
  // Una compra consta de muchos productos comprados
  Purchase.hasMany(PurchasedProduct, { foreignKey: "purchase_id" });
  PurchasedProduct.belongsTo(Purchase, { foreignKey: "purchase_id" });

  // Un producto comprado referencia un producto
  PurchasedProduct.belongsTo(Product, { foreignKey: "product_id" });
  // Un mismo producto puede comprarse varias veces
  Product.hasMany(PurchasedProduct, { foreignKey: "product_id" });

  // A un rol pertenecen varios usuarios
  Role.hasMany(User, { foreignKey: "role_id" });
  // Un usuario pertenece a un rol
  Role.belongsTo(Role, { foreignKey: "role_id" });

  // Un usuario (vendedor) tiene varios productos
  User.hasMany(Product, { foreignKey: "seller_id" });
  // Un producto pertenece a un usuario,
  // su vendedor
  Product.belongsTo(User, { foreignKey: "seller_id" });
}
