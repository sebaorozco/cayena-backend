import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    db: {
        mongodb: process.env.MONGODB_URI
    }, 
    auth: {
        github_clientID: process.env.GITHUB_CLIENT_ID,
        github_clientSecret: process.env.GITHUB_CLIENT_SECRET,
        github_callbackURL: process.env.GITHUB_CALLBACK,
        JWT_secretOrKey: process.env.JWT_SECRET
    }
}