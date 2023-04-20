"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("websocket");
var EventTarget_1 = require("./events/EventTarget");
var Event_1 = require("./events/Event");
var CloseEvent_1 = require("./events/CloseEvent");
var MessageEvent_1 = require("./events/MessageEvent");
var ErrorEvent_1 = require("./events/ErrorEvent");
var WebSocket = /** @class */ (function (_super) {
    __extends(WebSocket, _super);
    /* ----------------------------------------------------------------
        CONSTRUCTORS
    ---------------------------------------------------------------- */
    function WebSocket(url, protocols) {
        var _this = _super.call(this) || this;
        _this.on_ = {};
        _this.state_ = WebSocket.CONNECTING;
        //----
        // CLIENT
        //----
        // PREPARE SOCKET
        _this.client_ = new websocket_1.client();
        _this.client_.on("connect", _this._Handle_connect.bind(_this));
        _this.client_.on("connectFailed", _this._Handle_error.bind(_this));
        if (typeof protocols === "string")
            protocols = [protocols];
        // DO CONNECT
        _this.client_.connect(url, protocols);
        return _this;
    }
    WebSocket.prototype.close = function (code, reason) {
        this.state_ = WebSocket.CLOSING;
        if (code === undefined)
            this.connection_.sendCloseFrame();
        else
            this.connection_.sendCloseFrame(code, reason, true);
    };
    /* ================================================================
        ACCESSORS
            - SENDER
            - PROPERTIES
            - LISTENERS
    ===================================================================
        SENDER
    ---------------------------------------------------------------- */
    WebSocket.prototype.send = function (data) {
        if (typeof data.valueOf() === "string")
            this.connection_.sendUTF(data);
        else {
            var buffer = void 0;
            if (data instanceof Buffer)
                buffer = data;
            else if (data instanceof Blob)
                buffer = new Buffer(data, "blob");
            else if (data.buffer)
                buffer = new Buffer(data.buffer);
            else
                buffer = new Buffer(data);
            this.connection_.sendBytes(buffer);
        }
    };
    Object.defineProperty(WebSocket.prototype, "url", {
        /* ----------------------------------------------------------------
            PROPERTIES
        ---------------------------------------------------------------- */
        get: function () {
            return this.client_.url.href;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "protocol", {
        get: function () {
            return this.client_.protocols
                ? this.client_.protocols[0]
                : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "extensions", {
        get: function () {
            return this.connection_ && this.connection_.extensions
                ? this.connection_.extensions[0].name
                : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "readyState", {
        get: function () {
            return this.state_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "bufferedAmount", {
        get: function () {
            return this.connection_.bytesWaitingToFlush;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "binaryType", {
        get: function () {
            return "arraybuffer";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onopen", {
        /* ----------------------------------------------------------------
            LISTENERS
        ---------------------------------------------------------------- */
        get: function () {
            return this.on_.open;
        },
        set: function (listener) {
            this._Set_on("open", listener);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onclose", {
        get: function () {
            return this.on_.close;
        },
        set: function (listener) {
            this._Set_on("close", listener);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        get: function () {
            return this.on_.message;
        },
        set: function (listener) {
            this._Set_on("message", listener);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onerror", {
        get: function () {
            return this.on_.error;
        },
        set: function (listener) {
            this._Set_on("error", listener);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    WebSocket.prototype._Set_on = function (type, listener) {
        if (this.on_[type])
            this.removeEventListener(type, this.on_[type]);
        this.addEventListener(type, listener);
        this.on_[type] = listener;
    };
    /* ----------------------------------------------------------------
        SOCKET HANDLERS
    ---------------------------------------------------------------- */
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_connect = function (connection) {
        this.connection_ = connection;
        this.state_ = WebSocket.OPEN;
        this.connection_.on("message", this._Handle_message.bind(this));
        this.connection_.on("error", this._Handle_error.bind(this));
        this.connection_.on("close", this._Handle_close.bind(this));
        var event = new Event_1.Event("open", EVENT_INIT);
        this.dispatchEvent(event);
    };
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_close = function (code, reason) {
        var event = new CloseEvent_1.CloseEvent("close", __assign({}, EVENT_INIT, { code: code, reason: reason }));
        this.state_ = WebSocket.CLOSED;
        this.dispatchEvent(event);
    };
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_message = function (message) {
        var event = new MessageEvent_1.MessageEvent("message", __assign({}, EVENT_INIT, { data: message.binaryData
                ? message.binaryData
                : message.utf8Data }));
        this.dispatchEvent(event);
    };
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_error = function (error) {
        var event = new ErrorEvent_1.ErrorEvent("error", __assign({}, EVENT_INIT, { error: error, message: error.message }));
        if (this.state_ === WebSocket.CONNECTING)
            this.state_ = WebSocket.CLOSED;
        this.dispatchEvent(event);
    };
    return WebSocket;
}(EventTarget_1.EventTarget));
exports.WebSocket = WebSocket;
(function (WebSocket) {
    WebSocket.CONNECTING = 0;
    WebSocket.OPEN = 1;
    WebSocket.CLOSING = 2;
    WebSocket.CLOSED = 3;
})(WebSocket = exports.WebSocket || (exports.WebSocket = {}));
exports.WebSocket = WebSocket;
var EVENT_INIT = {
    bubbles: false,
    cancelable: false
};
//# sourceMappingURL=WebSocket.js.map