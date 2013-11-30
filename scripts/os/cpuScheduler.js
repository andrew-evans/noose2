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
			this.quantum = 999999;
		}
	
		if (_MemoryManager.readyQueue.length > 0 && !_CPU.isExecuting && !_CPU.stepMode) {
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, []));
		}
		
		if (_CPU.isExecuting || !_CPU.stepMode) {
			this.count = modulo(this.count + 1, this.quantum);
		}
		
		if (this.count == 0 && _MemoryManager.readyQueue.length > 1) {
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, []));
		}
	};
	
	this.contextSwitch = function() {
		var current = _MemoryManager.readyQueue.shift();
		_MemoryManager.enqueue(current);
		
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
		if (_CPU.isExecuting) {
			current.saveCPU();
		}
		//current.state = "READY";
		_CPU.run(next);
	};
}
