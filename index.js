'use strict';

var io = require('socket.io')
	, Emitter = require('emitter')
	, classes = require('classes')
	, inherit = require('inherit')
;

function Conversation(userId, userName, parent) {

	this.userId = userId;
	this.userName = userName;

	this.el = document.createElement('div');
	classes(this.el).add('chat-conversation');

}

inherit(Conversation, Emitter);

Conversation.prototype.send = function (msg) {

	

};

Conversation.prototype.close = function () {



};

function Client(host, options) {
	
	options = options || {};

	this.socket = io(host + '/chat');
	
	this.socket.io
		.on('reconnect', this._reconnect)
		.on('reconnect_failed', this._reconnect_failed)
	;

	this.socket
		.on('connect', this._connect)
		.on('disconnect', this._disconnect)
		.on('msg', this._receiveMessage)
		.on('dist', this._distribute)
	;

	this.el = document.createElement('div');
	this.el.id = options.containerId || 'chat-client';
	classes(this.el).add('chat-disconnected');

	this.conversations = {};

}

inherit(Client, Emitter);

// Expose Conversation to allow for prototype manipulation
Client.Conversation = Conversation;

Client.prototype._connect = function () {

	classes(this.el).remove('chat-disconnected');

};

Client.prototype._disconnect = function () {

	classes(this.el).add('chat-disconnected');

};

Client.prototype._reconnect = function () {

	classes(this.el).add('chat-reconnecting');

};

Client.prototype._reconnect_failed = function () {

	classes(this.el).remove('chat-reconnecting').add('chat-disconnected');

};

Client.prototype._receiveMessage = function () {



};

Client.prototype._distribute = function () {



};

Client.prototype.createConversation = function (userId, userName) {

	this.emit('conversation-created');

};

module.exports = Client;
