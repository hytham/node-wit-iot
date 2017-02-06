// Declerations
var fs=require('fs');
var Sound = require('node-aplay');
var record=require('node-record-lpcm16');
var Polly = require('aws-sdk').Polly;
var request=require('request');
var snowboy_det=require('snowboy').Detector;
var snowboy_mod=require('snowboy').Models;

var rec,det,nprresp,config_json;,isRecording=false,sclance_count=20; 

global.current_state="start";

/// Initalise the engine
init=function(){
    console.log("Loading configuration")
    // Load the configuration file
 config_json
    =JSON.parse(fs.readFileSync('resources/witiot.json', 'utf8'));
    console.log("Load snowboy resource ...... ");

    console.log("Setup Snowboy")
    var models=new snowboy_mod();
    models.add({
        file:config_json.snowboy.file,
        sesnsitivity:config_json.snowboy.sensativity,
        hotwords:config_json.snowboy.hotword
    });

    det=new snowboy_det({
        resource:"resources/common.res",
        models:models,
        audioGain:parseFloat(config_json.snowboy.audiogain)
    });

    
    /// Setup event listner
    console.log("Set listner ...... ");
    det.on('silence', function () {
        console.log('silence');
        //RunFSM();
    });

    det.on('sound', function () {
        console.log('sound');
        //RunFSM();
    });

    det.on('error', function () {
        console.log('error');
        //RunFSM();
    });
    /// Set hotword
    console.log("Set hotword ...... ");
    det.on('hotword', function (index, hotword) {

        console.log('hotword', index, hotword);
        isRecording=false;
        beep();
        RunFSM();
    });
    console.log("Run state machine...... ");
    global.current_state="hotword";

    RunFSM();
}


exports.parseResult =function (err,resp,body){
    // Exposing the result of the respons to the outside
    RunFSM();
}



StartListenForHW=function(){
    record.start({
        verbos:true,
        threshold:0,
        recordProgram:'rec'
    }).pipe(det);
   
}

exports.parseResult = function (err, resp, body) {
  
  if (err) 
    console.error(err)
   console.log(body);

   nprresp=resp;
   
  current_state="npl";
  RunFSM();
}

StartRecordingSpeech=function(){
    record.start({
        verbose: true,
        recordProgram: 'rec'
        }).pipe(request.post({
            'url': 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
            'headers': {
                'Accept': 'application/vnd.wit.20160202+json',
                'Authorization': 'Bearer ' + config_json.wit.token,
                'Content-Type': 'audio/wav'
            }
        }, exports.parseResult));

        

   
}
// Finite State Machines
function RunFSM(){
    // TODO Execute the FSM
    evalTrans(); // Evaluate 
    runStates(); // Run States 
}
function evalTrans(){
    switch(global.current_state){

        
        case("hotword"):
            // hotword state
            StartListenForHW();
            global.current_state="idle";
        break;
       
        case("idle"):
        // ideal state
        break;
        case("listne"):
            console.log("listne for command");
            StartRecordingSpeech();
        // listne state
        break;
        case("npl"):
        /// natural processing state
        console.log("processing NPL commands")
        ProcessNPL();
        break;
        case("speek"):
        // speek state
        break;

    }

}
function runStates(){
    switch(current_state){

    }
}

function beep(){
    // play beep sound
    var music = new Sound('resources/ding.wav');
    music.play();
    music.on('complete',function () {
        console.log('Done ding sound!');
        current_state="listne";
        RunFSM();
    });
}

/// Pars the response from wit.ai and process the response
function ProcessNPL(){

}


//// start the application

this.init();







