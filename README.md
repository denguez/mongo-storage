# mongo-storage
Simple storage API with authentication

# Setup
- Clone repository 

	`git clone https://github.com/j-zumaran/mongo-storage.git`
- Create .env file for docker-composer. See [example](example.env).
- Run project with 

	` docker-compose up --build`

# How it works
- Application is initialized with an admin user using credentials from `.env` file.
- There is a simple authentication system implemented with passport.js. All endpoints are protected except for `/login`.
- You can perform CRUD operations with two types of data: 
	- Object: Generic data. Has fields 'name'(required) and 'data' which can be any JSON object.
	- Contact: Used to store contact information. Fields: 'name', 'email' and 'message'.
- In order to start using the endpoints one must first login with Admin and create user tokens. These tokens are auto-generated and work as normal user objects. You can authenticate with them and access the endpoints to perform operations.

# Endpoints
## Authentication
| Name | Method  | Body | Description
|---|---|---|---|
|`/login`|  POST | {username, password} | Login and return user |
|`/logout`| POST | - | Logout, destroy session and cookie |

## Admin
| Name | Method  | Path parameters | Description
|---|---|---|---|
|`/tokens`|  GET | - | Retrieves all created tokens |
|`/token`| POST | - | Randomly generates user token |
|`/token/delete/:id`| POST | Token id | Deletes token by id |
|`/objects/all`|  GET | - | Retrieves all created objects from all users |
|`/contacts/all`|  GET | - | Retrieves all created contacts from all users |

## Database operations
These operations are done within the current logged user context.

#### Objects

| Name | Method  | Path parameters | Body | Description
|---|---|---|---|---|
|`/objects`|  GET | - | - | Retrieves all created objects |
|`/object`| POST | - | {name,data} | Creates new object |
|`/object/:id`|  GET | Object id | - | Retrieves object by id |
|`/object/:id`| PUT | Object id | {name,data} | Updates object by id |
|`/object/:id`|  DELETE | Object id | - | Deletes object by id |

#### Contacts

| Name | Method  | Path parameters | Body | Description
|---|---|---|---|---|
|`/contacts`|  GET | - | - | Retrieves all created contacts |
|`/contact`| POST | - | {name,email,message} | Creates new contact |
|`/contact/:id`|  GET | Object id | - | Retrieves contact by id |
|`/contact/:id`| PUT | Object id | {name,email,message} | Updates contact by id |
|`/contact/:id`|  DELETE | Object id | - | Deletes contact by id |



