
var multiparty;

function Enter(roomnumber, role)
{

    multiparty = new MultiParty({
        "key": "1db28c42-8769-4977-89c3-f6b8776f4f8d",  /* SkyWay key */
		"room": "livestreaming" + roomnumber
    });

    multiparty.on('my_ms', function (video)
    {
        // create own video
        //var vNode = MultiParty.util.createVideoNode(video);
        //vNode.setAttribute("muted", "muted");
        //$(vNode).appendTo("#streams");
        //document.getElementById(video["id"]).style.display = "none";
    }).on('open', function (myid)
    {
		multiparty.listAllPeers(function (lists){
			if(lists[0] == null){
				if(role == 1){
					EnterError("There is no host in this room!");
					multiparty.close();
					return;
				}
			}else{
				if(role == 0){
					EnterError("This room is already used!");
					multiparty.close();
					return;
				}
				if(lists[1] != null){
					EnterError("This room is already full!");
					multiparty.close();
					return;
				}
			}
			gameInstance.SendMessage('ProjectManager', 'SceneChange', 1);
		})
    }).on('peer_ms', function (video)
    {
        console.log("get other data");
        // create peer video
        var vNode = MultiParty.util.createVideoNode(video);
        $(vNode).appendTo("#streams");
        videoval = document.getElementById(video["id"]);
        inittexture();
        document.getElementById(video["id"]).style.display = "none";
    }).on('ms_close', function (peer_id)
    {
        console.log("exit other");
        // remove peer video
        $("#" + peer_id).remove();
    }).on('message', function (mesg)
    {

    });

    multiparty.start();

}

function EnterError(message){
	alert(message);
}