import config from "../config/index.js";
import { dbConnect } from '../db/mongodb.js';

export let CartManagerDAO;
export let ChatManagerDAO;
export let ProductManagerDAO;
export let UserManagerDAO;

switch (config.persistenceType) {
    case 'mongodb':
        // Me conecto a la BD
        dbConnect();
        CartManagerDAO = (await import('./mongoManagers/CartManagerDAO.js')).default;
        ChatManagerDAO = (await import('./mongoManagers/ChatManagerDAO.js')).default;    
        ProductManagerDAO = (await import('./mongoManagers/ProductManagerDAO.js')).default;
        UserManagerDAO = (await import('./mongoManagers/UserManagerDAO.js')).default;
        break;

    case 'file':
        CartManagerDAO = (await import('./fsManagers/CartManager.js')).default;
        ProductManagerDAO = (await import('./fsManagers/ProductManager.js')).default;
        break;

    default:
        CartManagerDAO = (await import('./memoryManagers/CartMemory.js')).default;
        ProductManagerDAO = (await import('./memoryManagers/ProductMemory.js')).default;
        UserManagerDAO = (await import('./memoryManagers/UserMemory.js')).default;
}