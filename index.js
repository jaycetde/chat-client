'use strict';

var io = require('socket.io')
	, Emitter = require('emitter')
	, inherit = require('inherit')
;

function Conversation(targetInfo, parent) {

	this.targetInfo = targetInfo;

	this.parent = parent;

}

inherit(Conversation, Emitter);

Conversation.prototype.send = function (msg) {

	this.parent.send(this.targetInfo, msg);

	return this;

};

Conversation.prototype.close = function () {

	this.parent.close(this);

};

function Client(host, options) {
	
	options = options || {};

	this.socket = io(host + '/chat');
	
	this.socket
		.on('msg', this._receiveMessage)
		.on('dist', this._distribute)
	;

	this.conversations = {};

}

inherit(Client, Emitter);

// Expose Conversation to allow for prototype manipulation
Client.Conversation = Conversation;

Client.prototype._receiveMessage = function (targetInfo, msg) {

	var conversation = this.get(targetInfo) || this.createConversation(targetInfo);

	conversation.push(msg);

};

Client.prototype._distribute = function (targetInfo, msg) {

	var conversation = this.get(targetInfo) || this.createConversation(targetInfo);

	conversation.push(msg);

};

Client.prototype.createConversation = function (targetInfo) {

	var conversation = new Conversation(targetInfo, this);

	this.emit('conversation-created', conversation);

	return conversation;

};

Client.prototype.get = function (targetInfo) {

	return this.idProp ? this.conversations[targetInfo[this.idProp]] : this.conversations[targetInfo];

};

Client.prototype.send = function (targetInfo, msg) {

	this.socket.emit('msg', targetInfo, msg);

	return this;

};

Client.prototype.close = function (conversation) {

	if (conversation && !(conversation instanceof Conversation)) {
		conversation = this.get(conversation);
	}

};

module.exports = Client;
