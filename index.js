// Declerations
var fs=require('fs');
var Sound = require('play-sound')(opts = {})
var record=require('node-record-lpcm16');
var say = require('say');
var Polly = require('aws-sdk').Polly;
var request=require('request');
var snowboy_det=require('snowboy').Detector;
var snowboy_mod=require('snowboy').Models;

var rec,det,nprresp,config_json,isRecording=false,sclance_count=20; 

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


parseResult =function (err,resp,body){
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


// Start record speech
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
        }, function (err, resp, body) {
            if (err)
                {
                    console.error(err);
                    return;
            }
            console.log(body);
            nprresp=resp;
            current_state="npl";
            RunFSM();
        }));
}
/// Start Conversion CYCLE
StartConversion=function(txt){
    request('http://www.google.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage.
        }
    })
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
   
    Sound.play('resources/ding.wav',function(err){
         console.log('Done ding sound!');
         Sound.play('resources/dong.wav',function(err){
              current_state="listne";
            RunFSM();
         });
       
    })
    
}

/// Pars the response from wit.ai and process the response
function ProcessNPL(){
    var x=nprresp.outcomes;
}

// Speek the past text
function Speak(txt,onComplete){
    say.speak(txt,'',1.0,onComplete);
}
init();









