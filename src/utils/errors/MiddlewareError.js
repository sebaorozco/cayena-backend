import EnumsError from "./EnumsError.js";

export default (error, req, res, next) => {
    console.log('El error es: ', error.cause)
    switch (error.code) {
        case EnumsError.INVALID_TYPES_ERROR:
        res.status(400).send({ status: 'error', error: error.title })
        break;
        case EnumsError.INVALID_PARAM_ERROR:
        res.status(400).send({ status: 'error', error: error.title })
        break;
        case EnumsError.DATABASE_ERROR:
        res.status(500).send({ status: 'error', error: error.title })
        break;
        default:
        res.send({ status: 'error', error: 'Unhandled error' })
    }
}