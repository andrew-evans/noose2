/*

	Manages the Memory object for the OS

*/

function MemoryManager() {

	this.memoryLimit = _Memory.memoryLimit;
	this.wordSize = _Memory.wordSize;
	
	//number of bytes per partition
	this.partitionSize = 256;
	
	//given bad numbers, this could waste memory space, but the number of partitions needs to be an integer
	this.partitions = Math.floor(this.memoryLimit / this.partitionSize);
	
	//array containing the states of each partition in order. 0 means empty, 1 means occupied.
	this.partitionStates = [];
	
	this.processes = [];
	this.readyQueue = [];
	this.pid = 0;

	this.init = function() {
		for (var i = 0; i < this.partitions; i += 1) {
			this.partitionStates[i] = 0;
		}
	};

	this.loadProgram = function(programString) {
		var opCodes = programString.split(/\s+/);
		var i = 0;
		
		var pcb = new PCB();
		var part = -1;
		var partitionsNeeded = Math.ceil(opCodes.length / this.partitionSize);
		
		//TODO: fix this and the following for loop so we can handle larger programs
		if (partitionsNeeded > 1) {
			return null;
		}
		
		//Search for the first available partition
		if (this.partitions - this.partitionsFilled() >= partitionsNeeded) {
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
				
		var location = this.partitionSize * part;
		var currentLocation = location;

		while (i < opCodes.length) {
			this.superWrite(parseInt(opCodes[i++],16), currentLocation);
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
		this.removeProcess(pid);
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
		var pcb = this.getProcess(pid);
		var index = -1;
		for (var i = 0; i < this.processes.length; i++) {
			if (this.processes[i] === pcb) {
				index = i;
				break;
			}
		}
		this.processes.splice(index, 1);
		
		index = -1;
		for (var i = 0; i < this.readyQueue.length; i++) {
			if (this.readyQueue[i] === pcb) {
				index = i;
				break;
			}
		}
		this.readyQueue.splice(index, 1);
		
		if (this.readyQueue.length > 0) {
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, []));
		}
	};

	this.readValue = function(location) {
		location = modulo(location, this.partitionSize) + _CPU.base;
		/*if (_CPU.process !== null) {
			location += this.partitionStart(_CPU.process.partition);
		}*/
		return _Memory.mem[location];
	};

	this.writeValue = function(value, location) {
		location = modulo(location, this.partitionSize) + _CPU.base;
		/*if (_CPU.process !== null) {
			location += this.partitionStart(_CPU.process.partition);
		}*/
		return _Memory.load(value, location);
	};
	
	this.superWrite = function(value, location) {
		location = modulo(location, this.memoryLimit);
		return _Memory.load(value, location);
	};
	
	//returns the number of available partitions;
	this.partitionsFilled = function() {
		var filled = 0;
		for (var i = 0; i < this.partitions; i += 1) {
			filled += this.partitionStates[i];
		}
		
		return filled;
	};
	
	this.clearPartition = function(part) {
		if (part < this.partitions) {
			_Memory.clearMemory(this.partitionStart(part), this.partitionEnd(part));
			this.partitionStates[part] = 0;
		}
	};
	
	this.partitionStart = function(part) {
		return part * this.partitionSize;
	};
	
	this.partitionEnd = function(part) {
		return (part + 1) * this.partitionSize - 1;
	};
	
	/*this.programsRunning = function() {
		var total = 0;
		for (var i = 0; i < this.processes.length; i++) {
			if (this.processes[i].state === "RUNNING" ||
				this.processes[i].state === "WAITING" ||
				this.processes[i].state === "READY") {
					total += 1;
			}
		}
		
		return total;
	};*/
	
	this.enqueue = function(process) {
		process.state = "READY";
		this.readyQueue.push(process);
		//Interrupt(PROCESS_READY_IRQ, []);
	};
	
	this.enqueueAll = function() {
		var foundAny = false;
		for (var i = 0; i < this.processes.length; i++) {
			if (this.processes[i].state === "NEW") {
				this.enqueue(this.processes[i]);
				foundAny = true;
			}
		}
		
		return foundAny;
	};

};
