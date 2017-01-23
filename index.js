// Declerations
const fs=require('fs');

const beep=require('beeper')
const record=require('node-record-lpcm16');
const Polly = require('aws-sdk').Polly;
const request=require('request');
const snowboy_det=require('snowboy').Detector;
const snowboy_mod=require('snowboy').Models;


var isRecording=false;
var rec;
var current_state;
var sclance_count=20; // counter to see the sclience count befor the transition happen
var config_json;

exports.init=function(){
 config_json
    =JSON.parse(fs.readFileSync('resources/witiot.json', 'utf8'));/

    var models=new snowboy_mod();
    models.add({
        file:config_json.snowboy.file,
        sesnsitivity:config_json.snowboy.sensativity,
        hotwords:config_json.snowboy.hotword
    });

    var det=new snowboy_det({
        resource:"resources/common.res",
        models:models,
        audioGain:parseFloat(config_json.snowboy.audiogain)
    });


    det.on('silence', function () {
        console.log('silence');
        RunFSM();
    });

    det.on('sound', function () {
        console.log('sound');
        RunFSM();
    });

    det.on('error', function () {
        console.log('error');
        RunFSM();
    });

    det.on('hotword', function (index, hotword) {

        console.log('hotword', index, hotword);
        isRecording=false;
        beep();
        StartRecordingSpeech();
        RunFSM();
    });
    RunFSM();
}


exports.parseResult =function (err,resp,body){
    // Exposing the result of the respons to the outside
    RunFSM();
}



exports.StartListenForHW=function(){
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

  RunFSM();
}

exports.StartRecordingSpeech=function(){
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
        }, exports.parseResult))

   
}
// Finite State Machines
function RunFSM(){
    // TODO Execute the FSM
    evalTrans(); // Evaluate 
    runStates(); // Run States 
}
function evalTrans(){
    switch(current_state){

    }

}
function runStates(){
    switch(current_state){

    }
}








