/*

	Manages the Memory object for the OS

*/

function MemoryManager() {

	this.memoryLimit = _Memory.memoryLimit;
	
	//number of bytes per partition
	this.partitionSize = 256;
	
	//given bad numbers, this could waste memory space, but the number of partitions needs to be an integer
	this.partitions = Math.floor(this.memoryLimit / this.partitionSize);
	
	//array containing the states of each partition in order. 0 means empty, 1 means occupied.
	this.partitionStates = [];
	
	this.processes = [];
	this.pid = 0;

	this.init = function() {
		for (var i = 0; i < this.partitions; i += 1) {
			this.partitionStates[i] = 0;
		}
	};

	this.loadProgram = function(programString) {
		var opCodes = programString.split(" ");
		var i = 0;
		
		var pcb = new PCB();
		var part = -1;
		var partitionsNeeded = Math.floor(opCodes.length / this.partitionSize);
		
		//TODO: fix this and the following for loop so we can handle larger programs
		if (partitionsNeeded > 1) {
			return null;
		}
		
		if (this.partitionsAvailable() >= partitionsNeeded) {
			for (var j = 0; j < this.partitions; j += 1) {
				if (this.partitionStates[j] == 0) {
					part = j;
					break;
				}
			}
		}
		else {
			_StdIn.putText("Insufficient memory to load program.");
		}
		
		var location = this.partitionSize * pcb.partition;
		var currentLocation = location;

		while (i < opCodes.length) {
			this.writeValue(parseInt(opCodes[i++],16), currentLocation);
			currentLocation += 1;
		}

		//create a new PCB and pass in the necessary values
		
		pcb.init(this.pid, location, opCodes.length, part);
		this.processes.push(pcb);
		this.pid++;
		
		this.partitionStates[part] = 1;

		return pcb;
	};

	this.endProcess = function(pid) {
		var pcb = this.getProcess(pid);
		pcb.state = "TERMINATED";
		this.clearPartition(pcb.partition);
		//TODO
	};

	this.getProcess = function(pid) {
		for (var i = 0; i < this.processes.length; i++) {
			if (this.processes[i].pid == pid) {
				return this.processes[i];
			}
		}
		
		return null;
	};

	this.removeProcess = function(pid) {
		//TODO
	};

	this.readValue = function(location) {
		return _Memory.mem[location];
	};

	this.writeValue = function(value, location) {
		return _Memory.load(value, location);
	};
	
	//returns the number of available partitions;
	this.partitionsAvailable = function() {
		var available = this.partitions;
		for (var i = 0; i < this.partitions; i += 1) {
			available -= this.partitionStates[i];
		}
		
		return available;
	};
	
	this.clearPartition = function(part) {
		if (part < this.partitions) {
			_Memory.clearMemory(part * this.partitionSize, (part + 1) * this.partitionSize - 1);
			this.partitionStates[part] = 0;
		}
	};

};
