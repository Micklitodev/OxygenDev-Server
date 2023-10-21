"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../config/connection"));
const models_1 = require("../models");
const userdata_json_1 = __importDefault(require("./userdata.json"));
const pkgdata_json_1 = __importDefault(require("./pkgdata.json"));
connection_1.default.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.User.insertMany(userdata_json_1.default);
    yield models_1.Pkg.insertMany(pkgdata_json_1.default);
    console.log("all done!");
    process.exit(0);
}));
