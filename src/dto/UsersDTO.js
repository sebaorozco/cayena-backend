import { createHash } from "../utils/index.js";

export default class UserDTO {
    constructor(user){
        this.name = user.first_name + ' ' + user.last_name; 
        this.email = user.email;
        this.age = user.age;
        this.password = createHash(user.password);
        this.role = user.role;
        this.cart = user.cart;
    }
}

// Clase UserBasicDTO que excluye los campos password y age.
export class UserBasicDTO {
    constructor(user){
        this.name = user.name; 
        this.email = user.email;
        this.role = user.role;
        this.userId = user._id;
    }
}