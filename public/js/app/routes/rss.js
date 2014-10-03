define([
	'util', 'view', 'zepto',
	'text!templates/rss.html'
], function(_, View, $, tpl) {
	var initialized = false,
		route = {
			url : '/:param',
			
			load : function(params, router) {
				console.log(params);

				//Define rssList
				var rssList;

				if (!initialized) {
					route.initUI();
					initialized = true;
				}

				//Get the stored list. If it doesn't exist, create one
				if(JSON.parse(localStorage.getItem('rssList'))) {
					rssList = JSON.parse(localStorage.getItem('rssList'));
				} else {
					rssList = [];
					localStorage.setItem('rssList', JSON.stringify(rssList));
				}

				//Update list menu for RSS feeds
				this.updateList(rssList);

				this.view.template({
					templateValue : "James is cool!"
				}).insertInto(
					router.options.viewBase || '#main'
				);
				
				this.data = {
					params : params
				};

				//Convert the URI to a string
				var paramString = this.convertToString(params.param);

				//Get URL of RSS Feed name
				var feedUrl = this.searchStorage(paramString);

				//Parse RSS to page if it exists
				if(feedUrl) { 
					this.parseRSS(feedUrl); 
				}
				else {
					$('#errorM').text("RSS not found. Use the input above to add a new RSS feed or find the correct name from the list.");
				}

			},

			//Listeners
			initUI : function() {
				if (!this.view) {
					this.view = new View(tpl);
				}
				$('#submit').on('click', handlers.submitClick);			//Submit new URL
				$('#linksBtn').on('click', handlers.listClick);			//Open links menu
				$('#emptyBtn').on('click', handlers.emptyListClick);	//Empty rssList
			},

			//Convert URI to readable string
			convertToString : function(uri) {
				var str = decodeURI(uri);

				return str;
			},

			//Search storage for RSS name and return its URL if it exists
			searchStorage: function(rssName){
				var list = JSON.parse(localStorage.getItem('rssList'));
				console.log("searchStorage - " + list + " Size: " + list.length);
				console.log("rssName", rssName);
				//Perform linear search
				for(var i = 0; i<list.length; i++) {
					if(rssName.toLowerCase() == list[i].name.toLowerCase()) return list[i].url;
				}

				return null;
			},
			
			unload : function() {
				this.view.base.remove();
			},

			//Store value of new RSS from input URL
			storeValue : function(newFeed) {
				$.get(newFeed, function (data) {
		     		$(data).find("channel").each(function(){
		     			var el = $(this);
		     			var list =  JSON.parse(localStorage.getItem('rssList'));
						var title = el.find('title').text(); //Get title of RSS feed and set as the name
		     			list.push({'name':title, 'url':data.URL});
		     			localStorage.setItem('rssList', JSON.stringify(list));
		     			route.updateList(list);
		     		});
	     		});
			},

			//If the RSS feed doesn't already exist, then return true
			alreadyExists : function(checkFeed) {
				var tempList = JSON.parse(localStorage.getItem('rssList'));

				for (var i = 0; i < tempList.length; i++) {
					if(checkFeed == tempList[i].url) return true;
				}

				return false;
			},

			//In case input URL does not contain http:// protocol, then append to it http://
			prependHTTP : function(url) {
				if(!(url.indexOf("http://") >=0)) url = "http://" + url;

				return url;
			},

			//For having site's name next to feed name in the list menu
			getSiteName : function(url) {
				var firstIndex = url.indexOf('.'),
					secondIndex = url.indexOf('.', firstIndex + 1),
				
					name = url.substring(firstIndex + 1, secondIndex);

				return name;
			},

			//Update list of feeds in the menu
			updateList : function(updatedList) {
				$('ul').empty();

				for (var i = 0; i < updatedList.length; i++) {
					var listItem = document.createElement('li');
					var siteName = this.getSiteName(updatedList[i].url);
					listItem.innerHTML = siteName + " - " + updatedList[i].name;
					$('ul').append(listItem);
				}
			},

			//Fetch XML feed for specific tags and store in DOM variables
			parseRSS: function(rssFeed){
	     		var elems = []; // New array to store DOM elements

				$.get(rssFeed, function (data) {
	        		var auth;

	     			//Title and website
		     		$(data).find("channel").each(function(){
		     			var heading2 = document.createElement('h2');
						var heading4 = document.createElement('h4');
		     			var el = $(this);

						heading2.innerHTML = el.find('title').text();
						heading4.innerHTML = el.find('link').text();

		     			elems.push(heading2);
		     			elems.push(heading4);

		     		});

		     		//Feed in articles and information
	     			$(data).find("item").each(function () { 
						var title = document.createElement('h3');
					 	var author = document.createElement('small');
				 		var desc = document.createElement('p');
				 		var divider = document.createElement('hr');
					 	var el = $(this);

					 	if(el.find("creator").text() === null){
					 		auth = "-";
					 	} else {
					 		auth = el.find("creator").text();
					 	}

					 	title.innerHTML = el.find('title').text();
					 	author.innerHTML = auth;
					 	desc.innerHTML = el.find('description').text();

		     	    	elems.push(divider);
		    			elems.push(title);
		     			elems.push(author);
		         		elems.push(desc);
		     		});
		     		
	     			route.build(elems);
				});
		     	
			},

			//Append DOM elements from parseRSS to DOM
			build: function(elArray){
				var div = document.getElementById("feed");
				for(var i=0; i < elArray.length; i++){
					div.appendChild(elArray[i]);
				}
			},

			//Temporary xml2json that works but fails
			xml2json : function(xml) {
				var obj = {};
	    		if (xml.nodeType == 1) {                
	       		if (xml.attributes.length > 0) {
	            	obj["@attributes"] = {};
	            	for (var j = 0; j < xml.attributes.length; j++) {
	                	var attribute = xml.attributes.item(j);
	                	obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
	            	}
	        	}
	    		} else if (xml.nodeType == 3) { 
	        		obj = xml.nodeValue;
	    		}            
			    if (xml.hasChildNodes()) {
			        for (var i = 0; i < xml.childNodes.length; i++) {
			            var item = xml.childNodes.item(i);
			            var nodeName = item.nodeName;
			            if (typeof (obj[nodeName]) == "undefined") {
			                obj[nodeName] = xmlToJson(item);
			            } else {
			                if (typeof (obj[nodeName].push) == "undefined") {
			                    var old = obj[nodeName];
			                    obj[nodeName] = [];
			                    obj[nodeName].push(old);
			                }
			                obj[nodeName].push(xmlToJson(item));
			            }
			        }
	    		}
	    		return obj;
			}
		
  		},

		handlers = {
		  	//If user clicks submit, then get the value of the input and store it
		  	submitClick : function() {
				var feed = $('#rssUrl').val();

				//Check http:// protocol and prepend if needed
				var fixedFeed = route.prependHTTP(feed);
				console.log(fixedFeed);
				//Check if feed url already exists. If it does not, then store the RSS
				if(!route.alreadyExists(fixedFeed)){
					route.storeValue(fixedFeed);
				}else {
					alert("This RSS feed already exists! Find the name for it in the Saved RSS list");

				}
		  	},

		  	//If user clicks Saved RSS Feeds Button, display the list
		  	listClick : function(duration) {
		  		$('#linksDiv').toggle();
		   	},

		   	emptyListClick : function() {
		   		var rssList = [];
		   		localStorage.setItem('rssList', JSON.stringify(rssList));
		   		console.log("List Size: " + JSON.parse(localStorage.getItem('rssList')).length);
		   		$('ul').empty();
		   	}
		};
  
  	return route;
});