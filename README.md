RSS Feed Reader
================

Limited use feed reader that takes XML links for RSS and appends them to user's list of RSS feeds. 
Currently found NPR and TheNewYorker RSS feeds to work.

1. Enter RSS URL in text field at top
2. Open menu and copy the feed name (NOT the feed source provider--e.g. NPR)
3. Append feed name to URL in address bar
4. Hit enter

Sample link: http://www.npr.org/rss/rss.php?id=1019

**TODO**

- Create feed.js model
- Split DOM code in rss.js to templates
- Find way to have server-side access to the RSS service or mirror it, and include necessary headers (i.e. "Access-Control-Allow-Origin") for CORS request
- Refactor.
