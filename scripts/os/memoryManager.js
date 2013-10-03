/*

	Manages the Memory object for the OS

*/

function MemoryManager() {

	this.memoryLimit = _Memory.memoryLimit;

	this.init = function() {
		
	};

	this.loadProgram = function(programString, location) {
		var currentLocation = location;
		var opCodes = programString.split(" ");
		var i = 0;

		while (i < opCodes.length) {
			if (i >= this.memoryLimit) {
				return false;
			}
			
			_Memory.load(opCodes[i++], currentLocation++);
			krnTrace("did a thing");
		}
		
		return true;
	};

};
