RSS Feed Reader
================

Limited use feed reader that takes XML links for RSS and appends them to user's list of RSS feeds. 
Currently found NPR and TheNewYorker RSS feeds to work.

*App works when appending '/rss' to url [without quotes]*

**TODO**

- Create feed.js model
- Split DOM code in rss.js to templates
- Find way to have server-side access to the RSS service or mirror it, and include necessary headers (i.e. "Access-Control-Allow-Origin") for CORS request
- Refactor.