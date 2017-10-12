var vrHMD, vrSensor;
var vrPoseData;
var frameData;
var connected = true;

function getVRDevices() {
    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function (devices) {
            for (var i = 0; i < devices.length; i++) {
                if (devices[i] != null) {
                    console.log("get HMD device");
                    vrHMD = devices[i];
                    console.log(vrHMD.displayName);
                    var button = document.getElementById('button');
                    button.disabled = false;
                    break;
                }
            }
        });
    }
}
var mode = 0;
function webvr_click() {
    console.log("change mode");
    if (!vrHMD) {
        alert("Can't find HMD display");
        return;
    }
    if (mode == 0)
    {
        console.log("Start VR");
        fullScreen();
        gameInstance.SendMessage('CameraSet', 'ChangeMode', 'vr');
        mode = 1;
        var button = document.getElementById('button');
        button.value = "Stop VR";
    } else
    {
        console.log("Display Normal");
        vrHMD.exitPresent();
        gameInstance.SendMessage('CameraSet', 'ChangeMode', 'normal');
        mode = 0;
    }
    //getVRSensorState();
}
function fullScreen() {
    console.log("aaaa");
    frameData = new VRFrameData();
    myCanvas = document.getElementById('#canvas');
    console.log(vrHMD);
    vrHMD.requestPresent([{ source: myCanvas }]).then(function () {
        console.log('Presenting to WebVR display');

        // Set the canvas size to the size of the vrDisplay viewport

        var leftEye = vrHMD.getEyeParameters('left');
        var rightEye = vrHMD.getEyeParameters('right');

        myCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
        myCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);

        getVRSensorState();
    });
    //if (myCanvas.requestFullscreen)
    //{
    //    myCanvas.requestFullscreen({ vrDisplay: vrHMD });
    //} else if (myCanvas.msRequestFullscreen)
    //{
    //    myCanvas.msRequestFullscreen({ vrDisplay: vrHMD });
    //} else if (myCanvas.mozRequestFullScreen)
    //{
    //    myCanvas.mozRequestFullScreen({ vrDisplay: vrHMD });
    //} else if (myCanvas.webkitRequestFullscreen)
    //{
    //    myCanvas.webkitRequestFullscreen({ vrDisplay: vrHMD });
    //}
}
var render;
function getVRSensorState()
{
    
    vrHMD.requestAnimationFrame(getVRSensorState);
    vrHMD.getFrameData(frameData);
    //var curFramePose = frameData.pose;
    //var orientation = curFramePose.orientation;
    var orientation = frameData.pose.orientation;
    if (orientation != null) {
        gameInstance.SendMessage('CameraSet', 'rotation_X', -orientation[0]);
        gameInstance.SendMessage('CameraSet', 'rotation_Y', -orientation[1]);
        gameInstance.SendMessage('CameraSet', 'rotation_Z', orientation[2]);
        gameInstance.SendMessage('CameraSet', 'rotation_W', orientation[3]);
    }
    //if (curFramePose.position != null)
    //{
    //    SendMessage('CameraSet', 'position_x', curFramePose.position.x);
    //    SendMessage('CameraSet', 'position_y', curFramePose.position.y);
    //    SendMessage('CameraSet', 'position_z', curFramePose.position.z);
    //}
    //vrHMD.submitFrame();
    if (render == false) vrHMD.submitFrame(vrPoseData);
    else render = false;
}

function Render()
{
    render = true;
    console.timeEnd("HMD");
    console.time("HMD");
    vrHMD.submitFrame();
    vrHMD.getFrameData(frameData);
    vrPoseData = frameData.pose;
}

window.onvrdisplayconnect = function () {
    console.log("display connected!!");
    connected = true;
};
window.onvrdisplaydisconnect = function () {
    console.log("display disconnected!!");
    connected = false;
};
window.onvrdisplaypresentchange = function () {
    if (vrHMD.isPresenting) {
        console.log("display start presenting");
        connected = true;
    } else {
        console.log("display stop presenting");
        connected = false;
    }
};
