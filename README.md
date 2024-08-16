# Taller de lenguaje de programación IV - Clase 05 - Actividad

El presente proyecto consiste en un servidor backend que pretende simular las operaciones de un sitio de e-commerce.
En este modelo, se cuenta con usuarios que pueden ser de dos tipos: _vendedor_ y _comprador_. Los vendedores pueden crear productos, actualizarlos y borrarlos, mientras que los compradores pueden ver los productos y realizar compras. La compra por defecto incluye varios productos en variadas cantidades, y se puede realizar con un método de pago. Esto es lo que podríamos llamar un **carrito de compras**.
Para ello, se implementaron las siguientes rutas:

- _POST /auth/sign-in_ y _POST /auth/sign-up_: Para iniciar sesión y registrarse, respectivamente.
- _GET /products_: Devuelve un listado de productos. Todos los usuarios pueden acceder a esta ruta.
- _GET /products?category=:category_: Devuelve un listado de productos filtrados por categoría. Todos los usuarios pueden acceder a esta ruta.
- _GET /products/:product_id_: Devuelve un producto en particular. Todos los usuarios pueden acceder a esta ruta.
- _POST /products_: Crea un nuevo producto. Solo los usuarios autenticados con el rol de _vendedor_ pueden acceder a esta ruta.
- _PATCH /products/:product_id_: Permite actualizar un producto en particular. Sólo el vendedor que creó un producto puede actualizarlo.
- _DELETE /products/:product_id_: Permite borrar un producto en particular. Sólo el vendedor que creó un producto puede borrarlo.
- _POST /purchase_: Permite realizar una compra de varios productos, pasándole una lista de `product_id` y `amount`, la cantidad de cada uno, así como un método de pago (`payment_method`).

Además, para los usuarios administradores, se cuenta con rutas de manejo de usuarios:

- _GET /users_: Retorna todos los usuarios.
- _GET /users/:user_id_: Retorna un usuario en particular.
- _PATCH /users/:user_id_: Permite actualizar un usuario con datos parciales.
- _DELETE /users/:user_id_: Permite borrar un usuario.

## Instrucciones

- Primero, clone el repositorio de modo local:

```bash
git clone https://github.com/danteBenitez/tlp-iv-ecommerce/
```

- Instale las dependencias:

```bash
npm install
```

- Cree un archivo `.env.dev` o `.env.prod` en la raíz del proyecto, con las siguientes variables de entorno:

```bash
DB_DIALECT=         # Dialecto de la base de datos (Vea https://sequelize.org/docs/v6/getting-started/ por los valores soportados)
DB_HOST=            # Host de la base de datos
DB_PORT=            # Puerto de la base de datos
DB_USER=            # Usuario de la base de datos
DB_PASSWORD=        # Contraseña del usuario
DB_NAME=            # Nombre de la base de datos
PORT=               # Puerto de la aplicación
SALT_ROUNDS=        # Rondas a usar para la encriptación de las contraseñas
JWT_SECRET=         # Secreto para cifrar JWTs
```

Debe completar con los valores correspondientes a su base de datos, y asegurarse que un servidor de base de datos esté ejecutándose al momento de iniciar el servidor.

- Ejecute el servidor en modo desarrollo con:

```bash
npm run dev
```

- Si desea que el servidor se ejecute en modo producción, ejecute:

```bash
npm run start
```