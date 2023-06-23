class Exception extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}
  
export default Exception;

/* export default class Exception extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}
 
export class NotFoundException extends Exception {
    constructor(message = 'Not Found Resource') {
        super(message, 404);
    }
}

export class BadRequestException extends Exception {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
} */