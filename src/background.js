//Fires when select omnibox for extension
var default_url = "https://www.google.com/search?q=";
var data;

async function update_data(){
  data= await chrome.storage.local.get("sites")
var default_url_on_storage = await chrome.storage.local.get("default");
    if(default_url_on_storage!=undefined){
      default_url = default_url_on_storage.default;
    }
}
chrome.omnibox.onInputStarted.addListener(function(){
    //Set a default ...
    console.log('event started...');
  });
  
  //fires when select option and press enter
  chrome.omnibox.onInputEntered.addListener(async function(text){
    //Open selection into a new tab
    if(text.startsWith("https://")){
        chrome.tabs.update({url:text});
    }else{
        chrome.tabs.update({url:`${default_url}${encodeURIComponent(text)}`})
    }
  });
  chrome.omnibox.onInputChanged.addListener(async function(text, suggest){
    var suggestions = [];

    
    
    var sites = [];
    if(data.sites != undefined){
    sites = data.sites;
    }
      for (var i = 0; i < sites.length; i++) {
        var url = sites[i].url + encodeURIComponent(text);
        suggestions.push({
            content: url,
            description: 'Search ' +sites[i].title + ' for "' + text + '"'
        });
    }
    
    // Return  suggestions
    suggest(suggestions);
  });

  // Listen for the onInstalled event
chrome.runtime.onInstalled.addListener(function(details) {
  // Check if it's the first installation
  if (details.reason === 'install') {
    // Open the options page when the extension is installed for the first time
    chrome.runtime.openOptionsPage();
  }
});

function handleStorageChange(changes, area) {
  if (area === 'local') {
    for (let key in changes) {
      if (changes.hasOwnProperty(key)) {
        update_data();
      }
    }
  }
}

// Register the storage change listener
chrome.storage.onChanged.addListener(handleStorageChange);
update_data();