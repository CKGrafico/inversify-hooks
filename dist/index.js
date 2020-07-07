"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = exports.setContainer = exports.container = exports.mockTransient = exports.mockSingleton = exports.mockRequest = exports.resetContainer = exports.cid = exports.Container = exports.injectable = exports.inject = exports.Inject = exports.useInject = void 0;
var inversify_props_1 = require("inversify-props");
Object.defineProperty(exports, "cid", { enumerable: true, get: function () { return inversify_props_1.cid; } });
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return inversify_props_1.Container; } });
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return inversify_props_1.container; } });
Object.defineProperty(exports, "getContainer", { enumerable: true, get: function () { return inversify_props_1.getContainer; } });
Object.defineProperty(exports, "Inject", { enumerable: true, get: function () { return inversify_props_1.Inject; } });
Object.defineProperty(exports, "inject", { enumerable: true, get: function () { return inversify_props_1.inject; } });
Object.defineProperty(exports, "injectable", { enumerable: true, get: function () { return inversify_props_1.injectable; } });
Object.defineProperty(exports, "mockRequest", { enumerable: true, get: function () { return inversify_props_1.mockRequest; } });
Object.defineProperty(exports, "mockSingleton", { enumerable: true, get: function () { return inversify_props_1.mockSingleton; } });
Object.defineProperty(exports, "mockTransient", { enumerable: true, get: function () { return inversify_props_1.mockTransient; } });
Object.defineProperty(exports, "resetContainer", { enumerable: true, get: function () { return inversify_props_1.resetContainer; } });
Object.defineProperty(exports, "setContainer", { enumerable: true, get: function () { return inversify_props_1.setContainer; } });
function useInject(id) {
    return [inversify_props_1.getContainer().get(id)];
}
exports.useInject = useInject;
//# sourceMappingURL=index.js.map