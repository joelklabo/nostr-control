"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HashSet_1 = require("tstl/container/HashSet");
var HashMap_1 = require("tstl/container/HashMap");
var EventTarget = /** @class */ (function () {
    function EventTarget() {
        this.listeners_ = new HashMap_1.HashMap();
        this.created_at_ = new Date();
    }
    EventTarget.prototype.dispatchEvent = function (event) {
        var e_1, _a;
        // FIND LISTENERS
        var it = this.listeners_.find(event.type);
        if (it.equals(this.listeners_.end()))
            return;
        // SET DEFAULT ARGUMENTS
        event.target = this;
        event.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
            // CALL THE LISTENERS
            for (var _b = __values(it.second), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(event);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    EventTarget.prototype.addEventListener = function (type, listener) {
        var it = this.listeners_.find(type);
        if (it.equals(this.listeners_.end()))
            it = this.listeners_.emplace(type, new HashSet_1.HashSet()).first;
        it.second.insert(listener);
    };
    EventTarget.prototype.removeEventListener = function (type, listener) {
        var it = this.listeners_.find(type);
        if (it.equals(this.listeners_.end()))
            return;
        it.second.erase(listener);
        if (it.second.empty())
            this.listeners_.erase(it);
    };
    return EventTarget;
}());
exports.EventTarget = EventTarget;
//# sourceMappingURL=EventTarget.js.map