RSS Feed Reader
================

Limited use feed reader that takes XML links for RSS and appends them to user's list of RSS feeds. 
Currently found NPR and TheNewYorker RSS feeds to work. This application uses the 'Frameworkless' framework (https://github.com/synacorinc/frameworkless)

**To run locally:**
1. Point towards root directory in terminal/bash/shell/...
2. Run 'npm install' (or install Node first if you don't have it yet)
3. Run 'npm start'
4. Enter 'localhost:8080' (or whatever the port is set to) in your browser
5. Follow steps below

**Operating the app**
1. Enter RSS URL in text field at top
2. Open menu and copy the feed name (NOT the feed source provider--e.g. NPR)
3. Append feed name to URL in address bar
4. Hit enter

Sample link: http://www.npr.org/rss/rss.php?id=1019

**TODO**
- Click-to-view functionality from menu
- Create feed.js model
- Split DOM code in rss.js to templates
- Find way to have server-side access to the RSS service or mirror it, and include necessary headers (i.e. "Access-Control-Allow-Origin") for CORS request
- Refactor.
