/*

	Handles scheduling of the CPU

*/

function CpuScheduler() {

	this.setQuantum = 6;
	this.quantum = this.setQuantum;	//clock ticks per round robin cycle
	this.count = 0;
	this.mode = "RR";
	//RR - round robin
	//FCFS - first come first served
	//PR - non-preemptive priority
	
	//this.isr = this.contextSwitch;

	this.init = function() {
	
	};

	this.step = function() {
		if (this.mode === "RR") {
			this.quantum = this.setQuantum;
		}
		else {
			this.quantum = 999999; //lol
		}
	
		if (_MemoryManager.readyQueue.length > 0 && !_CPU.isExecuting && !_CPU.stepMode) {
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [0]));
		}
		
		if (_CPU.isExecuting || !_CPU.stepMode) {
			this.count = modulo(this.count + 1, this.quantum);
		}
		
		if (this.count == 0 && _MemoryManager.readyQueue.length > 1) {
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [1]));
		}
	};
	
	this.contextSwitch = function(swap) {
		var current = null;
		if (swap == 1) {
			current = _MemoryManager.readyQueue.shift();
			_MemoryManager.enqueue(current);
		}
		
		if (this.mode === "PR") {
			var pcb = null;
			var lowest = 999999;
			index = 0;
			for (var i = 0; i < _MemoryManager.readyQueue.length; i++) {
				if (_MemoryManager.readyQueue[i].priority < lowest) {
					index = i;
				}
			}
			pcb = _MemoryManager.readyQueue[index];
			_MemoryManager.readyQueue.splice(index, 1);
			_MemoryManager.enqueue(pcb);
		}
		
		var next = _MemoryManager.readyQueue[0];
		if (_CPU.isExecuting && swap == 1) {
			current.saveCPU();
		}
		
		if (next.fileLocation != -1) { //the process is on disk, we gotta swap it into memory
			if (swap == 1) {
				var thing = null;
				for (var i = _MemoryManager.readyQueue.length - 1; i >= 0 ; i--) {
					if (_MemoryManager.readyQueue[i].partition != -1) {
						thing = _MemoryManager.readyQueue[i];
					}
				}

				if (thing !== null) {
					krnFileSysSwapOut(thing);
				}
				else {
					krnTrace("YOU SUCKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
				}
			}
			krnFileSysSwapIn(next);
			//_KernelInterruptQueue.enqueue(new Interrupt(FILE_SWAP_IRQ, [next, _MemoryManager.readyQueue[_MemoryManager.readyQueue.length-1]]));
		}
		
		_CPU.run(next);
	};	
}
