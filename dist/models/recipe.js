"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
});
const Recipe = (0, mongoose_1.model)("Recipe", recipeSchema);
exports.default = Recipe;
