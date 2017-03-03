#include <Wire.h>
#include <UnoWiFiDevEd.h>
#include <dht.h>


//#define CONNECTOR     "rest" 
//#define SERVER_ADDR   "api.thingspeak.com"
//#define APIKEY_THINGSPEAK  "ORAYGP0SOPO0J1IB"

#define DHTPIN 6     // what digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321

#define FLOWMETERPIN       2
dht DHT;

unsigned int SOLENOIDPIN ;
volatile byte pulseCount;  

float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;

unsigned long oldTime;
unsigned int soilMoistureLowRange = 20;
unsigned int waterPouringTime = 2000;

void setup() {

  Ciao.begin(); // CIAO INIT
  Serial.begin(9600);  
  SOLENOIDPIN = 4;
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  pinMode(SOLENOIDPIN, OUTPUT); 
  pinMode(DHTPIN, INPUT);
 
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
    //Ciao.begin();
    int chk = DHT.read22(DHTPIN);
    //String uri;
    if(chk == DHTLIB_OK){
        Serial.println("Temp/Hum sensor OK,\t");
        makeRequestMQTT("arduino-hum","{\"h\":\""+String(DHT.humidity,1)+"\"}");
        makeRequestMQTT("arduino-temp","{\"t\":\""+String(DHT.temperature,1)+"\"}");
    }
    
    
    Serial.println();
    Serial.print("Humidity: ");           
    Serial.print(String(DHT.humidity,1));
    Serial.println("%"); 
    Serial.print("Temperature: ");           
    Serial.print(String(DHT.temperature,1));
    Serial.println("C"); 
    
    unsigned int state = digitalReadOutputPin(SOLENOIDPIN);
    float SoilMoistureReading = readSoilMoisture();
    makeRequestMQTT("arduino-soil","{\"s\":\""+String(SoilMoistureReading)+"\"}");
    totalMilliLitres = 0.0;
    //***************************************************////
    //************GET USER PARAMETERS****************///
    //***************************************************///
    //Get the soil moisture lowerLimit
    String message = getMessageMQTT("lowerLimit");
    if(message != ""){
      soilMoistureLowRange = message.toInt();
    }
    //Publish the current soil moisture lower range
    makeRequestMQTT("currentLowerLimit",String(soilMoistureLowRange));
    //Get the pouring time
    message = getMessageMQTT("pouringTime");
    if(message != ""){
      waterPouringTime = message.toInt();
    }
    //Publish the current pouring time
    makeRequestMQTT("currentPouringTime",String(waterPouringTime));
    //***************************************************////
    //************GET USER PARAMETERS****************///
    //***************************************************///

    
    Serial.println("Soil moisture range limit: "+String(soilMoistureLowRange));
    Serial.println("Current pouring time: "+String(waterPouringTime));
    
    while(SoilMoistureReading > 0 && SoilMoistureReading < soilMoistureLowRange && SoilMoistureReading < 45){
        state = digitalReadOutputPin(SOLENOIDPIN);
        if(state == LOW){
          digitalWrite(SOLENOIDPIN, HIGH);
          Serial.println("Valve opened!!!");
        }
        //Pour water during water pouring time
        unsigned long oldTime = millis();
        while(millis() - oldTime < waterPouringTime){   
          calculateFlow();
        }
        delay(60000); // delay 1 minute to allow the water poured reach the soil moisture sensor
        SoilMoistureReading = readSoilMoisture();
        makeRequestMQTT("arduino-soil","{\"s\":\""+String(SoilMoistureReading)+"\"}");
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
    
    if(totalMilliLitres > 0){
      makeRequestMQTT("arduino-water","{\"w\":\""+String(totalMilliLitres)+"\"}");
    }
    delay(5000); // Thinkspeak policy

}

/*
void makeRequest(String dataRequest){
    //Ciao.print("Sending request to thingspeak ");
    Serial.println(dataRequest);
    Ciao.println("Send data on ThingSpeak Channel"); 
      
    CiaoData data = Ciao.write(CONNECTOR, SERVER_ADDR, dataRequest);

    if (!data.isEmpty()){
      Serial.println( "State: " + String (data.get(1)) );
      Serial.println( "Response: " + String (data.get(2)) );
      Ciao.println( "State: " + String (data.get(1)) );
      Ciao.println( "Response: " + String (data.get(2)) );
    }
    else{ 
      Ciao.println("Write Error");
    }    
}*/

void makeRequestMQTT(char* topic, String dataRequest){
    //Ciao.print("Sending request to thingspeak ");
    //Ciao.println(dataRequest);
    Ciao.println("Send data on ThingSpeak Channel"); 
      
    CiaoData data = Ciao.write("mqtt", topic, dataRequest);

    if (!data.isEmpty()){
      Serial.println( "State: " + String (data.get(1)) );
      Serial.println( "Response: " + String (data.get(2)) );
      Ciao.println( "State: " + String (data.get(1)) );
      Ciao.println( "Response: " + String (data.get(2)) );
    }
    else{ 
      Ciao.println("Write Error");
    }    
}

String getMessageMQTT(char* topic){
  CiaoData data = Ciao.read("mqtt", topic); 
  if (!data.isEmpty()){
    Serial.println("Data received"+String(data.get(2)));
    return String(data.get(2));
  }

  return "";
}

float readSoilMoisture(){
  float Count = analogRead(A2);
  float Voltage = Count * (5.0 / 1023);// convert from count to raw voltage
  Serial.print("Analog read \t"); // tab character
  Serial.println(Count);
  float SoilMoistureReading= -42 + Voltage * 108; //converts voltage to sensor reading
  //cont++;
  //}
  Serial.print("VWC \t"); // tab character
  Serial.println(SoilMoistureReading);
  return SoilMoistureReading;
  
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
/*
String getTime(){
    time_t t = now();
    String day1 = String(day(t));
    String month1 = String(month(t));
    String year1 = String(year(t));
    String hour1 = String(hour(t));
    String minute1 = String(minute(t));
    String date = day1+"/"+month1+"/"+year1+" "+hour1+":"+minute1;
    return date;
}*/
