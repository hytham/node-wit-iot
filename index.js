// Declerations
const record=require('node-record-lpcm16');
const request=require('request');
const snowboy_det=require('snowboy').Detector;
const snowboy_mod=require('snowboy').Models;
//const witai=require('node-wit');
const mqtt=require('mqtt');

var witToken=process.env.WIT_TOKEN;


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
})


const mic =record.start({

});

mic.pipe(det);




