// Saves options to chrome.storage
function save_options() {
    var radios = document.getElementsByName('font');
    var font;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            font = radios[i].id;
            break;
        }
    }
    chrome.storage.sync.set({
        font: font
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value font = 'cic-bedford'
    chrome.storage.sync.get({
        font: 'cic-bedfort'
    }, function(items) {
        document.getElementById(items.font).checked = true;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);