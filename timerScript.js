//Template for making the two input objects
class Input {
  constructor(element, errorMaxElement, max){
    this.element=document.getElementById(element); //HTML element ID
    this.errorMaxElement=document.getElementById(errorMaxElement); //the HTML element ID of the error displayed when element's input value exceeds maximum
    this.max=max; //the maxiumum value accepted for input
    this.isValid=false; //used to check the validity of the input value, initialized to false
  };
  getValue=()=> this.element.value; 
  disable =()=> this.element.disabled=true; 
  enable =()=> this.element.disabled=false;
  resetValue =()=> this.element.value="0"; 
  displayMaxError =()=> this.errorMaxElement.style.color="red"; //error message is made visible by setting its text color to red
  hideMaxError =()=> this.errorMaxElement.style.color=""; //error message is hidden by reverting its text color to its default
  makeBorderRed =()=>this.element.style.border= "2px solid red"; //sets border color of input field to red
  revertBorderRed =()=> this.element.style.border = ""; //reverts border color of input field to its default

  checkValidInput(){
    if(this.element.value>this.max){ //if input value exceeds maximum (this.max)
      this.makeBorderRed(); 
      this.displayMaxError();
      this.isValid=false;
      errorNegInput.hide(); //in the event the user inputs a negative value followed directly by a value exceeding the maximum, the errorNegInput message should be hidden
    }
    else if(this.element.value<0 || isNaN(parseInt(this.element.value))){ //if input is negative or NaN
      this.hideMaxError();
      this.makeBorderRed();
      errorNegInput.display();
      this.isValid=false;
    }
    else{ //input is valid
      this.revertBorderRed();
      errorNegInput.hide();
      this.hideMaxError();
      this.isValid=true;
    }
  }
};


//Template for creating the two button objects
class Button{
  constructor(elementID){
    this.element=document.getElementById(elementID); //HTML element ID of associated button element
  }
  disable =()=> this.element.disabled=true;
  enable =()=> this.element.disabled=false;
}


class StartButton extends Button{
  constructor(elementID){
    super(elementID);
    this.isGreen=true;
  }

  //EFFECTS: Sets background color of button to green and changes text to "START"
  turnGreen(){
    this.element.style.backgroundColor="#1ac400"; 
    this.element.innerHTML="START";
    this.isGreen=true; 
  }

  //EFFECTS: Sets background color of button to red and changes text to "STOP"
  turnRed(){
    this.element.style.backgroundColor="red"; 
    this.element.innerHTML="STOP";
    this.isGreen=false; 
  }

  //EFFECTS: Depending on the scenario, the button is changed between start and stop
  changeMode(){
    if(this.isGreen && timer.isStarted){ //timer must be started, otherwise there was invalid user input and timer was not started
        this.turnRed();
        resetButton.disable(); //the option to reset the timer is disabled
        if(!timer.isRunning) //if timer is not running, this means the timer was paused (stopped) and needs to continue
          timer.startCountdown();   
    } 
    else{
        this.turnGreen();
        timer.stopCountdown(); //this will pause the countdown
        resetButton.enable(); //the option to reset the timer is enabled
    }
  }
}

const startButton = new StartButton("startBtn"); //the object for the start/stop button
const resetButton = new Button("resetBtn"); //the object for the reset button
const secondsInput = new Input("secs", "errSec", 59);  //the object for the user's input for 'seconds'
const minutesInput = new Input("mins", "errMin", 100);  //the object for the user's input for 'minutes'

//The error displayed when either of the inputs is negative or when user attempts to start timer with 0 mins/0 secs
const errorNegInput= {
  element:document.getElementById("errNeg"), //HTML element ID of error message element

  //EFFECTS: Error message is displayed by setting text color to red
  display: function(){
    this.element.style.color="red";  //error is displayed by setting text color to red
  },
  
  //EFFECTS: If inputs are both not negative AND not NaN, error message is hidden by reverting text color to its default (the background color of the webpage)
  hide: function(){ 
    if(!isEitherInputsNegative() && !isEitherInputsNaN()){
      this.element.style.color="";
    }
  }
};

const timer = {
  digits:document.getElementById("timerCont"),   //refers to the HTML timer container containing all digits
  minutesDigit:document.getElementById("minutes"),   //the two digits that display this.minutesLeft
  secondsDigit:document.getElementById("seconds"),   //the two digits that display this.secondsLeft
  totalSeconds:0,   //total seconds combined taken from user input
  secondsLeft:0,   //number of seconds left in minute cycle
  minutesLeft:0,   //total number of minutes left 
  interval:0,   //used to start/stop countdown
  isRunning:false, 
  isStarted:false,
  
  //EFFECTS: Sets the text color of the digits on the clock to red
  setDigitsRed: function(digits){ 
    this.digits.style.color="red";
  },

  //EFFECTS: Reverts text color of the digits to their default color (black)
  setDigitsBlack: function(digits){
    this.digits.style.color="";
  },

  //EFFECTS: Resets the display of digits on the clock
  resetDigits: function(){
    this.minutesDigit.innerHTML="00";
    this.secondsDigit.innerHTML="00";
  },

  //EFFECTS: Resets timer and associated variables 
  resetTimer: function(){
    this.resetDigits();
    this.isRunning=false;
    this.isStarted=false;
    startButton.turnGreen();
    resetInputs();
    resetButton.enable();
    enableInputs();
    this.setDigitsBlack(); 
    this.stopCountdown();
  },
  
  getTotalSeconds: ()=> this.totalSeconds,

  //EFFECTS: If this.secondsLeft is below 10, a '0' will preceed the value for increased aesthetics, ex. instead of 6, the clock will display 06
  displaySeconds: function(){
    if(this.secondsLeft<10) 
      this.secondsDigit.innerHTML="0" + this.secondsLeft;
    else
      this.secondsDigit.innerHTML= this.secondsLeft;
  },
 
  //EFFECTS: If this.minutesLeft is below 10, a '0' will preceed the value for increased aesthetics, ex. instead of 9, the clock will display 09
  displayMinutes: function(){
    if(this.minutesLeft<10) 
      this.minutesDigit.innerHTML="0" + this.minutesLeft;
    else
      this.minutesDigit.innerHTML= this.minutesLeft;
  },

  updateMinutesLeft: function(){
    this.minutesLeft= Math.floor(this.totalSeconds/60);
  },

  updateTotalSeconds: function(){
    this.totalSeconds=(parseInt(minutesInput.getValue()))*60 + parseInt(secondsInput.getValue());
  },

  updateSecondsLeft: function() {
    this.secondsLeft= this.totalSeconds- this.minutesLeft*60;
    if(this.secondsLeft== -1 && this.totalSeconds!=-1)
      this.secondsLeft=59;
  },

  startCountdown: function(){
    this.interval=setInterval(this.displayDigits.bind(this), 1000);
    this.isRunning=true;
  }, 

  stopCountdown: function(){
    clearInterval(this.interval);
    this.isRunning=false;
  },
  
  //EFFECTS: Displays the digits on the clock and updates once every second (used in interval)
  displayDigits: function(){
    if(!this.isRunning)
      this.isRunning=true;

    if(this.totalSeconds>=0 && this.totalSeconds<=3){ //if there's less than 4 seconds left, the digits are turned red 
        this.setDigitsRed();
    }
    else{
        this.setDigitsBlack(); 
    }
 
    this.displaySeconds();
    this.displayMinutes();
    this.totalSeconds--;
    this.updateMinutesLeft(); //SEE IF CAN PUT AS INSTANCE VARIABLE IF IT UPDATES AUTOMATICALLY
    this.updateSecondsLeft();
   
    if(this.totalSeconds== -1) //if countdown is finished, timer is reset
        this.resetTimer();
  },

  //EFFECTS: If both inputs are valid and timer has not already been started, timer is started
  start: function(){
    if(isBothInputsValid()==true && this.isStarted!=true){
      this.updateTotalSeconds();
      this.updateMinutesLeft();
      this.updateSecondsLeft();
      this.isStarted=true;
      disableInputs();
      this.displayDigits();
      this.startCountdown();
    }
  }

};

//EFFECTS: Returns true if BOTH input values are valid
var isBothInputsValid = () => secondsInput.isValid && minutesInput.isValid; 

//EFFECTS: Returns true if ONE or BOTH input values are negative
var isEitherInputsNegative = () => secondsInput.getValue()<0 || minutesInput.getValue()<0; 

//EFFECTS: Returns true if ONE or BOTH input values are NaN
var isEitherInputsNaN = () => isNaN(parseInt(secondsInput.getValue())) || isNaN(parseInt(minutesInput.getValue())); 

var enableInputs = () => { 
  secondsInput.enable();
  minutesInput.enable();
};

var disableInputs = () => {
  secondsInput.disable();
  minutesInput.disable();
};

//EFFECTS: Resets input values to 0
var resetInputs = () => { 
  secondsInput.resetValue();
  minutesInput.resetValue();
};

//EFFECTS: Checks if input values are NaN, too low, or too high
var validateInputs = () =>{
  minutesInput.checkValidInput();
  secondsInput.checkValidInput();
  if(secondsInput.getValue()==0 && minutesInput.getValue()==0)
    errorNegInput.display();
};

//EFFECTS: Displays date on page
var displayDate = () => {
    let today = new Date();
    const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let month = months[today.getMonth()];
    let day = weekdays[today.getDay()];
    document.getElementById("date").innerHTML= day+", "+month+" "+today.getDate()+", " +today.getFullYear();
};
