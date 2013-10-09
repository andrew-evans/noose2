/*

	Manages the Memory object for the OS

*/

function MemoryManager() {

	this.memoryLimit = _Memory.memoryLimit;
	this.processes = [];
	this.pid = 0;

	this.init = function() {
		
	};

	this.loadProgram = function(programString, location) {
		var currentLocation = location;
		var opCodes = programString.split(" ");
		var i = 0;

		while (i < opCodes.length) {
			if (i >= this.memoryLimit) {
				return null;
			}
			
			_Memory.load(parseInt(opCodes[i++],16), currentLocation++);
		}

		//create a new PCB and pass in the necessary values
		var pcb = new PCB();
		pcb.init(this.pid, location, opCodes.length);
		this.processes.push(pcb);
		this.pid++;

		return pcb;
	};

	this.getProcess = function(pid) {
		for (var i = 0; i < this.processes.length; i++) {
			if (this.processes[i].pid == pid) {
				return this.processes[i];
			}
		}
		
		return null;
	};

	this.readValue = function(location) {
		return _Memory.mem[location];
	}

};
