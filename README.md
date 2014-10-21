FeederReader
================

RSS feed reader that takes XML links for RSS and appends them to user's list of RSS feeds. 
This application uses the 'Frameworkless' framework (https://github.com/synacorinc/frameworkless)

*NOTE*: There are many links that will not parse due to websites restricting CORS requests resulting in Access-Control-Allow-origin issues. This is not the app's fault. The RSS Feed host just doesn't allow a seperate domain to run it :(

**To run locally:**

1. Run `npm install` and then `npm start`
2. Located at `localhost:8080` by default
3. Follow steps below

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
- Refactor.
