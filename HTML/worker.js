"use strict"

// handles:
//  on job
//  on solutionSpace

var alreadyWorking = 0;

var socket;
function connectWorker(canvas, server_address) {
	socket = io.connect(server_address);

	// on socket connect, run function msg.
	socket.on('connect', msg("connect", "connected"))

	socket.emit('newWorker', "");

	socket.on('job', function (workUnit) {
    /*
    var workUnit={};
    workUnit.key = 12; // a string
    workUnit.val = {a: 22, b:33}; //
    workUnit.func = "function (key, val) {var ans = key + val.b;return ans;};";
    */
		gotJob(workUnit, socket);
	});

	socket.on('solutionSpace', function (solutionSpaceArray) {
		//drawSolution(solutionSpaceArray, canvas);
	});

	// code here to refresh page on server disconnect?

}

/*function (data) {
socket.emit('my other event', { my: 'data' });
socket.send("test");
}
 */
function drawSolution(solutionSpaceArray, canvas) {
	msg("drawSolution", "drew" + Math.random())
	visualizeArray(solutionSpaceArray, canvas);
}

/*
 * Get URL of Worker
 */
function getUrlForWorker(workerFunctionStr) {
	var URL = window.URL || window.webkitURL;
	var mainString = workerFunctionStr;
	var bodyString = mainString.substring(mainString.indexOf("{") + 1, mainString.lastIndexOf("}"));
	var bb = new Blob([bodyString]);
	return URL.createObjectURL(bb)
}

function gotJob(workUnit, socket) {
	"use strict"

	msg("gotJob", "recieved job: " + JSON.stringify(workUnit));

	if (alreadyWorking !== 0) {
		console.log("ALready working.........")
		return
	} else {
		alreadyWorking = 1;
	}

	var workerFuncStr = "var wf = function () { var key = " + JSON.stringify(workUnit.key) + ";  var val = " + JSON.stringify(workUnit.val) + "; var foo =" + workUnit.func + "; var ans = foo(key, val); postMessage(ans);}";

	var worker = new Worker(getUrlForWorker(workerFuncStr));

	worker.onmessage = function (event) {
		//alert(event.data);
		respondToJob(event.data, socket);
	};
}

//respond on job by sending jaoData on socket
function respondToJob(output, socket) {
	msg("respondToJob", "entered")
	socket.emit('jobResponse', output)
	alreadyWorking = 0;
}

function msg(elemId, text) {
	console.log("MSG>> " + elemId + ":  " + text)
	//document.getElementById(elemId).innerHTML = text;
};