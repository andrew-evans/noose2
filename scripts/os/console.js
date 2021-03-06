/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
	this.commandHistory = new Array();
	this.commandIndex = -1;
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
       	while (_KernelInputQueue.getSize() > 0)
       	{
           // Get the next character from the kernel input queue.
           	var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
		   	if (chr == String.fromCharCode(8))
		   	{
				var removed = this.buffer.substr(this.buffer.length - 1);
				this.buffer = this.buffer.substr(0, this.buffer.length - 1);
				this.deleteText(removed);
		   	}
           	else if (chr == String.fromCharCode(13))  //     Enter key
           	{
				// The enter key marks the end of a console command, so ...
				// ... tell the shell ...
				_OsShell.handleInput(this.buffer);
				// ... update the command history ...
				this.commandHistory.push(this.buffer);
				this.commandIndex = this.commandHistory.length;
				// ... and reset our buffer.
				this.buffer = "";
           	}
			else if (chr == String.fromCharCode(20))		//Caps Lock
			{
				krnKeyboardDriver.capsLock = !krnKeyboardDriver.capsLock;
			}
			else if (chr == String.fromCharCode(17))		//Up arrow
			{
				if (this.commandIndex >= 0)
				{
					this.commandIndex = Math.max(0, this.commandIndex - 1);
					this.buffer = this.commandHistory[this.commandIndex];
					this.clearLine();
					_OsShell.putPrompt();
					this.putText(this.buffer);
				}
			}
			else if (chr == String.fromCharCode(18))		//Down arrow
			{
				if (this.commandIndex < this.commandHistory.length)
				{
					this.commandIndex = Math.min(this.commandHistory.length - 1, this.commandIndex + 1);
					this.buffer = this.commandHistory[this.commandIndex];
					this.clearLine();
					_OsShell.putPrompt();
					this.putText(this.buffer);
				}
			}
			// TODO: Write a case for Ctrl-C.
			else
			{
			   // This is a "normal" character, so ...
			   // ... draw it on the screen ...
			   this.putText(chr);
			   // ... and add it to our buffer.
			   this.buffer += chr;
			}
       	}
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };

	this.deleteText = function(text) {
		if (text !== "")
		{
			var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
			this.CurrentXPosition = this.CurrentXPosition - offset;
			//Ron Coleman would be proud of these magic numbers.
			//TODO: get rid of them.
			_DrawingContext.clearRect(this.CurrentXPosition, this.CurrentYPosition + 7,
				offset, -_LineHeight - 4);
		}
	};

    this.advanceLine = function() {
		this.CurrentXPosition = 0;
		
		if (this.CurrentYPosition >= _Canvas.height - _ScrollCutoff)
		{
			var screenPart = _DrawingContext.getImageData(0, _LineHeight, _Canvas.width, _Canvas.height);
			_DrawingContext.clearRect(0,0, _Canvas.width, _Canvas.height);
			_DrawingContext.putImageData(screenPart, 0, 0);
		}
		else
		{
			this.CurrentYPosition += _LineHeight;
		}
    };

	this.clearLine = function() {
		this.CurrentXPosition = 0;
		_DrawingContext.clearRect(0, this.CurrentYPosition + 7, _Canvas.width, -_LineHeight - 4);
	};
}
