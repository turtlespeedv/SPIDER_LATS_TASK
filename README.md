# SPIDER_LATS_TASK
Hello i am vedansh from eee 2nd year, app dev domain.

I have included all the parts of the tasks i was able to complete in this repo, i was not able to integrate all of them in one single place right, so i have included them individually.
FOLLOWING ARE THE INSTRUCTIONS TO OPEN THEM:-
(Clone the git repo using to your system first.)

**First install node.js, if you don't have it installed.**
  
**Then, in the terminal cd to whatever app you want to test first, for example if you want to check the collaborative editing app, first enter cd SPIDER_LATS_TASK/COLLABORATION_DOCUMENT/, then follow the steps given below.**

**You will also need to download _ngrok_ if you want to use the apps between different systems** 

# FOR CHAT APP:- 
You can copy the index.html file into your browser or just write **npm start** in the terminal which will give a link with port number 3000, open that, and it will work. 
Enter the workspace id, could be anything, open the link in another tab, and enter the same workspace id, and now you can chat with each other. (Check the console in the browser after creating the workspace id to make sure you are connected to the server.)
(Also click on the send button to send message, pressing enter doesnt work.)
(I coded both the css and js part in html part itself, thats why there is only index.html and server.js )
**Tech stack used- node.js, express.js, websocket for backend / html and js for frontend**

# FOR COLLABORATIVE EDITING APP:-
IMPORTANT- first enter **"npm install"** to install the node modules, do this first otherwise it wont work.
Enter **npm start** and a site will open, you can start writing in the space given in the middle, Open another tab with the link and you will see that writing in one tab will automatically illustrate that change in the other, this can be done with multiple users.
**Tech stack used- React, js, css, yjs (for the editing part)**

(My laptop broke down and stopped working a day before the deadline, so I used a friend's laptop to try and salvage the problem, the first two major parts of the project still work, but the video conferencing, user authentication, and docker parts are not working completely well on this system right, still I have uploaded whatever part that works to the git repo.)

# FOR VIDEO-CONFERENCING:-
First enter npm install to install the node modules.
Then enter node server.js in one terminal and npm start in another terminal.
The task is partially completed in the sense that all the controls and all, i.e muting/unmuting, turning the camera on/off are working fine, but the server part is causing an issue.
Tech stack used- React, js ,css, webrtc, socket for frontend and node.js, express, cors for backend.

# CI/CD PIPELINE INTEGRATION:-
I incorporated the CI/CD integration using github actions to the collaborative editing app, i have created all the files, including the .yml fil, updating the package.json file, generating a PAT, and deployed the contecnts to another branch called gh-branch which can be seen in the actions tab.


