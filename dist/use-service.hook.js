"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var inversify_props_1 = require("inversify-props");
function useContainer(id) {
    var _a = react_1.useState(), dependency = _a[0], setDependency = _a[1];
    react_1.useEffect(function () {
        setDependency(inversify_props_1.container.get(id));
    }, []);
    return [dependency];
}
exports.useContainer = useContainer;
//# sourceMappingURL=use-service.hook.js.map