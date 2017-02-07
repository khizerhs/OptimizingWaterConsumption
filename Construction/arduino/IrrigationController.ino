// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

//#include "DHT.h"
#include "Wire.h"
#include "Ciao.h"
#include <dht.h>

dht DHT;

#define DHTPIN 3     // what digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
#define flowMeterPin       2
#define CONNECTOR   "rest" 
#define SERVER_ADDR   "api.thingspeak.com"
#define API_KEY "ORAYGP0SOPO0J1IB"

unsigned int solenoidPin = 4;
//byte sensorInterrupt = 0;  // 0 = digital pin 2
float calibrationFactor = 6.5;

volatile byte pulseCount;  

float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;

unsigned long oldTime;
unsigned long oldTime1;


float Count;
float SensorReading;
unsigned int lowerMoistureRange = 10;
unsigned int upperMoistureRange = 45;


void setup() {
  Ciao.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  pinMode(solenoidPin, OUTPUT); 
  
  
  
  //***************************************************////
  //************FLOW METER SENSOR SETUP****************///
  //***************************************************///
  pinMode(flowMeterPin, INPUT);
  digitalWrite(flowMeterPin, HIGH);
  Serial.begin(9600);  
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
  

  int chk = DHT.read22(DHTPIN);
    /*
    switch (chk)
    {
    case DHTLIB_OK:
        //stat.ok++;
        Serial.print("OK,\t");
        break;
    case DHTLIB_ERROR_CHECKSUM:
        //stat.crc_error++;
        Serial.print("Checksum error,\t");
        break;
    case DHTLIB_ERROR_TIMEOUT:
        //stat.time_out++;
        Serial.print("Time out error,\t");
        break;
    case DHTLIB_ERROR_CONNECT:
        //stat.connect++;
        Serial.print("Connect error,\t");
        break;
    case DHTLIB_ERROR_ACK_L:
        //stat.ack_l++;
        Serial.print("Ack Low error,\t");
        break;
    case DHTLIB_ERROR_ACK_H:
        //stat.ack_h++;
        Serial.print("Ack High error,\t");
        break;
    default:
        //stat.unknown++;
        Serial.print("Unknown error,\t");
        break;
    }*/
  
  Serial.print("Humidity ");
  Serial.print(DHT.humidity, 1);
  Serial.print(",\t\t");
  Serial.print("Temperature ");
  Serial.print(DHT.temperature, 1);
  Serial.print(",\t\t");
  Serial.println();

  unsigned int state = digitalReadOutputPin(solenoidPin);
  readSoilMoisture();
  totalMilliLitres = 0.0;
  
  String uri;
  uri = "/update?api_key=";
  uri += API_KEY;
  uri += "&field1=";
  uri += String(DHT.humidity);
  
  makeRequest(uri);
  
  uri = "/update?api_key=";
  uri += API_KEY;
  uri += "&field2=";
  uri += String(DHT.temperature);
  
  makeRequest(uri);
  
  uri = "/update?api_key=";
  uri += API_KEY;
  uri += "&field3=";
  uri += String(SensorReading);
  
  makeRequest(uri);
  
  while(SensorReading > 0 && SensorReading < lowerMoistureRange && SensorReading < upperMoistureRange){
      //if(state == LOW){
      //  digitalWrite(solenoidPin, HIGH);
      //  Serial.println("Valve opened!!!");
      //}
      //Delay 5 seconds
      oldTime1 = millis();
      while(millis() - oldTime1 < 5000){   
        calculateFlow();
      }
      readSoilMoisture();
  }
  
  state = digitalReadOutputPin(solenoidPin);
  if(state == HIGH){
    digitalWrite(solenoidPin, LOW);
    Serial.println("Valve closed!!!");
    // Print the cumulative total of litres flowed since starting
    Serial.print(" Output Liquid Quantity: ");             // Output separator
    Serial.print(totalMilliLitres);
    Serial.println("mL"); 
  }
  
  
  uri = "/update?api_key=";
  uri += API_KEY;
  uri += "&field3=";
  uri += String(SensorReading);
  
  makeRequest(uri);
  
  if(totalMilliLitres > 0){
    uri = "/update?api_key=";
    uri += API_KEY;
    uri += "&field4=";
    uri += String(totalMilliLitres);
    
    makeRequest(uri);
  }
    
}

void makeRequest(String uri){
    //Ciao.print("Sending request to thingspeak ");
    Ciao.println(uri);
    CiaoData data = Ciao.write(CONNECTOR, SERVER_ADDR, uri);
 
    if (!data.isEmpty()){
      Ciao.println( "State: " + String (data.get(1)) );
      Ciao.println( "Response: " + String (data.get(2)) );
    }
    else{ 
      Ciao.println("Write Error");
    }  
}

void readSoilMoisture(){
  Count = analogRead(A0);
  float Voltage = Count / 1023 * 5.0;// convert from count to raw voltage
  Serial.print("Analog read \t"); // tab character
  Serial.println(Count);
  SensorReading= -42 + Voltage * 108; //converts voltage to sensor reading
  //cont++;
  //}
  Serial.print("VWC \t"); // tab character
  Serial.println(SensorReading);
  
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
    //Serial.print("\t"); 		  // Print tab space
    
      // Reset the pulse counter so we can start incrementing again
    pulseCount = 0;
    
    // Enable the interrupt again now that we've finished sending output
    attachInterrupt(0, pulseCounter, FALLING);
  }
}






