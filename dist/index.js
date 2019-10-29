"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_props_1 = require("inversify-props");
exports.cid = inversify_props_1.cid;
exports.container = inversify_props_1.container;
exports.Container = inversify_props_1.Container;
exports.Inject = inversify_props_1.Inject;
exports.inject = inversify_props_1.inject;
exports.injectable = inversify_props_1.injectable;
function useInject(id) {
    return [inversify_props_1.container.get(id)];
}
exports.useInject = useInject;
//# sourceMappingURL=index.js.map