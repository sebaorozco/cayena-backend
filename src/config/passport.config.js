import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { UsersModel } from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils/index.js";

const initPassport = () => {
    const options = {
        usernameField: 'email',
        passReqToCallback: true
    }

    passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
                
        const {first_name, last_name, age} = req.body;
        if(!first_name || !last_name || !age){
            
            return done(new Error ('Debe completar todos los campos!'))
        }
    
        try {
            const user = await UsersModel.findOne({ email });
            if(user){
                console.log('User already register.')
                return done(null, false);
            } 
            
            const userInfo = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            
            await UserManagerDAO.createUser(userInfo);

            done(null, false);

        } catch (error) {
            return done(new Error ('Error al obtener el usuario', error.message));
        }
    
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        
        try {
            const user = await UsersModel.findOne({ email });
            
            if(!user){
                return done(null, false)
            }
    
            if(!validatePassword(password, user)){
                return done(null, false)
            }
    
            done(null, user);
            
        } catch (error) {
            return done(new Error ('Error al obtener el usuario', error.message));
        }
    }))

    // Configuro para acceder por GITHUB
    const githubOptions = {
        clientID: 'Iv1.2e6763d52cc95cb5',
        clientSecret: '9a963e30652f81b2b728ffa253d33ada4fd40250',
        callbackURL: "http://localhost:8080/api/sessions/github/callback"
    }
    
    passport.use('github', new GithubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
        
        try {
            console.log('profile', profile);
            let user = await UsersModel.findOne({ email: profile._json.email });
            
            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 18,
                    password: ''
                }
                let result = await UsersModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
    
        } catch (error) {
            return done(new Error ('Error al obtener el usuario', error.message));
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UsersModel.findById(id);
        done(null, user);
    })
}

export default initPassport;


/*
    Owned by: @sebaorozco
    
    App ID: 324575
    
    Client ID: Iv1.2e6763d52cc95cb5 
    
    client secret: 9a963e30652f81b2b728ffa253d33ada4fd40250 
*/