"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var HttpCode_1 = require("../../entities/HttpCode");
var BaseDAO_1 = require("../BaseDAO");
var jwt = require("jsonwebtoken");
var UserDAO = /** @class */ (function (_super) {
    __extends(UserDAO, _super);
    function UserDAO() {
        var _this = _super.call(this) || this;
        _this.DEFAULT_AVATAR = 'default.png';
        _this.ASSET_PATH = './static/avatars/';
        _this.DEFAULT_CHIP_AMOUNT = 1000;
        _this.getProfile = function (email) { return __awaiter(_this, void 0, void 0, function () {
            var db, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openDbConnection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCollection('users')];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db
                                .findOne({ email: email }, { projection: { _id: 0, password: 0 } })
                                .then(function (result) {
                                return result ? result : false;
                            })];
                    case 3:
                        user = _a.sent();
                        return [4 /*yield*/, this.closeDbConnection()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        _this.updateAvatar = function (oldAvatar, user) { return __awaiter(_this, void 0, void 0, function () {
            var timePreset, oldAvatarPath, newAvatarPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timePreset = Date.now();
                        oldAvatarPath = "" + this.ASSET_PATH + oldAvatar;
                        newAvatarPath = "" + this.ASSET_PATH + user.email + "_" + timePreset + ".png";
                        return [4 /*yield*/, this.writeToDisk(user.profilePicture, oldAvatar !== this.DEFAULT_AVATAR ? oldAvatarPath : newAvatarPath)];
                    case 1:
                        _a.sent();
                        if (oldAvatar !== this.DEFAULT_AVATAR)
                            this.renameFile(oldAvatarPath, newAvatarPath);
                        return [2 /*return*/, user.email + "_" + timePreset + ".png"];
                }
            });
        }); };
        _this.removeUser = function (email, token) { return __awaiter(_this, void 0, void 0, function () {
            var db, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!this.verifyJWT(token, email)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.openDbConnection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCollection('users')];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db.deleteOne({ email: email })];
                    case 3:
                        res = _a.sent();
                        return [4 /*yield*/, this.closeDbConnection()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, res.deletedCount > 0
                                ? this.httpResponse(HttpCode_1.HttpCode.SUCCESS, { success: 'Deleted the user' })
                                : this.httpResponse(HttpCode_1.HttpCode.BAD_REQUEST, {
                                    error: 'Something went wrong with deleting a user'
                                })];
                    case 5:
                        this.httpResponse(HttpCode_1.HttpCode.UNAUTHORIZED, { error: 'session compromised.' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        console.log('try catch error Register:\n', err_1);
                        return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.SERVER_ERROR, { error: 'User could not be deleted' })];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        _this.updateProfile = function (data, token) { return __awaiter(_this, void 0, void 0, function () {
            var user, _i, _a, pair, db, currentUser, _b, res, err_2;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 12, , 13]);
                        user = void 0;
                        for (_i = 0, _a = data.entries(); _i < _a.length; _i++) {
                            pair = _a[_i];
                            user = __assign(__assign({}, user), (_c = {}, _c[pair[0]] = pair[1], _c));
                        }
                        if (!this.verifyJWT(token, user.email)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.openDbConnection()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.getCollection('users')];
                    case 2:
                        db = _d.sent();
                        return [4 /*yield*/, db.findOne({ email: user.email }).then(function (result) {
                                return result ? result : false;
                            })];
                    case 3:
                        currentUser = _d.sent();
                        if (!currentUser) return [3 /*break*/, 8];
                        if (!user.profilePicture) return [3 /*break*/, 5];
                        _b = user;
                        return [4 /*yield*/, this.updateAvatar(currentUser['profilePicture'], user)];
                    case 4:
                        _b.profilePicture = _d.sent();
                        _d.label = 5;
                    case 5: return [4 /*yield*/, db.findOneAndUpdate({ email: user.email }, { $set: user }, { upsert: false, returnDocument: 'after', projection: { _id: 0, password: 0 } })];
                    case 6:
                        res = _d.sent();
                        return [4 /*yield*/, this.closeDbConnection()];
                    case 7:
                        _d.sent();
                        return [2 /*return*/, res
                                ? this.httpResponse(HttpCode_1.HttpCode.SUCCESS, res)
                                : this.httpResponse(HttpCode_1.HttpCode.BAD_REQUEST, { error: 'could not update user' })];
                    case 8: return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.NOT_FOUND, {
                            error: 'No user found with: ' + user.email
                        })];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        this.httpResponse(HttpCode_1.HttpCode.UNAUTHORIZED, { error: 'session compromised.' });
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_2 = _d.sent();
                        console.log('try catch error updateProfile:\n', err_2);
                        return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.SERVER_ERROR, { error: 'could not update user' })];
                    case 13: return [2 /*return*/];
                }
            });
        }); };
        _this.register = function (user) { return __awaiter(_this, void 0, void 0, function () {
            var db, userPresent, res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.openDbConnection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCollection('users')];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db.findOne({ email: user.email }).then(function (result) {
                                return result ? true : false;
                            })];
                    case 3:
                        userPresent = _a.sent();
                        if (!!userPresent) return [3 /*break*/, 6];
                        user.password = this.hash(user.password);
                        user.chips = this.DEFAULT_CHIP_AMOUNT;
                        user.profilePicture = this.DEFAULT_AVATAR;
                        return [4 /*yield*/, db.insertOne(user)];
                    case 4:
                        res = _a.sent();
                        return [4 /*yield*/, this.closeDbConnection()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, res.acknowledged
                                ? this.httpResponse(HttpCode_1.HttpCode.SUCCESS, { success: 'Created new user' })
                                : this.httpResponse(HttpCode_1.HttpCode.BAD_REQUEST, { error: 'Could not create User' })];
                    case 6: return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.BAD_REQUEST, { error: 'This email already exists' })];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        console.log('try catch error Register:\n', err_3);
                        return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.SERVER_ERROR, { error: 'Could not register user' })];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        _this.login = function (user) { return __awaiter(_this, void 0, void 0, function () {
            var db, token, profile, today, expire, cookieHeader, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.openDbConnection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCollection('users')];
                    case 2:
                        db = _a.sent();
                        user.password = this.hash(user.password);
                        token = jwt.sign({ email: user.email }, 'my-key', { expiresIn: '7d' });
                        return [4 /*yield*/, db
                                .findOne({ email: user.email, password: user.password }, { projection: { _id: 0, password: 0 } })
                                .then(function (result) {
                                return result ? result : false;
                            })];
                    case 3:
                        profile = _a.sent();
                        return [4 /*yield*/, this.closeDbConnection()];
                    case 4:
                        _a.sent();
                        today = new Date();
                        expire = new Date();
                        expire.setTime(today.getTime() + 3600000 * 24 * 7);
                        cookieHeader = { 'set-cookie': "token=" + token + "; Path=/; expires=" + expire + " ;HttpOnly" };
                        return [2 /*return*/, profile
                                ? this.httpResponse(HttpCode_1.HttpCode.SUCCESS, profile, cookieHeader)
                                : this.httpResponse(HttpCode_1.HttpCode.NOT_FOUND, { error: 'Wrong credentials' })];
                    case 5:
                        err_4 = _a.sent();
                        console.log('try catch error Login:\n', err_4);
                        return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.SERVER_ERROR, { error: 'Could not login' })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.logout = function () { return __awaiter(_this, void 0, void 0, function () {
            var cookieHeader;
            return __generator(this, function (_a) {
                try {
                    cookieHeader = {
                        'set-cookie': "token=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                    };
                    return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.SUCCESS, {}, cookieHeader)];
                }
                catch (err) {
                    console.log('try catch error Logout:\n', err);
                    return [2 /*return*/, this.httpResponse(HttpCode_1.HttpCode.SERVER_ERROR, { error: 'Could not logout' })];
                }
                return [2 /*return*/];
            });
        }); };
        return _this;
    }
    return UserDAO;
}(BaseDAO_1["default"]));
exports["default"] = UserDAO;
