/*

	Memory class acts as the core memory for the OS

*/

function Memory() {

	this.memoryLimit = 256;
	this.wordSize = 256;
	this.mem = [];

	this.init = function() {
		this.mem = [];
		for (var i = 0; i < this.memoryLimit; i++) {
			this.mem[i] = 0;
		}
	};

	this.load = function(data, location) {
		//If we do things properly elsewhere (program validation, etc) we
		//should only get values lower than the word size. But just in case,
		//we mod the number by the word size before storing it.

		//Javascript does not properly compute mod for negatives, so I've
		//substituted my own function.
		this.mem[location] = modulo(data,this.wordSize);
	};
};
