var oneHourAsMiliSecond = 60 * 60 * 1000;
var doApi = {
	rootUrl: 'https://api.digitalocean.com/',
	clientId: '',
	apiKey: '',

	getUrl: function(endpoint) {
		var self = this;
		var url = self.rootUrl + endpoint + '/?client_id=' + self.clientId + '&api_key=' + self.apiKey;
		return url;
	},

	getData: function(endpoint, cb) {
		// endpoint: droplets, regions, sizes
		var self = this;
		var url = self.getUrl(endpoint);
		console.log(url);
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(res) {
				//console.log(res);
				cb(res);
			}
		});
	}
};

chrome.storage.sync.get(null, function(items) {
    doApi.clientId = items.clientId;
    doApi.apiKey = items.apiKey;
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	switch(msg.cmd) {
		case 'getDroplets':
			getDroplets(sendResponse);
		break;

		case 'refresh':
			chrome.storage.sync.remove(['droplets', 'regions'], function() {
				getDroplets(sendResponse);
			});
		default:
		break;
	}
	return true;
});

function getDroplets(cb) {
	chrome.storage.sync.get(['droplets'], function(items) {
		if(items.droplets) {
			console.log('Found droplets from local storage');
			var lastUpdateTime = items.droplets.lastUpdateTime;
			var now = new Date().getTime();
			if(now - lastUpdateTime > oneHourAsMiliSecond) {
				console.log('update droplet list');
				getDropletsFromApi(cb);
			} else {
				console.log('list is fresh enough. returning from local storage');
				cb(items.droplets);
			}
		} else {
			console.log('fetch droplet list from api.');
			getDropletsFromApi(cb);
		}
	});
}

function getDropletsFromApi(cb) {
	doApi.getData('droplets', function(res) {
		if(res.status === 'OK') {
			function putRegions(regions) {
				for(var i=0; i<dropletList.length; i++) {
					var droplet = dropletList[i];
					for(var j=0; j<regions.length; j++) {
						if(droplet.region_id == regions[j].id) {
							droplet.region_name = regions[j].name;
						}
					}
				}
				addToSaved('regions');
			}

			function putSizes(sizes) {
				for(var i=0; i<dropletList.length; i++) {
					var droplet = dropletList[i];
					for(var j=0; j<sizes.length; j++) {
						if(droplet.size_id == sizes[j].id) {
							droplet.size_name = sizes[j].name;
						}
					}
				}
				addToSaved('sizes');
			}

			function saveAggregatedData() {
				var now = new Date().getTime();
				var droplets = {lastUpdateTime: now, list: dropletList};
				chrome.storage.sync.set({
					droplets: droplets
				}, function() {
					console.log('droplets are saved.');
					cb(droplets);
				});
			}

			var savedObjects = [];

			function addToSaved(objType) {
				console.log(objType);
				savedObjects.push(objType);
				if($.inArray('sizes', savedObjects) !== -1 && $.inArray('regions', savedObjects) !== -1) {
					saveAggregatedData();
				}
			}

			dropletList = res.droplets;
			getObj('regions', putRegions);
			getObj('sizes', putSizes);

			
		} else {
			console.log('Error fetching droplets from api.');
		}
	});
}

function getObj(objType, cb) {
	chrome.storage.sync.get([objType], function(items) {
		if(items[objType] && items[objType].length) {
			console.log('getting ' + objType + ' from local storage');
			cb(items[objType]);
		} else {
			doApi.getData(objType, function(res) {
				if(res.status === 'OK') {
					var saveObj = {};
					saveObj[objType] = res[objType];
					chrome.storage.sync.set(saveObj,
					function() {
						console.log(objType + ' saved successfully');
						cb(res[objType]);
					})
				} else {
					console.log('Error fetching ' + objType + ' from API');
				}
			});
		}
	});
}

