Autor: Ing. Martin Acosta - 2020
# WChallenge Cryptocurrencies
## Descripción 🗒
API desarrollada a modo de wrapper de [CoinGecko](https://www.coingecko.com/en/api) con persistencia de datos. Permite el registro e ingreso de usuarios, añadir criptmonedas de interés y obtener las cotizaciones en distintas monedas, ordenadas de manera ascendente o descendente.
|            Endpoint           | Método |                  Datos Enviados                  | Datos Devueltos                                           |
|:-----------------------------|--------|:------------------------------------------------:|-----------------------------------------------------------|
| /register                     | POST   | { nombre, apellido, username, password, moneda } | { msg }                                                   |
| /login                        | POST   |              { username, password }              | { token }                                                   |
| /coins/list-all           | GET    |                         -                        | { symbol,  current_price,  name,  image: { thumb, small, large },  last_updated  } |
| /coins/add                | POST   |            { criptomoneda }            | { msg }                                                   |
| /coins/list-user  | GET    |                         -                        | { symbol,  current_price: { ars, usd, eur },  name,  image: { thumb, small, large },  last_updated  } |
---
## Endpoints
### /register
Mediante este endpoint se puede registrar un nuevo usuario en el sistema. Devuelve un mensaje con la confirmación o el rechazo de la solicitud. Utilizando el método POST se debe envíar todos los datos requeridos:
- **Nombre**: El nombre del usuario a registrar
- **Apellido**: El apellido del usuario a registrar
- **Username**: El username no debe existir previamente en el sistema
- **Password**: La contraseña de acceso debe tener al menos 8 caracteres alfanuméricos
- **Moneda**: La moneda preferida del usuario para cotizaciones. Las opciones posibles son AR$ ('ars'), US$ ('usd') y € ('eur')
### /login
Mediante este endpoint se realiza la verificación de las credenciales de usuario. En caso de tratarse de credenciales válidas devuelve un token de acceso o en caso contrario devuelve un mensaje de error. Utilizando el método POST se debe enviar:
- **Username**
- **Password**
### /coins/list-all
Mediante una petición GET a este endpoint se obtiene el listado con todas las criptomonedas disponibles. Para obtener una respuesta válida es necesario contar con un token de acceso. Los datos de cada criptomoneda son:
- Símbolo
- Precio en la moneda preferida por el usuario
- Nombre
- Imagen
    - Miniatura
    - Pequeño
    - Grande
- Fecha de la última actualización
### /coins/add
Envíando una petición del tipo POST a este endpoint es posible añadir una criptmoneda al usuario, almacenando la relación en la DB si la divisa es válida y no fue añadida previamente por el usuario. En caso de tratarse de una criptmoneda válida, devuelve la confirmación de la operación. En caso contrario devuelve un mensaje de error. Para realizar esta operación es necesario contar con un token de acceso y enviar el dato:
- Criptmoneda
### /coins/list-user
Este endpoint devuelve el listado de las criptomonedas añadidas por el usuario, cotizadas en AR$, US$ y €. Mediante el parámetro **orden** (el cual puede tomar el valor *1* o *-1*) se obtiene la lista ordenada de manera ascendente o descendente con respecto a la cotización en la moneda preferida por el usuario. Para obtener una respuesta válida se debe contar con un token de acceso o en caso contrario devuelve un mensaje de error. Los datos de cada criptomoneda obtenidos son:
- Símbolo
- Precio
    - AR$
    - US$
    - € 
- Nombre
- Imagen
    - Miniatura
    - Pequeño
    - Grande
- Fecha de la última actualización
---
## Requisitos 🗂 
Para correr la API se debe contar con una instalación de [NodeJS](https://nodejs.org/), [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/install/).

---
## Ejecución 🚀
Para correr la API se debe clonar o descargar el repositorio
```sh
git clone https://github.com/javosmar/wolox_coingecko
```
Luego se deben instalar las dependencias necesarias para levantar la API
```sh
cd wolox_coingecko
npm install
```
Una vez terminada la instalación de dependiencias se debe correr Docker Compose para levantar los contenedores necesarios
```sh
docker-compose up -d
```
---
## Tests 📝
Para correr los tests se debe ejecutar el siguiente comando:
```sh
npm test
```
---
## URL 🔗
Para interactuar con la API se deben realizar las peticiones en la siguiente URL:
```sh
http://localhost:8000/api
```
---
## Terminar la ejecución ⏹
Para detener la aplicación se deben detener los contenedores con el siguiente comando:
```sh
docker-compose down
```
---
## Desarrollado con 🛠️
* [NodeJS](https://nodejs.org/)
* [Express](https://www.expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Docker](https://www.docker.com/)
* [Passport](http://www.passportjs.org/)
* [BCrypt](https://www.npmjs.com/package/bcryptjs)
* [CoinGecko](https://www.coingecko.com/en/api)
* [JWT](https://jwt.io/)
* [Axios](https://www.npmjs.com/package/axios)
* [Chai](https://www.chaijs.com/)

---
## Contribuir 🖇️
Para contribuir realizar un pull request con las sugerencias.

---
## Licencia 📄
GPL
