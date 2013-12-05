
DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem() {
	this.driverEntry = krnFileSysDriverEntry;
	this.read = krnFileSysReadFile;
	this.write = krnFileSysWriteFile;
	this.remove = krnFileSysDelete;
	this.format = krnFileSysFormat;
	this.find = krnFileSysFind;
	this.swap = krnFileSysSwap;
    //this.isr = krnKbdDispatchKeyPress;
}

function krnFileSysDriverEntry()
{
    this.status = "loaded";
}

function krnFileSysAddProcess(program, pid) {
	var index = pid;//getNextSwapIndex();
	sessionStorage.setItem(index, program);
	return index;
}

function krnFileSysSwap(params) {
	var pcb1 = params[0]; //on drive
	var pcb2 = params[1]; //in memory
	
	var i = pcb2.location;
	var programString = "";
	while (i < pcb2.locationEnd) {
		programString += _MemoryManager.superRead(i++).toString(16) + " ";
	}
	programString = programString.trim();
	
	var index = pcb2.pid;
	sessionStorage.setItem(index,programString);
	pcb2.fileLocation = index;
	
	//var temp = pcb1.partition;
	pcb1.partition = pcb2.partition;
	//pcb2.partition = temp;
	//this is bad, I know.
	//but at this point I'd rather do it this way than change the way the PC is stored and have to test it all again.
	//var newPC = pcb1.partition * _MemoryManager.partitionSize + modulo(pcb1.PC, _MemoryManager.partitionSize);
	//pcb1.PC = modulo(pcb1.PC, _MemoryManager.partitionSize);
	//newPC = pcb2.partition * _MemoryManager.partitionSize + modulo(pcb2.PC, _MemoryManager.partitionSize);
	//pcb2.PC = newPC;
	
	programString = sessionStorage.getItem(pcb1.fileLocation);
	var opCodes = programString.split(/\s+/);
	var currentLocation = _MemoryManager.partitionStart(pcb1.partition);
	
	i = 0;
	
	while (i < opCodes.length) {
		_MemoryManager.superWrite(parseInt(opCodes[i++],16), currentLocation);
		currentLocation += 1;
	}
	
	//sessionStorage.removeItem(pcb1.fileLocation);
	pcb1.fileLocation = -1;
	
	//pcb1.state = "RUNNING";
	pcb2.state = "READY";
}

function krnFileSysSwapOut(pcb) {
	var i = _MemoryManager.partitionStart(pcb.partition);
	var programString = "";
	while (i < _MemoryManager.partitionEnd(pcb.partition)) {
		programString += _MemoryManager.superRead(i++).toString(16) + " ";
	}
	programString = programString.trim();
	
	var index = pcb.pid;
	sessionStorage.setItem(index,programString);
	pcb.fileLocation = index;
	
	_MemoryManager.clearPartition(pcb.partition);
	pcb.partition = -1;
}

function krnFileSysSwapIn(pcb) {
	//alert(_MemoryManager.partitionStates);
	var part = _MemoryManager.nextOpenPartition();
	if (part != -1 && pcb.fileLocation != -1) {
		pcb.partition = part;
		
		programString = sessionStorage.getItem(pcb.fileLocation);
		//krnTrace("fffffffffffffffffffffff" + programString);
		var opCodes = programString.split(/\s+/);
		var currentLocation = _MemoryManager.partitionStart(part);
		var i = 0;
		
		while (i < opCodes.length) {
			_MemoryManager.superWrite(parseInt(opCodes[i++],16), currentLocation);
			currentLocation += 1;
		}
		
		pcb.PC = (pcb.PC % _MemoryManager.partitionSize) + (part * _MemoryManager.partitionSize);
		
		_MemoryManager.partitionStates[part] = 1;
	}
}

/*function getNextSwapIndex() {
	var index = 2000;
	
	while (sessionStorage.getItem(index) !== null) {
		index += 1;
	}
	
	if (index >= 2100) {
		//ideally, we should do something more here.
		return -1;
	}
	
	return index;
}*/

function krnFileSysReadFile(params) {
	var name = params[0];
	
	var index = fileIndex(name);
	
	if (index != -1) {	//file exists, read it
		var location = index + 1000;
		_StdIn.putTextAbovePrompt(localStorage.getItem(location));
	}
	else {	//file does not exist, do something
		_StdIn.putTextAbovePrompt("No file with the name " + name + " exists.");
	}
}

function krnFileSysWriteFile(params) {
	var name = params[0];
	var data = "";
	if (params.length > 1) {
		data = params[1];
	}
	
	var index = fileIndex(name);
	
	if (index != -1) {	//file exists, overwrite it (below)
		
	}
	else {	//file does not exist, create it
		if (nameIsValid(name)) {
			index = getNextIndex();
			_StdIn.putTextAbovePrompt("File " + name + " created.");
		}
		else {
			_StdIn.putTextAbovePrompt("File names must contain only alphanumeric");
			_StdIn.putTextAbovePrompt("characters and have 8 or less characters.");
			return;
		}
	}
	
	var location = index + 1000;
	localStorage.setItem(index, "" + location + "." + name);
	localStorage.setItem(location, "" + data);
}

function krnFileSysDelete(params) {
	var index = fileIndex(params[0]);
	if (index != -1) {
		var location = index + 1000;
		localStorage.removeItem(index);
		localStorage.removeItem(location);
		_StdIn.putTextAbovePrompt("File deleted.");
	}
	else {
		_StdIn.putTextAbovePrompt("No file with the name " + params[0] + " exists.");
	}
}

function krnFileSysFormat(params) {
	localStorage.clear();
	_StdIn.putTextAbovePrompt("File drive formatted.");
}

function nameIsValid(name) {
	var maxLength = 8;
	var pattern = /^([a-z]|\d)+$/i;
	var charsValid = pattern.test(name);
	if (name.length <= maxLength && charsValid) {
		return true;
	}
	return false;
}

function getNextIndex() {
	var index = 0;
	
	while (localStorage.getItem(index) !== null) {
		index += 1;
	}
	
	if (index >= 1000) {
		//ideally, we should do something more here.
		return -1;
	}
	
	return index;
}

function fileIndex(name) {
	var index = 0;
	
	while (index < 1000) {
		if (localStorage.getItem(index) !== null) {
			if ("" + localStorage.getItem(index).substring(5) === name) {
				return index;
			}
		}
		index += 1;
	}
	
	return -1;
}

function krnFileSysFind(params) {
	var index = 0;
	var fileString = "";
	
	while (index < 1000) {
		if (localStorage.getItem(index) !== null) {
			//we don't want to display hidden system files (swapped out processes)
			//filename starting with "." denotes this
			//if (localStorage.getItem(index).substring(5,6) !== ".") {
				fileString += localStorage.getItem(index).substring(5) + " ";
			//}
		}
		index += 1;
	}
	
	_StdIn.putTextAbovePrompt(fileString);
}
