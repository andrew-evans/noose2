/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // noose
    sc = new ShellCommand();
    sc.command = "noose";
    sc.description = "- Pretty much what it sounds like.";
    sc.function = shellNoose;
    this.commandList[this.commandList.length] = sc;

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // ls
    sc = new ShellCommand();
    sc.command = "ls";
    sc.description = "- Lists existing files.";
    sc.function = shellLs;
    this.commandList[this.commandList.length] = sc;
    
    // create
    sc = new ShellCommand();
    sc.command = "create";
    sc.description = "<filename> - Creates a new file with a given name.";
    sc.function = shellCreate;
    this.commandList[this.commandList.length] = sc;
    
    // write
    sc = new ShellCommand();
    sc.command = "write";
    sc.description = "<filename> \"data\" - Writes the given data into the given file.";
    sc.function = shellWrite;
    this.commandList[this.commandList.length] = sc;
    
    // read
    sc = new ShellCommand();
    sc.command = "read";
    sc.description = "<filename> - Prints the contents of the given file.";
    sc.function = shellRead;
    this.commandList[this.commandList.length] = sc;
    
    // delete
    sc = new ShellCommand();
    sc.command = "delete";
    sc.description = "<filename> - Deletes the given file.";
    sc.function = shellDelete;
    this.commandList[this.commandList.length] = sc;
    
    // format
    sc = new ShellCommand();
    sc.command = "format";
    sc.description = "- Formats the file system drive.";
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;

	// load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "<priority> - Loads a program from the program input.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;

	// run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - Runs a program from memory.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;
    
    // runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Runs all programs in memory.";
    sc.function = shellRunall;
    this.commandList[this.commandList.length] = sc;
    
    // active
    sc = new ShellCommand();
    sc.command = "active";
    sc.description = "- Displays PIDs of all active processes.";
    sc.function = shellActive;
    this.commandList[this.commandList.length] = sc;

	// step
    sc = new ShellCommand();
    sc.command = "step";
    sc.description = "- Toggles step-thru execution.";
    sc.function = shellStep;
    this.commandList[this.commandList.length] = sc;

	// kill
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<pid> - Ends execution of a given program.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;

    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;

    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Having an existential crisis?";
    sc.function = shellWhereAmI;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "- Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;
    
    // quantum <number>
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<clock ticks> - Sets the process scheduling quantum.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;

    // setschedule <type>
    sc = new ShellCommand();
    sc.command = "setschedule";
    sc.description = "<type> - Sets the process scheduling algorithm.";
    sc.function = shellSetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    // getschedule
    sc = new ShellCommand();
    sc.command = "getschedule";
    sc.description = "- Displays the current process scheduling algorithm.";
    sc.function = shellGetSchedule;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

	// status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Sets the status.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;

	// mem
    sc = new ShellCommand();
    sc.command = "mem";
    sc.description = "- Toggles the memory view.";
    sc.function = shellMemView;
    this.commandList[this.commandList.length] = sc;

    // bsod
    sc = new ShellCommand();
    sc.command = "bsod";
    sc.description = "- Deaths the screen with blue.";
    sc.function = shellBSOD;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        this.execute(shellInvalidCommand);
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces and lower-case the command
    cmd = trim(cmd).toLowerCase();;
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. Type 'help' for, well... help.");
}

function shellNoose(args)
{
    _StdIn.putText("   |/|");
    _StdIn.advanceLine();
    _StdIn.putText("   |/|");
    _StdIn.advanceLine();
    _StdIn.putText("   |/|");
    _StdIn.advanceLine();
    _StdIn.putText("   |/|");
    _StdIn.advanceLine();
    _StdIn.putText("   |/|");
    _StdIn.advanceLine();
    _StdIn.putText("  (___)");
    _StdIn.advanceLine();
    _StdIn.putText("  (___)");
    _StdIn.advanceLine();
    _StdIn.putText("  (___)");
    _StdIn.advanceLine();
    _StdIn.putText("  (___)");
    _StdIn.advanceLine();
    _StdIn.putText("  (___)");
    _StdIn.advanceLine();
    _StdIn.putText("  // \\\\");
    _StdIn.advanceLine();
    _StdIn.putText(" //   \\\\");
    _StdIn.advanceLine();
    _StdIn.putText("| |      | |");
    _StdIn.advanceLine();
    _StdIn.putText("| | O S | |");
    _StdIn.advanceLine();
    _StdIn.putText("| |      | |");
    _StdIn.advanceLine();
    _StdIn.putText(" \\\\___//");
    _StdIn.advanceLine();
    _StdIn.putText("  ---");
    _StdIn.advanceLine();
}

function shellVer(args)
{
	_StdIn.putText(APP_DESCRIPTION);
	_StdIn.advanceLine();
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);
}

function shellLs(args) {
	_KernelInterruptQueue.enqueue(new Interrupt(FILE_FIND_IRQ, []));
}

function shellFormat(args) {
	_KernelInterruptQueue.enqueue(new Interrupt(FILE_FORMAT_IRQ, []));
}

function shellCreate(args) {
	if (args.length > 0) {
		_KernelInterruptQueue.enqueue(new Interrupt(FILE_WRITE_IRQ, [args[0], ""]));
	}
	else {
		_StdIn.putText("Please supply a filename as an argument.");
	}
}

function shellWrite(args)
{
	var data = "";
	if (args.length > 0) {
		var i = 1;
		while (i < args.length) {
			data += args[i] + " ";
			i += 1;
		}
		var name = args[0];
		_KernelInterruptQueue.enqueue(new Interrupt(FILE_WRITE_IRQ, [name, data]));
	}
	else {
		_StdIn.putText("Please supply a filename and data as arguments.");
	}
}

function shellRead(args)
{
	if (args.length > 0) {
		_KernelInterruptQueue.enqueue(new Interrupt(FILE_READ_IRQ, [args[0]]));
	}
	else {
		_StdIn.putText("Please supply a filename as an argument.");
	}
}

function shellDelete(args)
{
	if (args.length > 0) {
		_KernelInterruptQueue.enqueue(new Interrupt(FILE_REMOVE_IRQ, [args[0]]));
	}
	else {
		_StdIn.putText("Please supply a filename as an argument.");
	}
}

function shellLoad(args)
{
	//Check that all characters are either hex digits or whitespace.
	var pattern = /^(\d|[a-f]|\s)+$/i;
	//krnTrace("loading program: " + _ProgramInput.value);
	var programValid = pattern.test(_ProgramInput.value);
	
	//Call the memory manager to load the program into main memory.
	if (programValid)
	{
		var priority = 5;
		if (args.length > 0) {
			priority = Math.abs(parseInt(args[0]));
		}
		
		var pcb = _MemoryManager.loadProgram(_ProgramInput.value, priority);
		
		if (pcb !== null)
		{
			_StdIn.putText("Program successfully loaded with PID " + pcb.pid);
		}
		else
		{
			_StdIn.putText("Program did not load successfully.");
		}
	}
	else
	{
		_StdIn.putText("Program input is invalid!");
	}
}

function shellRun(args)
{
	//_CPU.stepMode = false;
	var pid = parseInt(args[0]);
	if (args.length > 0) {
		var process = _MemoryManager.getProcess(pid);
		if (process !== null) {
			if (!_MemoryManager.runningProcess(pid)) {
				krnTrace("Running program PID " + process.pid + "...");
				_MemoryManager.enqueue(process);
				//_CPU.run(process);
				return true;
			}
			else {
				_StdIn.putText("Process " + pid + " is already running.");
			}
		}
		else {
			_StdIn.putText("No program with PID " + args[0] + " exists in memory.");
			return false;
		}
	}
	else {
		_StdIn.putText("Please supply a PID as an argument.");
		return false;
	}
}

function shellStep(args)
{
	_CPU.stepMode = !_CPU.stepMode;
	if (_CPU.stepMode) {
		_StdIn.putText("Press PAUSE/BREAK to step forward in program execution.");
	}
	else {
		_StdIn.putText("Step-thru execution disabled.");
	}
}

function shellRunall(args) {
	if (!_MemoryManager.enqueueAll()) {
		_StdIn.putText("There are no new processes to run.");
	}
}

function shellActive(args) {
	if (_MemoryManager.processes.length > 0) {
		_StdIn.putText("Active PIDs:");
		for (var i = 0; i < _MemoryManager.processes.length; i += 1) {
			_StdIn.putText(" " + _MemoryManager.processes[i].pid);
		}
	}
	else {
		_StdIn.putText("No active processes are currently in memory.");
	}
}

function shellKill(args)
{
	if (args.length > 0) {
		//Tell the memory manager to flag the process as terminated.
		var pid = parseInt(args[0]);
		_MemoryManager.endProcess(pid);
	}
	else {
		_StdIn.putText("Please supply a PID as an argument.");
		return false;
	}
}

function shellDate(args)
{
    var date = new Date();
    _StdIn.putText(date.toLocaleDateString() + ", " + date.toLocaleTimeString());
}

function shellWhereAmI(args)
{
    _StdIn.putText("This machine is not equipped to handle such deep");
    _StdIn.advanceLine();
    _StdIn.putText("questions. Consider trying the OUTSIDE:/ drive.");
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellQuantum(args)
{
	if (args.length > 0) {
		var value = parseInt(args[0]);
		if (value > 0) {
			_CpuScheduler.setQuantum = value;
		}
		else {
			_StdIn.putText("Please enter a positive number.");
		}
	}
	else {
		_StdIn.putText("Please supply a quantum number as an argument.");
	}
}

function shellSetSchedule(args)
{
	if (args.length > 0) {
		if (args[0].toLowerCase() === "rr") {
			_CpuScheduler.mode = "RR";
			_StdIn.putText("Scheduling set to Round Robin.");
		}
		else if (args[0].toLowerCase() === "fcfs") {
			_CpuScheduler.mode = "FCFS";
			_StdIn.putText("Scheduling set to First Come First Served.");
		}
		else if (args[0].toLowerCase() === "priority") {
			_CpuScheduler.mode = "PR";
			_StdIn.putText("Scheduling set to Non-Preemptive Priority.");
		}
		else {
			_StdIn.putText("Invalid scheduling algorithm.");
		}
	}
	else {
		_StdIn.putText("Please supply one of the following scheduling algorithms:");
		_StdIn.advanceLine();
		_StdIn.putText("  rr - fcfs - priority");
	}
}

function shellGetSchedule(args)
{
	if (_CpuScheduler.mode === "RR") {
		_StdIn.putText("Scheduling currently set to Round Robin.");
	}
	else if (_CpuScheduler.mode === "FCFS") {
		_StdIn.putText("Scheduling currently set to First Come First Served.");
	}
	else if (_CpuScheduler.mode === "PR") {
		_StdIn.putText("Scheduling currently set to Non-Preemptive Priority.");
	}
}

function shellTrace(args)
{
	//changed this to keep consist with noOSe style commands, and simplicity.
	_Trace = !_Trace;
	if (_Trace) {
		_StdIn.putText("Trace ON");
	}
	else {
		_StdIn.putText("Trace OFF");
	}
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellStatus(args)
{
	if (args.length > 0)
	{
		_Status = "";
		for (var i = 0; i < args.length; i += 1) {
			_Status += args[i] + " ";
		}
	}
	else
	{
		_StdIn.putText("Usage: status <string>  Please supply a string.");
	}
}

//changes the view mode of the displayed memory.
function shellMemView(args)
{
	_MemoryDisplayMode = !_MemoryDisplayMode;
	
	if (_MemoryDisplayMode == 0) {
		_StdIn.putText("Memory view set to detailed mode.");
	}
	else {
		_StdIn.putText("Memory view set to simple mode.");
	}
}

function shellBSOD(args)
{
	_Status = "FUGGED UP";

	var image = new Image();
	image.src = "images/upset-cat.png";
	image.onload = function() {
		_DrawingContext.drawImage(image, 0, 0);
	};

	_DrawingContext.fillStyle = '#0000FF';
	_DrawingContext.fillRect(0,0, _Canvas.width, _Canvas.height);
	_DrawingContext.fillStyle = "white";
  	_DrawingContext.font = "bold 32px Trebuchet";
  	_DrawingContext.fillText("why would you do that :(", 30, _Canvas.height * 0.95);
	krnShutdown();
	clearInterval(_hardwareClockID);
}
