/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
	this.capsLock = false;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    var keyCode = params[0];
    var isShifted = params[1];

	//For letters, we want uppercase if either shift or caps is active, but not both.
	var needsUpper = isShifted ^ this.capsLock;

    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift/caps and re-adjust if necessary.
        if (needsUpper)
        {
            chr = String.fromCharCode(keyCode);
        }
        _KernelInputQueue.enqueue(chr);
    }
    else if (keyCode == 8) //backspace
    {
		chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr);
    }
    else if ((keyCode == 32)  ||   // space
             (keyCode == 13)  ||   // enter
			 (keyCode == 20))      // caps lock
    {
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr);
    }
	else if (keyCode == 38)		//up arrow
	{
		chr = String.fromCharCode(17);
		_KernelInputQueue.enqueue(chr);
	}
	else if (keyCode == 40)		//down arrow
	{
		chr = String.fromCharCode(18);
		_KernelInputQueue.enqueue(chr);
	}
	else if (keyCode == 19)		//Pause/Break
	{
		//I could have listed this with space, enter, etc
		//but it's a special case, so it goes here.
		//chr = String.fromCharCode(19);
		//_KernelInputQueue.enqueue(chr);
		if (_CPU.stepMode == true) {
			_CPU.isExecuting = true;
		}
	}
	else if ((keyCode >= 48) && (keyCode <= 57))
	{
		if (!isShifted)
		{
			chr = String.fromCharCode(keyCode);
		}
		else
		{
			//handle number key shift characters
			var keyValue;
			switch (keyCode)
			{
				case (48): keyValue = 41; break;
				case (49): keyValue = 33; break;
				case (50): keyValue = 64; break;
				case (51): keyValue = 35; break;
				case (52): keyValue = 36; break;
				case (53): keyValue = 37; break;
				case (54): keyValue = 94; break;
				case (55): keyValue = 38; break;
				case (56): keyValue = 42; break;
				case (57): keyValue = 40; break;
			}
			chr = String.fromCharCode(keyValue);
		}
		
		_KernelInputQueue.enqueue(chr);
	}
	else
	{
		//check for and handle misc. symbols
		var keyValue = -1;
		switch (keyCode)
		{
			case (173): if (!isShifted)
							keyValue = 45;
						else
							keyValue = 95;
						break;
			case (61): if (!isShifted)
							keyValue = 61;
						else
							keyValue = 43;
						break;
			case (192): if (!isShifted)
							keyValue = 96;
						else
							keyValue = 126;
						break;
			case (219): if (!isShifted)
							keyValue = 91;
						else
							keyValue = 123;
						break;
			case (221): if (!isShifted)
							keyValue = 93;
						else
							keyValue = 125;
						break;
			case (220): if (!isShifted)
							keyValue = 92;
						else
							keyValue = 124;
						break;
			case (59): if (!isShifted)
							keyValue = 59;
						else
							keyValue = 58;
						break;
			case (222): if (!isShifted)
							keyValue = 39;
						else
							keyValue = 34;
						break;
			case (188): if (!isShifted)
							keyValue = 44;
						else
							keyValue = 60;
						break;
			case (190): if (!isShifted)
							keyValue = 46;
						else
							keyValue = 62;
						break;
			case (191): if (!isShifted)
							keyValue = 47;
						else
							keyValue = 63;
						break;
			default: keyValue = -1;
			
		}
		if (keyValue != -1)
		{
			chr = String.fromCharCode(keyValue);
			_KernelInputQueue.enqueue(chr);
		}
		else
		{
			//We don't know how to handle it; yell at the log.
			//I really don't feel like this should BSOD the system, so it doesn't.
			//TODO: play some sort of error-y sound effect if possible
			krnTrace("Keystroke not recognized by OS");
		}
	}


}
