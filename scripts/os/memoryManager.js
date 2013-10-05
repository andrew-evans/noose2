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
		var pid = 0;

		while (i < opCodes.length) {
			if (i >= this.memoryLimit) {
				return -1;
			}
			
			_Memory.load(opCodes[i++], currentLocation++);
		}

		pid = _PCB.addProcess(location);
		//_StdIn.putText("Added process with pid " + pid);
		
		return pid;
	};

};
