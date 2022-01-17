"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`Server Running on PORT: ${port}.`);
});
//# sourceMappingURL=index.js.map