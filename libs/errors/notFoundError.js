function notFoundError(code, error) {
    var err = Error.call(this, typeof error === "undefined" ? undefined : error.message);
    var stack = Error.captureStackTrace(this, this.constructor);
    err.name = "NotFoundError";
    err.message = typeof error === "undefined" ? undefined : error.message;
    err.code = typeof code === "undefined" ? "404" : code;
    err.status = 404;
    err.inner = error;
}

notFoundError.prototype = Object.create(Error.prototype);
notFoundError.prototype.constructor = notFoundError;

module.exports = notFoundError;