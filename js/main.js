var keys = document.querySelectorAll('.keys div');
var isDecimal = false;
var isMinus = false;
var isSolved = false;
var isRoot = false;
var isConverted = false;
var input = document.querySelector('.screen');
var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var root = '√';
var openBr = 0;
var closedBr = 0;
var operators = ['+', '-', '×', '÷'];

for(var i = 0; i < keys.length; i++)
{
	keys[i].onclick = function(e){

		input.style.fontSize = "16px";
		var equation = input.innerHTML;
		console.log(equation.length);
		var keyVal = this.innerHTML;
		if(equation.length == 42)//42 elements is max length of equation
		{
			if (keyVal == '=') solveHandler();
			else if (keyVal == 'C' || keyVal == 'CE') clearHandler(keyVal);
		}
		else{
			if (keyVal == 'C' || keyVal == 'CE') clearHandler(keyVal);
			else if (keyVal == '=') solveHandler();
			else if (keyVal == '(' || keyVal == ')') parenthesesHandler(keyVal);
			else if (keyVal == '√') rootHandler();
			else if (keyVal == '.') decimalHandler();
			else if (operators.indexOf(keyVal) > -1) operatorHandler(keyVal);
			else if (keyVal == '+ab') infixToPrefix();
			else if (keyVal == 'ab+') infixToPostfix();
			else numbersHandler(keyVal);
		}
	}
}

function clearHandler(keyVal){
	if(keyVal == 'C')//deleting everything if C was clicked
	{
		input.innerHTML = '';
	}
	else//deleting everything before last operator, if CE was clicked
	{
		var equation = input.innerHTML;
		var i = equation.length;
		while(i > 0)
		{
			if(operators.indexOf(equation[i]) > -1)
			{
				equation = equation.slice(0, i+1);
				break;
			}
			else i--;
		}
		input.innerHTML = equation;
	}
	isRoot = false;
	isDecimal = false;
	
}

function solveHandler(){
	var equation = input.innerHTML;
	var lastElm = equation[equation.length-1];
	var sqrt1 = "Math.sqrt(";
	var sqrt2 = ")";

	if(operators.indexOf(lastElm) > -1 || lastElm == '.')
	{
		equation = equation.slice(0, -1);
	}
	if(equation)
	{
		equation = equation.replace(/×/g, '*').replace(/÷/g, '/');//replacing × and ÷ with * and / to be able to eval the equation string
		equation = equation.replace(new RegExp('\\' + root + '(\\d+\\.*\\d*)', 'ig'), sqrt1 + "$1" + sqrt2);//replacing root sign with Math.sqrt() function
		if(openBr > closedBr)//checking if number of open brackets equals to number of closed brackets
		{
			while(openBr > closedBr)//if it's not, then adding closing brackets
			{
				equation +=")";
				closedBr++;
			}
		}
		var result = eval(equation);
		
		decimalParser(result);//preventing JS's problem with float numbers
	}
	else if(equation)
	{
		input.innerHTML = 'Error';
	}
	isRoot = false;
	isSolved = true;
	isDecimal = false;
}

/*Preventing multiple decimals. eg: 0.1+0.2 will return 0.30000000000000004. With this function it will return 0.3 */
function decimalParser(result){
	var d = '.';
	result+='';
	if(result.indexOf(d) > -1)
	{
		var repeats = 0;
		var previous = 'a';
		for(var i = 0; i < result.length-1; i++)
		{
			if(result[i] == previous)
			{
				repeats++;
				if(repeats > 5)
				{
					result = result.slice(0, i-6);
					break;
				}
			} 
			else {
				repeats = 0;
			}
			previous = result[i];
		}
		input.innerHTML = result;
	}
	else
	{
		input.innerHTML = result;
	}
	isSolved = true;
	isDecimal = false;
	isRoot = false;
}

/*When '(' or ')' button is pressed*/
function parenthesesHandler(keyVal){
	isDecimal = false;
	isSolved = false;
	var equation = input.innerHTML;
	var lastElm = equation[equation.length-1];
	
	if (keyVal == '(')
	{
		if(operators.indexOf(lastElm) > -1 || equation.length == 0 || lastElm == '(')
		{
			input.innerHTML += '(';
			openBr++;	
		}
		else return;
	}
	else if (keyVal == ')')
	{
		if(equation.length == 1 && lastElm == '(')
		{
			input.innerHTML = '';
			openBr = 0;
			closedBr = 0;
		}
		else if (openBr > closedBr)
		{
			if (lastElm == '(')
			{

				equation = equation.slice(0, -1);
				input.innerHTML = equation;
				openBr --;
			}
			else
			{
				input.innerHTML += ')';
				closedBr++;
			}
		}
		else return;
	}	
}

function rootHandler(){
	var dot = '.';
	var lastElm = input.innerHTML[input.innerHTML.length-1];
	var equation = input.innerHTML;
	if(isRoot == false && numbers.indexOf(lastElm) < 0 && dot.indexOf(lastElm) < 0)
	{
			input.innerHTML+='√';
			isRoot = true;
	}
	else if (isRoot == false && numbers.indexOf(lastElm) > -1)
	{
		input.innerHTML='√';
		isRoot = true;
	}
	else if(isRoot == true)
	{
		if(root == lastElm)
		{
			equation = equation.slice(0, -1);
			input.innerHTML = equation;
			isRoot = false;	
		} 
	}
	isDecimal = false;
	isSolved = false;
}

function decimalHandler(){
	var lastElm = input.innerHTML[input.innerHTML.length-1];
	var zero = '0';
	if(isSolved == true)
	{
		input.innerHTML = '0.';
		isDecimal = true;
		isSolved =false;
		isRoot = false;
	}
	else if(isDecimal == false && numbers.indexOf(lastElm) > -1)
	{
		input.innerHTML+='.';
		isDecimal = true;
	}
	else if(isDecimal == false && numbers.indexOf(lastElm) < 0)
	{
		input.innerHTML+='0.';
		isDecimal = true;
	}
}

function operatorHandler(keyVal){
	var equation = input.innerHTML;
	var dot = '.';
	var lastElm = equation[equation.length-1];


	if (isConverted)
	{
		input.innerHTML = '';
		isConverted = false;
	}
	else if(root == lastElm)
	{
		equation = equation.slice(0, -2);
		equation += keyVal;
		input.innerHTML = equation;
	}
	else if(dot == lastElm)
	{
		
		equation = equation.slice(0, -1);
		equation += keyVal;
		input.innerHTML = equation;
	}
	else if(equation != '' && operators.indexOf(lastElm) == -1)
	{
		input.innerHTML += keyVal;
	}
	else if (operators.indexOf(lastElm) > -1 && equation.length > 1)
	{
		equation = equation.slice(0, -1);
		equation += keyVal;
		input.innerHTML = equation;
	}


	isSolved = false;
	isDecimal = false;
	isRoot = false;
}

function numbersHandler(keyVal)
{
	var result = input.innerHTML;
	var lastElm = result[result.length-1];

	if(keyVal == '0')
	{
		if(isSolved) input.innerHTML='';
		else
		{
			var dot = '.';
			if(numbers.indexOf(lastElm) > -1 || dot.indexOf(lastElm) > -1 )
			{
				input.innerHTML+='0';
			}
		}	
	}
	else
	{
		if (isSolved && result || isConverted)
		{
			openBr = 0;
			closedBr = 0;
			input.innerHTML = keyVal;
		}
		else
		{
			input.innerHTML += keyVal;
		}	
	}

	isConverted = false;
	isSolved = false;
}

/*--------postfix-prefix part----------*/


	var infixOperators = {
	    "*": {
	        precedence: 3
	    },
	    "/": {
	        precedence: 3
	    },
	    "+": {
	        precedence: 2
	    },
	    "-": {
	        precedence: 2
	    }
	}

function isNumeric(n)//checking if element is number 
	{
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	function cleanSpaces(input)//deleting uneeded spaces in equation if there are any
	{
		for (var i = 0; i < input.length; i++)
		{
			input[i] === " " ? input.splice(i, 1) : input;
			input[i] === "" ? input.splice(i, 1) : input;
		}
		return input;
	}
	function cleaner(input)//deleting parenthesis if they are in equation
	{
		for (var i = 0; i < input.length+1; i++)
		{
			if(input[i] === ")" || input[i] === "(")
			{
				input.splice(i, 1);
			}
		}
		return input;
	}

	function infixToPrefix(input)
	{
		var theScreen = document.querySelector('.screen');
		var input = theScreen.innerHTML;
		input = input.replace(/×/g, '*').replace(/÷/g, '/');
  		input = input.split(/([\+\-\*\/\(\)\)])/);
		
		input = cleanSpaces(input);

		var prefixOutput = "";
		var j = 0;
		
		var operatorStack = [];
		var operandStack = [];
		var outputStack = [];
		input.reverse();

		for (var i = 0; i < input.length; i++)
		{
			var item = input[i];
			if (isNumeric(item) || /√\d+\.*\d*/ig.test(item))//checking if item is number or root equation
			{
				outputStack.push(item);
			}
			else if(item === ')')//working with parentheses
			{
				operatorStack.push(item);
			}
			else if(item === '(')//working with parentheses
			{
				for(var k = 0; k < operatorStack.length-1; k++)
				{
					if (operatorStack[operatorStack.length-1] != ')')
					{
						var l = operatorStack.pop();
						outputStack.push(l);
					}
					else
					{
						operatorStack.pop();
					}
				}
			}
			else if("*/+-".indexOf(item) !== -1)//pushing operators to the stack
			{
				if (operatorStack.length > 0)
				{
					var op1 = item;
					var op2 = operatorStack[operatorStack.length-1];

					if ("*/+-".indexOf(op2) !== -1 && infixOperators[op1].precedence >= infixOperators[op2].precedence)
					{
						operatorStack.push(op1);
					}
					else
					{
						while ("*/+-".indexOf(op2) !== -1 && infixOperators[op1].precedence <= infixOperators[op2].precedence)
						{
							op2 = operatorStack[operatorStack.length-1];
							var l = operatorStack.pop();
							outputStack.push(l);							
						}
						operatorStack.push(op2);
						operatorStack.push(op1);
					}
				}
				else if("*/+-".indexOf(item) !== -1)
				{
					operatorStack.push(item);
				}	
			}	
		}
		operatorStack = cleaner(operatorStack);//clening unneeded paretheses
		while (operatorStack.length > 0)//putting every operator that is left to our result
		{
			var l = operatorStack.pop();
			outputStack.push(l);
		}
		outputStack.reverse();
		outputStack = cleaner(outputStack);//clening unneeded paretheses
		prefixOutput = outputStack.join(' ');
		
		var output = document.querySelector('.screen');
		var result  = prefixOutput.replace(/\*/g, '×').replace(/\//g, '÷');
		if(result.length > 40)
		{
			output.style.fontSize = "10px";
		}
		output.innerHTML = result;

		isSolved = true;
		isConverted = true;

	}

	function infixToPostfix(input)
	{
		var theScreen = document.querySelector('.screen');
		var input = theScreen.innerHTML;

		input = input.replace(/×/g, '*').replace(/÷/g, '/');
  		input = input.split(/([\+\-\*\/\(\)\)])/);
  		input = cleanSpaces(input);

		var postfixOutput = "";
		var operatorStack = [];

		for (var i = 0; i < input.length; i++)
		{
			var item = input[i];
			
			if (isNumeric(item) || /√\d+\.*\d*/ig.test(item))//checking if item is number or root equation
			{
				postfixOutput += item + ' ';
			}
			else if ("*/+-".indexOf(item) !== -1)//pushing operators to the stack
			{
				var op1 = item;
				var op2 = operatorStack[operatorStack.length-1];
				while ("*/+-".indexOf(op2) !== -1 && infixOperators[op1].precedence <= infixOperators[op2].precedence)
				{
					postfixOutput += operatorStack.pop() + ' ';
					op2 = operatorStack[operatorStack.length-1];
				}
				operatorStack.push(op1);
			}
			else if (item === '(')//working with parentheses
			{
				operatorStack.push(item);
			}
			else if (item === ')')//working with parentheses
			{
				while (operatorStack[operatorStack.length-1] !== '(')
				{
					postfixOutput += operatorStack.pop() + ' ';
				}
				operatorStack.pop();
			}
		}
		operatorStack = cleaner(operatorStack);//clening unneeded paretheses
		while (operatorStack.length > 0)//putting every operator that is left to our result
		{
			postfixOutput += operatorStack.pop() + ' ';
		}
		var output = document.querySelector('.screen');
		var result  = postfixOutput.replace(/\*/g, '×').replace(/\//g, '÷');
		if(result.length > 40)
		{
			output.style.fontSize = "10px";
		}
		output.innerHTML = result;

		isSolved = true;
		isConverted = true;
	}