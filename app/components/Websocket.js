'use strict';

var React = require('react');
var W3CWebSocket = require('websocket').w3cwebsocket;

var WebsocketComponent = React.createClass({

    propTypes: {
        url: React.PropTypes.string.isRequired,
        onMessage: React.PropTypes.func.isRequired,
        debug: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            debug: false
        }
    },

    log: function (logline) {
        if (this.props.debug === true) {
            console.log(logline);
        }
    },
    _initWebsocket: function() {
        var self = this;
        var retry = setTimeout(function() {
            if (self.retry) {
                clearTimeout(retry);
            }
            self._initWebsocket();
        }, 1000);
        self.ws = new W3CWebSocket(self.props.url, [self.props.protocol]);

        self.ws.onopen = function (event) {
            if (self.ws !== event.target) {
                return;
            }
            self.log('WebSocket Client Connected');
            clearTimeout(retry);
            self.ws.onerror = function (error) {
                self.log("Connection Error: " + error.toString());
            };
            self.ws.onclose = function () {
                self.log('Connection Closed');
                self._initWebsocket();
            };
            self.ws.onmessage = function (message) {
                self.log("Received: ", message);
                if (typeof message.data === 'string') {
                    if (message.data === 'PING') {
                        self.ws.send('PONG');
                    } else {
                        var data = JSON.parse(message.data);
                        self.props.onMessage(data);
                    }
                }
            };
        };
    },
    componentWillMount: function () {
        this.log('Websocket componentWillMount');
        this._initWebsocket();
    },

    componentWillUnmount: function () {
        this.log('Websocket componentWillUnmount');
        this.ws.close();
    },

    render: function () {
        return React.createElement("div", React.__spread({}, this.props))
    }
});

module.exports = {
    'Websocket': WebsocketComponent
};
