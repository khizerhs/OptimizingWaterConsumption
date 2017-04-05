#define FLOWMETERPIN       2
unsigned int SOLENOIDPIN ;
volatile byte pulseCount;  
unsigned long oldTime;
float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;
unsigned int waterPouringTime = 5000;

void setup() {
  Serial.begin(9600);  
  SOLENOIDPIN = 4;
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  pinMode(SOLENOIDPIN, OUTPUT); 

  //***************************************************////
  //************FLOW METER SENSOR SETUP****************///
  //***************************************************///
  pinMode(FLOWMETERPIN, INPUT);
  digitalWrite(FLOWMETERPIN, HIGH);
  
  pulseCount        = 0;
  flowRate          = 0.0;
  flowMilliLitres   = 0;
  totalMilliLitres  = 0;
  oldTime           = 0;

  // The Hall-effect sensor is connected to pin 2 which uses interrupt 0.
  // Configured to trigger on a FALLING state change (transition from HIGH
  // state to LOW state)
  attachInterrupt(0, pulseCounter, FALLING);
  //***************************************************////
  //************FLOW METER SENSOR SETUP****************///
  //***************************************************///

}

void loop() {
  totalMilliLitres = 0.0;
  unsigned int state = digitalReadOutputPin(SOLENOIDPIN);
  if(state == LOW){
    digitalWrite(SOLENOIDPIN, HIGH);
    Serial.println("Valve opened!!!");
  }
  //Pour water during water pouring time
  unsigned long oldTime = millis();
  while(millis() - oldTime < waterPouringTime){   
    calculateFlow();
  }
  state = digitalReadOutputPin(SOLENOIDPIN);
  if(state == HIGH){
    digitalWrite(SOLENOIDPIN, LOW);
    Serial.println("Valve closed!!!");
    // Print the cumulative total of litres flowed since starting
    Serial.print(" Output Liquid Quantity: ");             // Output separator
    Serial.print(totalMilliLitres);
    Serial.println("mL"); 
  }

  delay(3000);

}

int digitalReadOutputPin(uint8_t pin)
{
 uint8_t bit = digitalPinToBitMask(pin);
 uint8_t port = digitalPinToPort(pin);
 if (port == NOT_A_PIN) 
   return LOW;

 return (*portOutputRegister(port) & bit) ? HIGH : LOW;
}

/*
Insterrupt Service Routine
 */
void pulseCounter()
{
  // Increment the pulse counter
  pulseCount++;
}

void calculateFlow(){
  
  if((millis() - oldTime) > 1000)    // Only process counters once per second
  { 
    // Disable the interrupt while calculating flow rate and sending the value to
    // the host
    detachInterrupt(0);
        
    // Because this loop may not complete in exactly 1 second intervals we calculate
    // the number of milliseconds that have passed since the last execution and use
    // that to scale the output. We also apply the calibrationFactor to scale the output
    // based on the number of pulses per second per units of measure (litres/minute in
    // this case) coming from the sensor.
    
    float calibrationFactor = 6.5;
    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;
    
    // Note the time this processing pass was executed. Note that because we've
    // disabled interrupts the millis() function won't actually be incrementing right
    // at this point, but it will still return the value it was set to just before
    // interrupts went away.
    oldTime = millis();
    
    // Divide the flow rate in litres/minute by 60 to determine how many litres have
    // passed through the sensor in this 1 second interval, then multiply by 1000 to
    // convert to millilitres.
    flowMilliLitres = (flowRate / 60) * 1000;
    
    // Add the millilitres passed in this second to the cumulative total
    totalMilliLitres += flowMilliLitres;
      
    // Print the flow rate for this second in litres / minute
    Serial.print("Flow rate: ");
    Serial.print(int(flowRate));  // Print the integer part of the variable
    Serial.println(" L/min");
    //Serial.print("\t");       // Print tab space
    
      // Reset the pulse counter so we can start incrementing again
    pulseCount = 0;
    
    // Enable the interrupt again now that we've finished sending output
    attachInterrupt(0, pulseCounter, FALLING);
  }

}
