**CSE Team Project** - College Explorer

**Published Firebase App:**  https://college-selection-tool.web.app/

**DESCRIPTION:** This is an interactive college selection tool (a web app linked above) called “College Explorer.” This application involves an interactive D3.js map where users can hover over states (and counties) to discover colleges that match their specific criteria. Double clicking on a county presents a popup modal with institutional characteristics drawn from 6 different publicly available application programming interface (API) endpoints, merged, and stored locally in the browser cache. Users can personalize their choices; this invokes a calculation of a “match score” for each institution based on predictive analytics for college success.  The visualization contains two carefully designed main interactive features: 
   1. Check boxes for dynamic school characteristics filtering. 
   2. Dropdown selections for personalized student match scores.

The API endpoints are public, NO NEED to obtain an API key. This code is offered under the creative commons open license: **cc-by-sa**
https://creativecommons.org/licenses/by-sa/4.0/

**INSTALLATION:**
1. Copy the repo URL:  https://github.com/johnRedden/cseProject.git
2. Create a folder on your c-drive.
3. In Visual Studio Code, open the folder.
4. Click on Terminal => New Terminal
5. In the terminal run command: git clone https://github.com/johnRedden/cseProject.git
6. After clone is done, in VS Code Explorer, click on the cseProject folder.  You should see the index.html file in that folder.

**EXECUTION:**

8. In the terminal spin up a web server, run command:  python -m http.server
9. Navigate to the local host it creates, for example: http://localhost:8000/

Give the api a minute to come in, you may need to hit REFRESH.  Open the developer tools to see progress on console.  You may have a CORS error, check in "Network" and resolve the error.

NOTE: If you see a CORS error, check in "Network" and resolve the error.  This error is a little hard to fix, the api call is not safe, so you have to allow Cross Origin Requests (CORS).  I resolved the issue by installing an extension to google chrome.  https://mybrowseraddon.com/access-control-allow-origin.html
 
