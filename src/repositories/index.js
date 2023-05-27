import { UserManagerDAO } from "../dao/factory.js";
import UserRepository from "./users.repository.js";

export const userRepository = new UserRepository(new UserManagerDAO());