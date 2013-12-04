
DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem() {
	this.driverEntry = krnFileSysDriverEntry;
	this.read = krnFileSysReadFile;
	this.write = krnFileSysWriteFile;
	this.format = krnFileSysFormat;
	
	this.dataStart = 100;
    //this.isr = krnKbdDispatchKeyPress;
}

function krnFileSysDriverEntry()
{
    this.status = "loaded";
}

function krnFileSysReadFile(params) {
	var name = params[0];
	
	var index = fileIndex(name);
	
	if (index != -1) {	//file exists, read it
		_StdIn.putText(localStorage.getItem("" + index));
	}
	else {	//file does not exist, do something
		
	}
}

function krnFileSysWriteFile(params) {
	var name = params[0];
	var data = params[1];
	
	var index = fileIndex(name);
	
	if (index != -1) {	//file exists, overwrite it
	
	}
	else {	//file does not exist, create it
		if (nameIsValid(name)) {
			var next = getNextIndex();
			var location = 100;
			if (next - 1 >= 0) {
				location = parseInt(localStorage.getItem("" + (next - 1)).substring(0,3)) + 1;
			}
			localStorage.setItem("" + next, "" + location + "." + name);
		}
		else {
			_StdIn.putTextAbovePrompt("File names must contain only alphanumeric");
			_StdIn.putTextAbovePrompt("characters and have 8 or less characters.");
		}
	}
}

function krnFileSysFormat(params) {
	localStorage.clear();
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
	var s = "" + index;
	
	while (localStorage.getItem(s) !== null) {
		index += 1;
		s = "" + index;
	}
	
	return index;
}

function fileIndex(name) {
	var index = 0;
	var s = "" + index;
	
	while (localStorage.getItem(s) !== name) {
		index += 1;
		s = "" + index;
		
		if (localStorage.getItem(s) === null) {
			return -1;
		}
	}
	
	return index;
}
