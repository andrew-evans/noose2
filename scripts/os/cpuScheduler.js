/*

	Handles scheduling of the CPU

*/

function CpuScheduler() {

	this.quantum = 6;	//clock ticks per round robin cycle
	this.count = 0;
	//this.isr = this.contextSwitch;

	this.init = function() {
	
	};

	this.step = function() {
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
		var next = _MemoryManager.readyQueue[0];
		if (_CPU.isExecuting) {
			current.saveCPU();
		}
		//current.state = "READY";
		_CPU.run(next);
	};
}
