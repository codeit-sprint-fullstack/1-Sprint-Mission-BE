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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = asyncHandler;
const client_1 = require("@prisma/client");
function asyncHandler(handler) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield handler(req, res, next);
            }
            catch (e) {
                if (e.name === "ValidationError" ||
                    e instanceof client_1.Prisma.PrismaClientValidationError) {
                    res.status(400).send({ message: e.message });
                }
                else if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    e.code === "P2025") {
                    res.sendStatus(404);
                }
                else {
                    res.status(500).send({ message: e.message });
                }
            }
        });
    };
}
