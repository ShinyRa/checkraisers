"use strict";
exports.__esModule = true;
exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["SUCCESS"] = 200] = "SUCCESS";
    HttpCode[HttpCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCode[HttpCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    HttpCode[HttpCode["CREATED"] = 201] = "CREATED";
    HttpCode[HttpCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpCode[HttpCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCode[HttpCode["UNSUPPORTED_MEDIA"] = 415] = "UNSUPPORTED_MEDIA";
    HttpCode[HttpCode["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
    HttpCode[HttpCode["TEAPOT"] = 418] = "TEAPOT";
    HttpCode[HttpCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
})(HttpCode = exports.HttpCode || (exports.HttpCode = {}));
