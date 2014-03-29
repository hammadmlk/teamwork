# Hello Duniya!

This work will gradually evolve into a web browser based distributed computing system. (Visit: http://teamworkjs.com)

The system consists of three parts:
- **Workers**: These are volunteers that run the function sent by the server.
- **TaskGivers**: These are clients who request the server to get their job done. 
- **Server**: takes jobs from TaskGivers and distribute them to volunteers. Server also logs progress. 

note: for now peer to peer communication is ignored.    

##Demo:
The first prototype (distributed password cracking app) worked great. I tested the performance with a variable number of machines. The plot of work-done/machine vs num-of-machines was flat (yayyy). This means that we have no bottlenecks on the server side for your distributed password cracking application.

###Try it your self:
**Open the worker on a few browsers (preferable on different machines).** 
visit http://cornellhci.org/tailormade/teamwork/worker.html
and click 'connect with server'

**Open the taskgiver on any browser**.
Enter a 6 alphabet (a-z only) password in the input field. And hit crack it**
http://cornellhci.org/tailormade/teamwork/taskGiver.html.


*The workers are now actively working on cracking the password*


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


#Confused
Worry not!!! Wait a month or so. As the project refines we will start properly documentating the system. For now its scope is ever changing and time investment on documentation is not a good bet. :)
