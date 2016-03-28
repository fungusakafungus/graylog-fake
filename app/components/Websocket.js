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

    componentWillMount: function () {
        this.log('Websocket componentWillMount');
        var self = this;
        self.ws = new W3CWebSocket(self.props.url, [self.props.protocol]);

        self.ws.onopen = function () {
            self.log('WebSocket Client Connected');
        };
        self.ws.onerror = function (error) {
            self.log("Connection Error: " + error.toString());
        };
        self.ws.onclose = function () {
            self.log('echo-protocol Connection Closed');
        };
        self.ws.onmessage = function (message) {
            if (typeof message.data === 'string') {
                self.log("Received: '" + message.data + "'");
            }
            var data = JSON.parse(message.data);
            self.props.onMessage(data);
        };
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
