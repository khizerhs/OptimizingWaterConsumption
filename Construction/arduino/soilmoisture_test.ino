float Count;
float SensorReading;

void setup() {
  // put your setup code here, to run once:
    Serial.begin(9600);  
}

void loop() {
  // put your main code here, to run repeatedly:
    readSoilMoisture();
    delay(2000);
}

void readSoilMoisture(){
  Count = analogRead(A0);
  float Voltage = Count / 1023 * 5.0;// convert from count to raw voltage
  Serial.print("Analog read \t"); // tab character
  Serial.println(Count);
   Serial.print("Voltage read \t"); // tab character
  Serial.println(Voltage);
  SensorReading= -42 + Voltage * 108; //converts voltage to sensor reading
  Serial.print("VWC \t"); // tab character
  Serial.println(SensorReading);
  
}
