# Hello Duniya!

This work will gradually evolve into a web browser based distributed computing system.

The system consists of three parts:
- **Workers**: These are volunteers that run the function sent by the server.
- **TaskGivers**: These are clients who request the server to get their job done. 
- **Server**: takes jobs from TaskGivers and distribute them to volunteers. Server also logs progress. 

note: for now peer to peer communication is ignored.    

##Worker (HTML with socket.io):
//documentation todo

##TaskGiver (HTML with socket.io):
//documentation todo

##Server (node.js running socket.io):
###Install Instruction:
####Setup (asuming nodejs installed)
Go to the folder where you want to put the app
> git clone https://github.com/hammadmlk/teamwork.git

> cd teamwork

> npm install

####Running
> node app.js

//documentation todo
