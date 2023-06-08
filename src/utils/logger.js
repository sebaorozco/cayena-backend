import winston from 'winston';

const env = process.env.NODE_ENV || 'development';

console.log(env)

const options = {}

if(env === 'production'){
    options.transports = [
        new winston.transports.Console ({ level: 'info' }),
        new winston.transports.File ({ filename: './logs/error.log', level: 'error' })
    ]
} else {
    options.transports = [
        new winston.transports.Console ({ level: 'debug' })
    ]
}

const logger = winston.createLogger(options);

logger.info(`NODE_ENV=${env}`)

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.warn(` ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    req.logger.error(` ${req.method} en ${req.url} - Esto fue un error`)
    req.logger.info(` ${req.method} en ${req.url} - Esto fue un info`)
    req.logger.debug(` ${req.method} en ${req.url} - Esto fue un debug`)

    next();
} 