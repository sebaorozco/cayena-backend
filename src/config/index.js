import dotenv from 'dotenv';

const environment = "DEVELOPMENT";

dotenv.config({
    path: environment === 'DEVELOPMENT' ? '.env.development' : '.env.production'
});

export default {
    port: process.env.PORT || 3000,
    db: {
        mongodb: process.env.MONGODB_URI,
        mongodbtest: process.env.MONGODB_URI_TEST
    }, 
    auth: {
        github_clientID: process.env.GITHUB_CLIENT_ID,
        github_clientSecret: process.env.GITHUB_CLIENT_SECRET,
        github_callbackURL: process.env.GITHUB_CALLBACK,
        JWT_secretOrKey: process.env.JWT_SECRET
    },
    persistenceType: process.env.PERSISTENCE_TYPE || 'memory',
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS
    }
}