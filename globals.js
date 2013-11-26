/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "noOSe";
var APP_VERSION = "0.3 - keyboard cat";
var APP_DESCRIPTION = "Notably Optimistic Operating System for Enjoyment!"

var CPU_CLOCK_INTERVAL = 50;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

var CONTEXT_SWITCH_IRQ = 2;
//var PROCESS_READY_IRQ = 3;


//
// Global Variables
//
var _CPU = null;
var _Memory = null;
var _MemoryManager = null;
var _CpuScheduler = null;

var _OSclock = 0;       // Page 23.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

var _ScrollCutoff = 20;		  // Space to leave at the bottom of the canvas when scrolling.
var _LineHeight = 17;		  //height of a single CLI line.

var _StatusBar = null;		  //Initialized in hostInit().
var _Status = "Keys, please.";		  //Current status of the OS

var _ProgramInput = null;	  //Initialized in hostInit().
var _MemoryDisplay = null;        //Initialized in hostInit().
var _CPUDisplay = null;		  //Initialized in hostInit().
var _ReadyQueueDisplay = null;	//Initialized in hostInit().

var _MemoryDisplayMode = 0;	//0 = detailed single row view, 1 = simple grid view

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
