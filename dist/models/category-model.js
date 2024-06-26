"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    description: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, { _id, ...rest }) => ({
            id: _id,
            ...rest
        })
    },
    versionKey: '__v'
});
const categoryModel = (0, mongoose_1.model)('Category', categorySchema);
exports.default = categoryModel;
