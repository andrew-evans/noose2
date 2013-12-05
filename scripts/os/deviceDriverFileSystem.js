
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
	var data = "";
	if (params.length > 1) {
		data = params[1];
	}
	
	var index = fileIndex(name);
	//_StdIn.putTextAbovePrompt("" + index);
	
	if (index != -1) {	//file exists, overwrite it
		
	}
	else {	//file does not exist, create it
		if (nameIsValid(name)) {
			index = getNextIndex();
			//data = "";
			
			/*if (index - 1 >= 0) {
				location = parseInt(localStorage.getItem("" + (index - 1)).substring(0,3)) + 1;
			}*/
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
	
	while (localStorage.getItem(index) !== null) {
		index += 1;
	}
	
	return index;
}

function fileIndex(name) {
	var index = 0;
	var s = "" + index;
	
	while (localStorage.getItem(index) !== null) {
		if (localStorage.getItem(index).substring(5) === name) {
			return index;
		}
		index += 1;
		s = "" + index;
	}
	
	return -1;
}
