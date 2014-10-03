define(
	[
		'util',
		'events',
		'zepto'
	], 
	function(_, events, $) {
		var feeds = [];


		function hasFeed(name){
			var has = false;
			feeds.forEach(function(feed){
				if (feed.name === name){
					has = feed;
					break;
				}
			});

			return has;
		}
		return {
			addFeed: function(feedName, feedUrl) {
				if (!feedName || !feedUrl) return false;

				feeds.push({
					name : feedName,
					url : feedUrl
				});
			},

			getFeed: function(feedName) {
				if (!feedName || !hasFeed(feedName)) return false;

				//todo: something to do network with the feed from hasFeed(feedName);
			}
		}
	}
);