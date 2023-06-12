import winston from 'winston';

const env = process.env.NODE_ENV || 'development';

const options = {}

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 6
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'  
    }
}
options.levels = customLevelOptions.levels;
if(env === 'production'){
    options.transports = [
        new winston.transports.Console ({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File ({ 
            level: 'error', 
            filename: './logs/error.log', 
            format: winston.format.simple()
        })
    ]
} else {
    options.transports = [
        new winston.transports.Console ({ 
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            ) 
        })
    ]
}

const logger = winston.createLogger(options);

logger.info(`NODE_ENV=${env}`)

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.debug(` ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
} 