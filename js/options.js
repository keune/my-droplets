function save() {
    var clientId = $('#txt-clientId').val();
    var apiKey = $('#txt-apiKey').val();
    console.log(clientId, apiKey);
    chrome.storage.sync.set({
        clientId: clientId,
        apiKey: apiKey
    }, function() {
        // Update status to let user know options were saved.
        $('#status').text('Options saved.');
        setTimeout(function() {
            $('#status').text('');
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get(null, function(items) {
        $('#txt-clientId').val(items.clientId);
        $('#txt-apiKey').val(items.apiKey);
    });
}

$(function() {
    restore();
    $('#btn-save').click(save);
});
