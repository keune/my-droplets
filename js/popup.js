var bg = chrome.extension.getBackgroundPage();
var tmplDroplet = $('#tmpl-droplet').html();
Mustache.parse(tmplDroplet);

function listDroplets(res) {
	var html = '';
	if(res.list) {
		var droplets = res.list;
		if(droplets.length) {
			for(var i=0; i<droplets.length; i++) {
				html += Mustache.render(tmplDroplet, droplets[i]);
			}
		} else {
			html = '<p class="default-msg">You don\'t have any droplets.</p>';
		}
	} else {
		html = '<p class="default-msg">Error fetching droplets</p>';
	}
	$('#droplets').html(html);
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

});

function getDroplets() {
	chrome.runtime.sendMessage({cmd: 'getDroplets'}, function(res) {
		listDroplets(res);
	});
}

getDroplets();

$('#droplets').on('click', '.droplet .info input', function() {
	var $el = $(this);
	$el.select();
});

$('#lnk-refresh').click(function() {
	$('#droplets').html('<p class="default-msg">Retrieving droplets...</p>');
	chrome.runtime.sendMessage({cmd: 'refresh'}, function(res) {
		listDroplets(res);
	});
});