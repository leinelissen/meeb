#include <SPI.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Arduino.h>
#include "Adafruit_SGP30.h"
#include "OOCSI.h"

#define DEVICE_ID "d1b06807304a2445b"
#define DEVICE_TYPE "living_room"
#define DEVICE_NAME "group_3_ded_2019_living_room"

#define REED_PIN_DOOR 13
#define REED_PIN_WINDOW 16
#define OOCSI_INTERVAL 5000

// use this if you want the OOCSI-ESP library to manage the connection to the Wifi
// SSID of your Wifi network, the library currently does not support WPA2 Enterprise networks
//const char* ssid = "lab-id";
const char* ssid = "iPhone SE";
// // // Password of your Wifi network.
//const char* password = "ID-LAB-PSK";
const char* password = "test1234";

// put the adress of your OOCSI server here, can be URL or IP address string
const char* hostserver = "oocsi.id.tue.nl";

// OOCSI reference for the entire sketch
OOCSI oocsi = OOCSI();
// Initialise the SGP Library for the Air Quality Sensor
Adafruit_SGP30 sgp;
// Initialise I2C for the Temperature Sensor
Adafruit_BMP280 bmp; 

/** State variables **/
// Whether the window is open or closed
bool windowIsClosed;
// Whether the door to outside is open or closed
bool doorIsClosed;
// Total Volatice Organic Compound baseline
uint16_t tvoc;
// Equivalent CO2 baseline
uint16_t eco2;

/** Timers **/
unsigned long lastOOCSIMessage = 0;

void processOOCSI() {
    //
}

void setup() {
    // Start a serial connection
    Serial.begin(115200);
    // And print that we have a startup situation
    Serial.println("Startup");

    // We'll also wait for the Air Quality sensor to get ready and dressed
    if (!sgp.begin()){
        Serial.println("Air Quality Sensor not found :(");
        while (1);
    }
    
    if (!bmp.begin()) {
        Serial.println(F("Temperature Sensor not found :("));
        while (1);
    }

    /* Default settings from datasheet. */
    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X1,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X1,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_OFF,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

    // Set the input mode for the Contact switches
    pinMode(REED_PIN_WINDOW, INPUT);
    pinMode(REED_PIN_DOOR, INPUT);
    // connect wifi and OOCSI to the server
    oocsi.connect(DEVICE_NAME, hostserver, ssid, password, processOOCSI);
}

void sendOOCSIMessage() {
    // INSERT your channel name here
    oocsi.newMessage("ded-air-quality-group-3-week-6");

    // INSERT your device id here (from the Foundry website)
    oocsi.addString("device_id" , DEVICE_ID);
    oocsi.addString("activity" , "EVENT");
    oocsi.addInt("temperature", bmp.readTemperature());
    oocsi.addInt("eco2", sgp.eCO2);
    oocsi.addInt("tvoc", sgp.TVOC);
    oocsi.addBool("windowIsClosed", windowIsClosed);
    oocsi.addBool("doorIsClosed", doorIsClosed);

    // this command will send the message; don't forget to call this after creating a message
    oocsi.sendMessage();
}

void loop() {
    if (!sgp.IAQmeasure()) {
        Serial.println("Measurement failed");
    }

    if (!sgp.getIAQBaseline(&eco2, &tvoc)) {
        Serial.println("Failed to get baseline readings");
    }

    // Check wifi connection
    if (WiFi.status() != WL_CONNECTED) {
          ESP.restart(); 
     }

    // Log the values to the serial monitor
    Serial.print(F("Temperature = "));
    Serial.print(bmp.readTemperature());
    Serial.println(" *C");
    Serial.print("\t");
    Serial.print(sgp.eCO2);
    Serial.print("\t");
    Serial.print(sgp.TVOC);
    Serial.print("\t");
    Serial.print(windowIsClosed);
    Serial.print("\t");
    Serial.println(doorIsClosed);
    
    // Interpret the reed sensor
        doorIsClosed = !digitalRead(REED_PIN_DOOR);
        windowIsClosed = !digitalRead(REED_PIN_WINDOW);

    // Check if the OOCSI timer has expired
    if (lastOOCSIMessage + OOCSI_INTERVAL < millis()) {
        // If it has, send the message
        sendOOCSIMessage();
         // And also set the new timestamp for the last OOCSI message
        lastOOCSIMessage = millis();

    }

}