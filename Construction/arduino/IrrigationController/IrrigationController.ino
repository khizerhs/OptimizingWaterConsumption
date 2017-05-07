#include <Wire.h>
#include <UnoWiFiDevEd.h>
#include <dht.h>


//#define APIKEY_THINGSPEAK  "ORAYGP0SOPO0J1IB"

#define DHTPIN 6     // what digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321

#define FLOWMETERPIN       2
#define CONNECTOR     "rest" 
#define SERVER_ADDR   "sjsusmartfarm-backend.herokuapp.com"
dht DHT;

unsigned int SOLENOIDPIN ;
volatile byte pulseCount;  

float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;

unsigned long oldTime;
unsigned int soilMoistureLowRange = 15;
unsigned int waterPouringTime = 2000;
unsigned int numIter = 50;
String valveControl = ""; 

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
    Serial.println("Starting over");  
    int chk = DHT.read22(DHTPIN);

    if(chk == DHTLIB_OK){
        makeRequestMQTT("arduino-hum",String(DHT.humidity,1),3);
        makeRequestMQTT("arduino-temp",String(DHT.temperature),3);
//        Serial.println();
//        Serial.print("Humidity: ");           
//        Serial.print(String(DHT.humidity,1));
//        Serial.println("%"); 
//        Serial.print("Temperature: ");           
//        Serial.print(String(DHT.temperature,1));
//        Serial.println("C"); 
    }

    //***********Receiving arduino control params*****************////
    Ciao.beginMQTTRequest();
    String val = getMessageMQTT("lower-limit",5000);
    if(val != ""){
      soilMoistureLowRange = val.toInt();
      //makeRequestMQTT("current-lower-limit",val,1); 
    }
    Ciao.beginMQTTRequest();
    val = getMessageMQTT("pouring-water-time",5000);
    if(val != ""){
      waterPouringTime = val.toInt();
    }
    Ciao.beginMQTTRequest();
    val = getMessageMQTT("num-iter",5000);
    if(val != ""){
      numIter = val.toInt();
    }         
    //***********End of Receiving arduino control params*****************////
    
    float SoilMoistureReading;
    SoilMoistureReading = getAverageReading();
    if(valveControl != "on"){
      Serial.println("Sending arduino soil");       
      makeRequestMQTT("arduino-soil",String(SoilMoistureReading),3);          
    }
    
    //totalMilliLitres = 0.0;
    while((valveControl == "on") || (SoilMoistureReading > 0 && SoilMoistureReading < soilMoistureLowRange && SoilMoistureReading < 45)){
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

        if(totalMilliLitres > 0){
          makeRequestMQTT("arduino-water",String(totalMilliLitres),10);
        }
        
        if(valveControl != "on"){
          SoilMoistureReading = getAverageReading();
          if(valveControl != "on"){
            makeRequestMQTT("arduino-soil",String(SoilMoistureReading),3);   
          }         
        }else{
          val = getMessageMQTT("valve-control",5000);
          if(val != "")
            valveControl = val;      
        }
        
    }
    
    //if(totalMilliLitres > 0){
    //  makeRequestMQTT("arduino-water",String(totalMilliLitres),10);
    //}
    
    delay(5000); 
    
}

double getAverageReading(){
  double soilMoistureReadings = 0.0;
  
  for(int i = 0; i < numIter; i++){
    soilMoistureReadings += readSoilMoisture();
    String val = getMessageMQTT("valve-control",5000);
    if(val == "on"){
      valveControl = val;
      return 0.0;
    } 
    delay(5000);
  }
  return soilMoistureReadings/numIter;
}

void makeRequestMQTT(char* topic, String dataRequest, unsigned int times){
    //Ciao.begin();   
    Ciao.beginMQTTRequest();
    for(int i = 0; i < times; i++){
      CiaoData data = Ciao.write("mqtt", topic, dataRequest);
  
      if (!data.isEmpty()){
        Serial.println( "State: " + String (data.get(1)) );
        Serial.println( "Response: " + String (data.get(2)) );
        Ciao.println( "State: " + String (data.get(1)) );
        Ciao.println( "Response: " + String (data.get(2)) );
        break;      
      }
      else{ 
        Serial.println("Write Error");
        Ciao.println("Write Error");
      }
    }    
}


//String makeRequest(const String resource, const char* method){
//    Serial.println(resource);
//    CiaoData data = Ciao.write(CONNECTOR, SERVER_ADDR, resource);    
//    if (!data.isEmpty()){
//      //Ciao.println( "State: " + String (data.get(1)) );
//      //Ciao.println( "Response: " + String (data.get(2)) );
//      Serial.println( "State: " + String (data.get(1)) );
//      Serial.println( "Response: " + String (data.get(2)) );
//      return String(data.get(2));
//    }
//    else{
//      //Ciao.println ("Write Error");
//      Serial.println ("Write Error");
//    }
//    return "";
//}

String getMessageMQTT(char* topic, unsigned int time){
  Ciao.beginMQTT();
  Serial.println("Receiving directives topic:"+String(topic));
  unsigned long oldTime = millis();
  while(millis() - oldTime < time){
    CiaoData data = Ciao.read("mqtt", topic); 
    if (!data.isEmpty()){
      Serial.println("Data received"+String(data.get(2)));
      return String(data.get(2));
    }
    //delay(1000);
  }
  Serial.println("End topic: "+String(topic));
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
