// Declerations
const config=require('fs');
const record=require('node-record-lpcm16');
const request=require('request');
const snowboy_det=require('snowboy').Detector;
const snowboy_mod=require('snowboy').Models;
//const witai=require('node-wit');
const mqtt=require('mqtt');

// Read the configuration file from /etc/witiot.json
var config_cont=fs.readFile('/etc/witiot.json').toString();
var config_json=JSON.parse(config_cont);

var witToken=""; // Add wit tokentoS


exports.parseResult =function (err,resp,body){
    // Exposing the result of the respons to the outside
}

// Setting up snowboy
const models=new snowboy_mod();
models.add({
    file:'resources/snowbody.umdl',
    sesnsitivity:'0.5',
    hotwords:'snowboy'
});

// Setting up Detector
const det=new Detector({
    resources:'resources/common.res',
    models:models,
    audioGain:2.0
});

det.on('sillence',function(){
    // Detect Scleince
});

det.on('sound',function(){
    // On Sound detected
});

det.on('hotwords',function(){
    // On Hotword Detected
    // play a beep

   
})


record.start({
    verbos:true,
    recordProgram:'arecord'
}).pipe(det);




