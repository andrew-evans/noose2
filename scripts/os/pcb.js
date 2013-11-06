/*

	Process Control Block

	stores process information

*/

function PCB() {

	this.pid = -1;
	this.location = -1;
	this.locationEnd = -1;
	this.len = -1;

	this.partition = -1;
	
	this.state = "NEW";
	//NEW, RUNNING, WAITING, READY, TERMINATED 

	this.resetCPU = function() {
		this.PC    = 0;     // Program Counter
		this.Acc   = 0;     // Accumulator
		this.Xreg  = 0;     // X register
		this.Yreg  = 0;     // Y register
		this.Zflag = 0;     // Z-ero flag (Think of it as "isZero"
	};

	this.resetCPU();

	this.init = function(pid, location, len, partition) {
		this.pid = pid;
		this.location = location;
		this.len = len;
		this.locationEnd = location + len - 1;
		this.partition = partition;
		this.PC = partition * _MemoryManager.partitionSize;
	};

	this.saveCPU = function() {
		this.PC = _CPU.PC;
		this.Acc = _CPU.Acc;
		this.Xreg = _CPU.Xreg;
		this.Yreg = _CPU.Yreg;
		this.Zflag = _CPU.Zflag;
	};
};
