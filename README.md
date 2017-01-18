# node-wit-iot
This tool will bind sox audio recording with a wit.ai account the final wit message will be sent to a Mqtt broker
# requirments
*   Linux
*   Nodejs
*   SOX
# dependancy
This tool depends on the follow libraries to be installed in your project
 *   1. node-record-lpcm16 ( to handle audio recording based on sox command)
 *   2. snowboy (A hotword tool from kitt.ai to handle horword triggr)  
 *   3. node-wit (Wit.ai library to send communicate to the wit.ai servers)
 *   4. mqtt (is library that will send and recive mqtt message to any broker)
 *   5. request (to send http post request to the speech endpoint of wit.ai)
 *   6. beeper (to play a beep sound when the hotkey is detected or when the speech is detected and being processed)

# what is WIT-IOT
wit-iot is a full tool that will run in the background to listn for a hotword, when the hot word occur it will start recording using sox command line and stop when sclelance is detected. 
The recorder sound will be sent to Wit.AI Speech recognition server that will recognise it and send it back to the application the form of wit.ai actiions and entity.
The code then either eact on it or send the message forword to a mqtt broker to be proceesed further, this is usefull in IOT systems.

# Install
TBD


# Config
This tool will handle the folloing configuration values it (it must be placed on /etc/witiot.conf file)

# Referance
TBD

# Further readings
TBD

