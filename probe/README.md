# Meeb Probe
The probe gathers sensor data as input for the mediation system. Currently, it features an ESP32, with connected CO2, TVOC, Humidity and Temperature sensors (BMP280, SGP30 respectively), as well as two reed switches that measure whether doors and windows are open or closed.

## Installing
In order to compile the code to the ESP, you need to setup [PlatformIO](https://platformio.org) for VSCode. You will then need to install the Adafruit BMP280 and SGP30 libraries, as the OOCSI library is bundled with this repository. 

Then, you can use the regular PlatformIO controls to compile the code and send it over to attached ESPs.