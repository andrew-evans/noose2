/*

	Process Control Block

	stores process information

*/

function PCB() {

	this.pid = -1;
	this.location = -1;
	this.locationEnd = -1;
	this.len = -1;

	this.init = function(pid, location, len) {
		this.pid = pid;
		this.location = location;
		this.len = len;
		this.locationEnd = location + len - 1;
	};

};
