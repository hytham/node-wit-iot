// Declerations
const fs=require('fs');
const record=require('node-record-lpcm16');
const request=require('request');
const snowboy_det=require('snowboy').Detector;
const snowboy_mod=require('snowboy').Models;
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
    audioGain:2.0
});

det.on('silence', function () {
  console.log('silence');
});

det.on('sound', function () {
  console.log('sound');
});

det.on('error', function () {
  console.log('error');
});

det.on('hotword', function (index, hotword) {
  console.log('hotword', index, hotword);
});


record.start({
    verbos:true,
    threshold:0,
    recordProgram:'rec'
}).pipe(det);




