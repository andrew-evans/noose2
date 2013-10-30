/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
	this.process = null;
	this.stepMode = false;

	//probably bad, but we will use this to track the location of bad op codes.
	//by the time the op code is read, the PC has already moved.
	this.lastPC = 0;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;
        this.isExecuting = false;
    };

	this.loadPCB = function(pcb) {
		this.PC    = pcb.PC;
        this.Acc   = pcb.Acc;
        this.Xreg  = pcb.Xreg;
        this.Yreg  = pcb.Yreg;
        this.Zflag = pcb.Zflag;
	};

	//sets up the CPU to run a given process from a control block.
	this.run = function(process) {
		this.process = process;
		this.process.state = "RUNNING";
		this.loadPCB(process);
		this.isExecuting = true;
	};

	//ends the execution of the process.
	this.terminate = function(expected) {
		this.isExecuting = false;

		//update the PCB
		this.process.state = "TERMINATED";

		if (expected == true) {
			this.process.resetCPU();
			if (this.stepMode == true) {
				_StdIn.putTextAbovePrompt("Step-thru execution completed.");
			}
		}
		else {
			_StdIn.putTextAbovePrompt("Program " + this.process.pid + " execution ended unexpectedly.");
			this.process.saveCPU();
		}

		//The process ended somehow, so we turn off step mode.
		this.stepMode = false;
		
	};
    
    this.cycle = function() {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.

		if (this.process.state === "TERMINATED") {
			//Program did not reach the end, so it was not expected.
			this.terminate(false);
		}

		//fetch the next instruction
		var instr = this.fetch();
		krnTrace(instr);
		//execute the instruction
		this.execute(instr);
		if (this.stepMode == true) {
			this.isExecuting = false;
		}
    };

	//fetches the current byte in memory and increments the PC
	this.fetch = function() {
		return _MemoryManager.readValue(this.PC++);
	};

	this.execute = function(instr) {
		
		//set up some temporary variables for ease of reading
		var address = -1;
		var value = 0;
		var string = "";

		//this function uilizes the fetch() function but this is NOT a fetch cycle
		//TODO: I may rewrite this later for clarity.

		//check the instruction that was fetched from the location in PC
		//for each instruction, we must make sure we "fetch" the correct
		//number of bytes following the instruction depending on the instr.
		//to this end, if one byte is needed, we can call fetch() (for now...)
		//if two bytes are needed, the function getAddress() can be called.

		switch (instr) {
			//LDA
			//get the next byte and load it into the acc
			case (0xA9):
				value = this.fetch();
				this.Acc = value;
				break;

			//LDA*
			//get the next two bytes as an address, read the value from it,
			//and load it into the acc
			case (0xAD):
				address = this.getAddress();
				value = _MemoryManager.readValue(address);
				this.Acc = value;
				break;

			//STA
			//get the next two bytes as the address to store to.
			//get the acc value and write it to the address
			case (0x8D):
				address = this.getAddress();
				value = this.Acc;
				_MemoryManager.writeValue(value, address);
				break;

			//ADC
			//very similar to LDA, but adds to the existing value
			//in the acc, rather than overwriting it.
			case (0x6D):
				address = this.getAddress();
				value = _MemoryManager.readValue(address);
				this.Acc += value;
				break;

			//LDX
			//get the next byte and load it into the X Reg
			case (0xA2):
				value = this.fetch();
				this.Xreg = value;
				break;


			//LDX*
			//get the next two bytes as an address, read the value from it,
			//and load it into the X Reg
			case (0xAE):
				address = this.getAddress();
				value = _MemoryManager.readValue(address);
				this.Xreg = value;
				break;

			//LDY
			//get the next byte and load it into the Y Reg
			case (0xA0):
				value = this.fetch();
				this.Yreg = value;
				break;


			//LDY*
			//get the next two bytes as an address, read the value from it,
			//and load it into the Y Reg
			case (0xAC):
				address = this.getAddress();
				value = _MemoryManager.readValue(address);
				this.Yreg = value;
				break;

			//NOP
			//nothing to see here, folks...
			case (0xEA):
				break;

			//BRK
			//end the CPU execution
			case (0x00):
				this.terminate(true);
				break;

			//CPX
			//get the next two bytes as an address, read the value from it,
			//compare to the X Reg, and set the Z flag accordingly
			case (0xEC):
				address = this.getAddress();
				value = _MemoryManager.readValue(address);
				if (value == this.Xreg) {
					this.Zflag = 1;
				}
				else {
					this.Zflag = 0;
				}
				break;

			//BNE
			//if the Z flag is not set, increment the program counter by the
			//value obtained in the next byte.
			case (0xD0):
				//it is important that we "fetch" here regardless of the Z flag
				//this way, the following byte never gets seen as an op code.
				value = this.fetch();

				if (this.Zflag == 0) {
					this.PC = modulo(this.PC + value, _MemoryManager.memoryLimit);
				}
				break;

			//INC
			//get the next two bytes as an address, read the value from it,
			//increment it by one, and store it back to that address.
			case (0xEE):
				address = this.getAddress();
				value = _MemoryManager.readValue(address);
				value = modulo(value + 1, _MemoryManager.memoryLimit);
				_MemoryManager.writeValue(value, address);
				break;

			//SYS
			//check the value of the X reg.
			//if 1, print the value in the Y reg as an integer.
			//if 2, print the value from the address in the Y reg as a string.
			case (0xFF):
				if (this.Xreg == 0x01) {
					_StdIn.putTextAbovePrompt("" + this.Yreg);
				}
				else if (this.Xreg == 0x02) {
					address = this.Yreg;
					value = _MemoryManager.readValue(address);

					//Traverse the memory until we hit a 00, indicating that
					//the string has terminated.
					while (value != 0x00) {
						string += String.fromCharCode(value);
						address = modulo(address + 1, _MemoryManager.memoryLimit);
						value = _MemoryManager.readValue(address);
					}
					_StdIn.putTextAbovePrompt(string);
				}
				break;

			//None of the known op codes were reached, so we must end execution
			default:
				//give the user the relative last PC location
				//this will be the location in the program itself, not the location in memory!
				_StdIn.putTextAbovePrompt("Invalid op code " + instr.toString(16).toUpperCase() + " reached at line " + (this.lastPC - this.process.location + 1) + ".");
				this.terminate(false);
				break;
		}

		//update our magical last PC register after everything else happens.
		this.lastPC = this.PC;
	};

	//from the current location, "fetch" the next two bytes and combine them to
	//represent a single address.
	//We must fetch the lower ordinance byte first!
	this.getAddress = function() {
		return (this.fetch()) + (256 * this.fetch());
	};
}
