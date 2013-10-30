/*

	Memory class acts as the core memory for the OS

*/

function Memory() {

	this.memoryLimit = 1024;
	this.wordSize = 256;
	this.mem = [];

	this.init = function() {
		this.mem = [];
		for (var i = 0; i < this.memoryLimit; i++) {
			this.mem[i] = 0;
		}
	};

	this.load = function(value, location) {
		//If we do things properly elsewhere (program validation, etc) we
		//should only get values lower than the word size. But just in case,
		//we mod the number by the word size before storing it.
		//Same applies for address locations and memory size.

		//Javascript does not properly compute mod for negatives, so I've
		//substituted my own function.
		location = modulo(location, this.memoryLimit);

		if (location >= 0 && location < this.memoryLimit) {
			this.mem[location] = modulo(value,this.wordSize);
			return true;
		}
		else {
			return false;
		}
	};

	//writes zeroes between and including two given addresses.
	this.clearMemory = function(start, end) {
		for (var i = start; i <= end; i += 1) {
			this.load(0, i);
		}
	}
};
