/*

	Memory class acts as the core memory for the OS

*/

function Memory() {

	this.memoryLimit = 256;

	this.init = function() {
		this.mem = [];
		for (var i = 0; i < this.memoryLimit; i++) {
			this.mem[i] = -1;
		}
	};

	this.load = function(data, location) {
		this.mem[location] = data;
	};
};
