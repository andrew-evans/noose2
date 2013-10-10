/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
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

	// load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Loads a program from the program input.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;

	// run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - Runs a program from memory.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;

	// step
    sc = new ShellCommand();
    sc.command = "step";
    sc.description = "<pid> - Runs a program in step-thru mode.";
    sc.function = shellStep;
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
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
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
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
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
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
	_Status = "Fuck off.";
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
	  _Status = "OK";
   } else {
      _StdIn.putText("For what?");
   }
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

function shellLoad(args)
{
	//Check that all characters are either hex digits or whitespace.
	var pattern = /^(\d|[a-f]|\s)+$/i;
	krnTrace(_ProgramInput.value);
	var programValid = pattern.test(_ProgramInput.value);
	
	//Call the memory manager to load the program into location #0000
	if (programValid)
	{
		var pcb = _MemoryManager.loadProgram(_ProgramInput.value, 0x0000);
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
	_CPU.stepMode = false;
	shellRunGeneric(args);
}

function shellStep(args)
{
	_CPU.stepMode = true;
	_StdIn.putText("Press PAUSE/BREAK to step forward in program execution.");
	shellRunGeneric(args);
}

//Handles running programs after the run or step command sets the step mode.
function shellRunGeneric(args)
{
	if (args.length > 0) {
		var process = _MemoryManager.getProcess(parseInt(args[0]));
		if (process !== null) {
			krnTrace("Found program PID " + process.pid + " at location " + process.location);
			_CPU.run(process);
		}
		else {
			_StdIn.putText("No program with PID " + args[0] + " exists in memory.");
		}
	}
	else {
		_StdIn.putText("Please supply a PID as an argument.");
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

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
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

function shellBSOD(args)
{
	_Status = "FUGGED UP";

	_DrawingContext.fillStyle = '#0000FF';
	_DrawingContext.fillRect(0,0, _Canvas.width, _Canvas.height);
	_DrawingContext.fillStyle = "white";
  	_DrawingContext.font = "bold 32px Wingdings";
  	_DrawingContext.fillText("fug, u fuggen broke it.", 50, _Canvas.height / 2);
	krnShutdown();
	clearInterval(_hardwareClockID);
}
