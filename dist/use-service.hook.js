"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_props_1 = require("inversify-props");
function useContainer(id) {
    return inversify_props_1.container.get(id);
}
exports.useContainer = useContainer;
//# sourceMappingURL=use-service.hook.js.map