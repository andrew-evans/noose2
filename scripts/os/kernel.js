/* ------------
   Kernel.js
   
   Requires globals.js
   
   Routines for the Operating System, NOT the host.
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


//
// OS Startup and Shutdown Routines   
//
function krnBootstrap()      // Page 8.
{
   hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

   // Initialize our global queues.
   _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
   _KernelBuffers = new Array();         // Buffers... for the kernel.
   _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
   _Console = new CLIconsole();          // The command line interface / console I/O device.

   // Initialize the CLIconsole.
   _Console.init();

   // Initialize standard input and output to the _Console.
   _StdIn  = _Console;
   _StdOut = _Console;

   // Load the Keyboard Device Driver
   krnTrace("Loading the keyboard device driver.");
   krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.  TODO: Should that have a _global-style name?
   krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
   krnTrace(krnKeyboardDriver.status);

   //
   // ... more?
   //

   // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
   krnTrace("Enabling the interrupts.");
   krnEnableInterrupts();

   // Launch the shell.
   krnTrace("Creating and Launching the shell.");
   _OsShell = new Shell();
   _OsShell.init();

   // Finally, initiate testing.
   if (_GLaDOS) {
      _GLaDOS.afterStartup();
   }
}

function krnShutdown()
{
    krnTrace("begin shutdown OS");
    // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...    
    // ... Disable the Interrupts.
    krnTrace("Disabling the interrupts.");
    krnDisableInterrupts();
    // 
    // Unload the Device Drivers?
    // More?
    //
    krnTrace("end shutdown OS");
}


function krnOnCPUClockPulse() 
{
    /* This gets called from the host hardware sim every time there is a hardware clock pulse.
       This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
       This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel 
       that it has to look for interrupts and process them if it finds any.                           */

    // Check for an interrupt, are any. Page 560
    if (_KernelInterruptQueue.getSize() > 0)    
    {
        // Process the first interrupt on the interrupt queue.
        // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
        var interrupt = _KernelInterruptQueue.dequeue();
        krnInterruptHandler(interrupt.irq, interrupt.params);
    }
    else if (_CPU.isExecuting) // If there are no interrupts then run one CPU cycle if there is anything being processed.
    {
        _CPU.cycle();
    }    
    else                       // If there are no interrupts and there is nothing being executed then just be idle.
    {
       krnTrace("Idle");
    }

	// Update the status bar
	var date = new Date();

	_StatusBar.getContext('2d').clearRect(0,0,_StatusBar.width,_StatusBar.height);
	_StatusBar.getContext('2d').fillStyle = '#FFFFFF';
	_StatusBar.getContext('2d').font = "bold 24px Courier New";
	_StatusBar.getContext('2d').fillText(date.toLocaleDateString() + ", " + date.toLocaleTimeString(), 5, 22);
	_StatusBar.getContext('2d').fillText("Status: " + _Status, 1000, 22);

	// Update the memory table view
	var memoryString = "";
	
	if (_MemoryDisplayMode == 0) {
		memoryString = "  ADD  | HEX  |    BINARY    |   DEC   | ASCII\n" +
					   "-----------------------------------------------\n";
		var PCstring = "";
		for (var i = 0; i < _Memory.memoryLimit; i++) {
			//This string indicates where the PC is in the memory table view
			//It will only be shown during CPU execution or step-thru execution
			if (_CPU.PC == i && (_CPU.isExecuting == true || _CPU.stepMode == true))
				PCstring = "**";
			else
				PCstring = "  ";

			memoryString += PCstring + zeroPad(i.toString(16), 3) + "  |  " +
					zeroPad(_Memory.mem[i].toString(16), 2) + "  |   " +
					zeroPad(_Memory.mem[i].toString(2), 8) + "   |   " +  
					zeroPad(_Memory.mem[i].toString(10), 3) + "   |   " +
					String.fromCharCode(_Memory.mem[i]) + "\n";
		}
	}
	else {
		for (var i = 0; i < _Memory.memoryLimit; i++) {
			memoryString += zeroPad(_Memory.mem[i].toString(16), 2) + " ";
			if (modulo(i + 1, 16) == 0) {
				memoryString += "\n";
			}
		}
	}

	_MemoryDisplay.value = memoryString;

	//Update the CPU table view

	var CPUString = "PC    \t-\t" + _CPU.PC + "\t0x" + zeroPad(_CPU.PC.toString(16), 2) + "\n"
		+ "Acc   \t-\t" + _CPU.Acc + "\n"
		+ "X Reg \t-\t" + _CPU.Xreg + "\n"
		+ "Y Reg \t-\t" + _CPU.Yreg + "\n"
		+ "Z Flag\t-\t" + _CPU.Zflag + "\n\n"
		+ "Executing: " + _CPU.isExecuting + "\n"
		+ "Step Mode: " + _CPU.stepMode;

	_CPUDisplay.value = CPUString;

}


// 
// Interrupt Handling
// 
function krnEnableInterrupts()
{
    // Keyboard
    hostEnableKeyboardInterrupt();
    // Put more here.
}

function krnDisableInterrupts()
{
    // Keyboard
    hostDisableKeyboardInterrupt();
    // Put more here.
}

function krnInterruptHandler(irq, params)    // This is the Interrupt Handler Routine.  Pages 8 and 560.
{
    // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
    krnTrace("Handling IRQ~" + irq);

    // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
    // TODO: Consider using an Interrupt Vector in the future.
    // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.  
    //       Maybe the hardware simulation will grow to support/require that in the future.
    switch (irq)
    {
        case TIMER_IRQ: 
            krnTimerISR();                   // Kernel built-in routine for timers (not the clock).
            break;
        case KEYBOARD_IRQ: 
            krnKeyboardDriver.isr(params);   // Kernel mode device driver
            _StdIn.handleInput();
            break;
        default: 
            krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
    }
}

function krnTimerISR()  // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver).
{
    // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
}   



//
// System Calls... that generate software interrupts via tha Application Programming Interface library routines.
//
// Some ideas:
// - ReadConsole
// - WriteConsole
// - CreateProcess
// - ExitProcess
// - WaitForProcessToExit
// - CreateFile
// - OpenFile
// - ReadFile
// - WriteFile
// - CloseFile


//
// OS Utility Routines
//
function krnTrace(msg)
{
   // Check globals to see if trace is set ON.  If so, then (maybe) log the message. 
   if (_Trace)
   {
      if (msg === "Idle")
      {
         // We can't log every idle clock pulse because it would lag the browser very quickly.
         if (_OSclock % 10 == 0)  // Check the CPU_CLOCK_INTERVAL in globals.js for an 
         {                        // idea of the tick rate and adjust this line accordingly.
            hostLog(msg, "OS");
         }         
      }
      else
      {
       hostLog(msg, "OS");
      }
   }
}
   
function krnTrapError(msg)
{
    hostLog("OS ERROR - TRAP: " + msg);
	_OsShell.shellBSOD();
    krnShutdown();
}
