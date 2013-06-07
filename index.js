/* 

	One vim

	Multiple docs

	One status

	Some meta rendering per doc

*/

var Doc = require('./lib/Doc');

var Vim = function(obj) {

	this.docs = [];

	//Create initial document
	var doc = new Doc();
	this.docs.push(doc);
	this.curDoc = doc;

};
Vim.prototype.insert = function() {};

Vim.insert = function(text) {
	vim.curDoc.insert(text);
};

Vim.prototype.Doc = Doc;

module.exports = new Vim();