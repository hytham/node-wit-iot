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
//const witai=require('node-wit');
//const mqtt=require('mqtt');

// Read the configuration file from /etc/witiot.json


var config_json=JSON.parse(fs.readFileSync('resources/witiot.json', 'utf8'));//fs.readFile("resources//witiot.json").toString();
//var config_json=JSON.parse(config_cont);

//var witToken=wit.Token; // Add wit tokentoS


exports.parseResult =function (err,resp,body){
    // Exposing the result of the respons to the outside
}

// Setting up snowboy
const models=new snowboy_mod();
models.add({
    file:config_json.snowboy.file,
    sesnsitivity:config_json.snowboy.sensativity,
    hotwords:config_json.snowboy.hotword
});

// Setting up Detector
const det=new snowboy_det({
    resource:"resources/common.res",
    models:models,
    audioGain:parseFloat(config_json.snowboy.audiogain)
});

det.on('silence', function () {
  console.log('silence');
  if(isRecording)
    rec.stop();
    isRecording=false;
  
});

det.on('sound', function () {
  console.log('sound');
  
});

det.on('error', function () {
  console.log('error');
});

det.on('hotword', function (index, hotword) {
  console.log('hotword', index, hotword);
  beep();
  isRecording=false;
  StartRecordingSpeech();
});


record.start({
    verbos:true,
    threshold:0,
    recordProgram:'rec'
}).pipe(det);

exports.parseResult = function (err, resp, body) {
  if (err) console.error(err)
  console.log(body)
}

function StartRecordingSpeech(){
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






