
var speechKit = new NuanceSpeechKitPlugin();


function setRecoDialogVisibile(visibility) {
    recoDialog = document.getElementById("reco-dialog");
    if (visibility == true){
        recoDialog.style.visibility = "visible";
    }
    else{
        recoDialog.style.visibility = "hidden";
    }
}
function toggleRecoDialog() {
    recoDialog = document.getElementById("reco-dialog");
    recoDialog.style.visibility = (recoDialog.style.visibility == "visible") ? "hidden" : "visible";
}

function setTTSDialogVisibile(visibility) {
    ttsDialog = document.getElementById("tts-dialog");
    if (visibility == true){
        ttsDialog.style.visibility = "visible";
    }
    else{
        ttsDialog.style.visibility = "hidden";
    }
}
function toggleTTSDialog() {
    ttsDialog = document.getElementById("tts-dialog");
    ttsDialog.style.visibility = (ttsDialog.style.visibility == "visible") ? "hidden" : "visible";
}


function doInit() {
    console.log("Before init Im here");
    
    var serverURL = "sandbox.nmdp.nuancemobility.net";
    speechKit.initialize("Credentials", serverURL, 443, false, function(r){printResult(r)}, function(e){printResult(e)} );
    
    //console.log("After init");
    
}

function doCleanup(){
    speechKit.cleanup( function(r){printResult(r)}, function(e){printResult(e)} );
}







function startRecognition(o){
    var element = o.id;
   

    printRecoStage("Listening");
    var recoType = "dictation";
    var recoLanguage = "en_us";
    
    console.log("Before startRecognition");
    speechKit.startRecognition(recoType, recoLanguage, function(r){resulttext(r, element)}, function(e){printRecoResult(e)} );
    console.log("After startRecognition");
     setRecoDialogVisibile(false);
    var tempObj = new Object();
}
function resulttext(r,element){
    
    if (typeof r.result == "undefined"){
     document.getElementById(element).value = "";
    } else{
        
        document.getElementById(element).value = r.result
    };

};




function stopRecognition(e){
    console.log("99999999999999 "+e.id)
    var stopButton = document.getElementById(e.id);
    var element = document.getElementById(e.id).nextSibling;
    console.log(element.id);
    speechKit.stopRecognition(function(r){resulttext(r,element.id)}, function(e){console.log(e)} );
}


function getResult(){
    speechKit.getResults(function(r){printResult(r)}, function(e){console.log(e)} );
}

function playTTS(){
    var ttsTextField = document.getElementById("tts-text");
    var text = ttsTextField.value;
    if (text.length > 0){
        printRecoStage("Playing TTS");
        
        var ttsLanguageSelect = document.getElementById("tts-language");
        var ttsLanguage = ttsLanguageSelect.value;
        
        var playButton = document.getElementById("play-tts");
        playButton.disabled = true;
        var stopButton = document.getElementById("stop-tts");
        stopButton.disabled = false;
        
        setTTSDialogVisibile(true);
        speechKit.playTTS(text, ttsLanguage, null, function(r){printTTSResult(r)}, function(e){printTTSResult(e)} );
    }
}

function stopTTS(){
    printRecoStage("Stopping TTS");
    //var playButton = document.getElementById("play-tts");
    //playButton.disabled = false;
    //var stopButton = document.getElementById("stop-tts");
    //stopButton.disabled = true;
    speechKit.stopTTS(function(r){printTTSResult(r)}, function(e){printTTSResult(e)} );
}

function printTTSResult(resultObject){
    
    var innerHtmlText=getHtml(resultObject);
    document.getElementById("result").innerHTML=innerHtmlText;
    if (resultObject.event != undefined){
        if (resultObject.event == 'TTSStarted' || resultObject.event == 'TTSPlaying'){
            //speechKit.queryNextEvent( function(r){printTTSResult(r)}, function(e){printTTSResult(e)} );
        }
        if (resultObject.event == 'TTSStopped' || resultObject.event == 'TTSComplete' || resultObject.event == 'TTSError'){
            var playButton = document.getElementById("play-tts");
            playButton.disabled = false;
            var playButton = document.getElementById("stop-tts");
            playButton.disabled = true;
            setTTSDialogVisibile(false);
        }
    }
}


function printRecoResult(resultObject){
    if (resultObject.event == 'RecoVolumeUpdate'){
        setVolumeLevel(resultObject);
    }
    else{
        if (resultObject.event == 'RecoComplete' || resultObject.event == 'RecoStopped' || resultObject.event == 'RecoError'){
            var stopButton = document.getElementById("stop-reco");
            stopButton.disabled = true;
            // setRecoDialogVisibile(false);
        }
        var innerHtmlText = "";
        
        document.getElementById('status_stage_description').value = resultObject.result
    }
}


function printResult(resultObject){
    var innerHtmlText=getHtml(resultObject);
    document.getElementById("status_stage").value = "";
}

function printRecoStage(stage){
    var resultObject = new Object();
    resultObject.event = stage;
    var innerHtmlText=getHtml(resultObject);
    document.getElementById("status_stage").innerHTML=innerHtmlText;
}

function setVolumeLevel(resultObject){
    var htmlText=" Volume: "+resultObject.volumeLevel;
    document.getElementById("volume-level").innerHTML=htmlText;
}

function getHtml(resultObject){
    var htmlText= resultObject.returnText;
    
    if (resultObject.result != undefined){
        htmlText=  resultObject.returnText ;
    }
    if (resultObject.results != undefined){
        var resultCount = resultObject.results.length;
        var i = 0;
        htmlText=htmlText;
        for (i = 0; i < resultCount; i++){
            htmlText=htmlText+"<br>"+i+": "+resultObject.results[i].value+" ["+resultObject.results[i].confidence+"]";
        }
    }
    if (resultObject.event != undefined){
        htmlText= resultObject.event;
    }
    return htmlText;
}



