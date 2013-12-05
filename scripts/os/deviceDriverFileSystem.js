
DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem() {
	this.driverEntry = krnFileSysDriverEntry;
	this.read = krnFileSysReadFile;
	this.write = krnFileSysWriteFile;
	this.remove = krnFileSysDelete;
	this.format = krnFileSysFormat;
	this.find = krnFileSysFind;
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
	
	if (index != -1) {	//file exists, overwrite it
		
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
