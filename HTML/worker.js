"use strict"

// handles:
//  on job
//  on solutionSpace

var alreadyWorking = 0;

var socket; 
function connect(canvas, server_address){
    socket = io.connect(server_address);
    
    // on socket connect, run function msg.
    socket.on('connect', msg("connect", "connected"))  
    
    socket.emit('newWorker', "");
    
    socket.on('job', function(data) {
        gotJob(data, socket);
    });
    
    socket.on('solutionSpace', function(solutionSpaceArray) {
        drawSolution(solutionSpaceArray, canvas);
    });
    
    // code here to refresh page on server disconnect?

}


/*function (data) {
socket.emit('my other event', { my: 'data' });
socket.send("test");
}
*/
function drawSolution (solutionSpaceArray, canvas){
    msg("drawSolution", "drew"+Math.random())
    visualizeArray(solutionSpaceArray, canvas);
}

function gotJob(jobData, socket){
    "use strict"
    msg("getJob", "recieved job: "+ stringJobData(jobData))
    if (alreadyWorking !== 0){
        console.log("ALready working.........")
        return
    }else{
        alreadyWorking = 1;
    }
    var jobProgress=0;
    window.intervalHandle = setInterval(function(){
        var ans = doJob(jobData, jobProgress)
        jobProgress = ans.jobProgress;
        jobData = ans.jobData;
        if (jobData.chunkStatus === 2){
            console.log("-DONE-")
            respondToJob(jobData, socket);
            clearInterval(window.intervalHandle);
        }
        else if (jobData.chunkStatus === 1){
            console.log("-DONE NOT FOUND-")
            respondToJob(jobData, socket);
            clearInterval(window.intervalHandle);
        }
    },1);
}

function doJob(jobData, jobProgress){
    "use strict"
    //todo
    msg("doJob", "func reached. Progress: "+jobProgress+stringJobData(jobData))
    
    //todo: <fix exceeding chunk range issue> change to :
    //for (lastProgress to minof(lastProgress+100x, (chunknum+1)*chunkSize-1)???
    for (var i = 0; i<10000; i++){
        var nextPassNum = jobData.chunkSize*jobData.chunkNumber+jobProgress
        
        if (nextPassNum > jobData.chunkSize*jobData.chunkNumber + jobData.chunkSize){
            jobData.chunkStatus = 1; // complete no success
            console.log("pass not found: ", jobData.hash, " ", decimalTo26(nextPassNum))
            
            break
        }else if ( hashComputer(decimalTo26(nextPassNum)) === jobData.hash){
            jobData.chunkStatus = 2;
            jobData.password = decimalTo26(nextPassNum);
            console.log("pass found: "+jobData.password)
            break;
        }
        jobData.lastCheck = decimalTo26(nextPassNum); //del
        ++jobProgress;
    }
    
    var ans = {};
    ans.jobProgress = jobProgress;
    ans.jobData = jobData
    return ans;
}

//respond on job by sending jaoData on socket
function respondToJob(jobData, socket){
    msg("respondToJob", "entered")
    socket.emit('jobResponse', jobData)
    alreadyWorking = 0;
}

function print (e){
console.log(e);
}
function msg (elemId, text){
    console.log("MSG>> "+elemId + ":  " + text)
    //document.getElementById(elemId).innerHTML = text;
}

function decimalTo26(decimal){
// takes a decimal and returns the base 26 representation string of length 6.
// [input-->output],  [0 --> aaaaaa], [25 --> aaaaaz], [26 --> aaaaba], [17575 --> aaazzz]
// 26todec(alphabetIndex*26^place). example for bzz 1*26^2 + 25*26^1 + 25*26^0
// a is like 0. so aaaazz == zz just like 0007 == 7

    //print("==========");
    var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var divisor = decimal;
    var base=26; var qoutient; var remainder;
    var ans=[];
    var quotient;
    do {
        quotient = Math.floor(divisor/base);
        remainder = divisor%base;
        //console.log("q:", quotient, "d:", divisor, "r:", remainder);
        divisor = quotient;            
        ans.push(alphabets[remainder]);
    } while (quotient>0)
    
    while (ans.length<6){
        ans.push(alphabets[0]);
    }
    
    var  ansx="";
    while(ans.length>0){
        ansx+=ans.pop();
    }
    //print (ansx);
    return ansx
};

// makes string of jobData struc
function stringJobData(jobData){
        return "|\
        hash: " + jobData.hash + " | \
        senderId: " + jobData.senderId + " |  \
        chunkNum: " + jobData.chunkNumber + " | \
        chunkSize: " + jobData.chunkSize + " | \
        pass: " + jobData.password + " | \
        chunkStatus: " + jobData.chunkStatus + " | ";
    }
    
function hashComputer (str){
    var hash = CryptoJS.MD5(str).toString(CryptoJS.enc.Base64);
    //slow things down for debug help
    //for (var i=0; i<10000; i++){
    //    i=i;
    //}
    return hash;
}