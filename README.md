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
