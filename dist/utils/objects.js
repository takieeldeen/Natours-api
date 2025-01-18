"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterObject = void 0;
const filterObject = (obj, ...keys) => {
    const filteredObject = {};
    keys === null || keys === void 0 ? void 0 : keys.forEach((key) => {
        if (obj[key])
            filteredObject[key] = obj[key];
    });
    return filteredObject;
};
exports.filterObject = filterObject;
//# sourceMappingURL=objects.js.map