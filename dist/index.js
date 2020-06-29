"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_props_1 = require("inversify-props");
exports.cid = inversify_props_1.cid;
exports.Container = inversify_props_1.Container;
exports.container = inversify_props_1.container;
exports.getContainer = inversify_props_1.getContainer;
exports.Inject = inversify_props_1.Inject;
exports.inject = inversify_props_1.inject;
exports.injectable = inversify_props_1.injectable;
exports.mockRequest = inversify_props_1.mockRequest;
exports.mockSingleton = inversify_props_1.mockSingleton;
exports.mockTransient = inversify_props_1.mockTransient;
exports.resetContainer = inversify_props_1.resetContainer;
exports.setContainer = inversify_props_1.setContainer;
function useInject(id) {
    return [inversify_props_1.getContainer().get(id)];
}
exports.useInject = useInject;
//# sourceMappingURL=index.js.map