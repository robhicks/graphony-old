# Conflict Resolution


 # Security

 There are protected graph paths. Only authenticated users with proper rights can access them with once and on. They include:

 - root
 - system
 - users

 Other paths are restricted to their owners, or other users that the owner gives permission. 

 Each user has a user object. Until a user creates an account, the user has an anonymous account. 

 users.login 
 users.createAccount 


 When the server starts, it uses whatever is in .env for a private key and generates a public key

 When the client starts, it has available to it the public key from the server 

 If the public key is not available in the client because a server was not configured and started, 
 the client runs in a headless mode. It cannot be used to create users or add listeners for root, system or users. It has an anonymous user but is 
 running headless, which means it is only useful for persisting data in the client where it is running.

 Need to project against:
 - user data in browser being stolen by someone else who has access to browser
 - users accessing data from the server (or other node) when they don't have rights


 Here are some thoughts. When a user first authenticates, we can store a hash of the user's username and password. 



 We can use this hash to authenticate a user who is offline. We just have the user log in again, generate the hash and compare it with stored hash. 

 # synchronization

 All nodes register a listener on a server. 

 Each emmit triggers a update of the corresponding node on a server. If the user making the update request has sufficient rights, updating a node causes the node to write to the database. The database for the client is IndexedDB and can be any database supported by an adapter on a server. 

 Servers can be started with a list of other servers. 

 Conflicts are resolved by a server. 
  - compare timestamps and assign weights
  - compare users and assign weights
  - compare types and assign weights
  - compare sizes and assign weights

 Use Brain.js to resolve conflicts. 


