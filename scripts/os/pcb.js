/*

	Process Control Block

	stores process information in a queue in the following format:

		[pid, location]

*/

function PCB() {

	this.processQueue = new Queue();
	this.pid = 0;

	this.init = function() {
		this.pid = 0;
	};

	this.addProcess = function(location) {
		this.processQueue.enqueue([this.pid,location]);
		return this.pid++;
	};

};
