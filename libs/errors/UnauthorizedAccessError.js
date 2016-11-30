"use strict";
function UnauthorizedAccessError(code, error) {
    var err = Error.call(this, error.message);
    Error.captureStackTrace(this, this.constructor);
    err.name = "UnauthorizedAccessError";
    err.message = error.message;
    err.code = code;
    err.status = 401;
    err.inner = error;
}

UnauthorizedAccessError.prototype = Object.create(Error.prototype);
UnauthorizedAccessError.prototype.constructor = UnauthorizedAccessError;

module.exports = UnauthorizedAccessError;