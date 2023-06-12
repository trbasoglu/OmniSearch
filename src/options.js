let options_form = document.getElementById("options-form");
    let save_btn = document.getElementById("save_btn");
    let country_select = document.getElementById("country-select");
    let default_select = document.getElementById("default-select");
    let country_flag = document.getElementById("country-flag");
    // Define the path to the JSON file
    const jsonPath = './data.json';
    let init = true;
    let data;

    function title(title){
        const paragraph = document.createElement('p');
        paragraph.textContent = title;
        paragraph.classList.add('has-text-primary');
        return paragraph
    }

    function searchOption(site){
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="site[]" value="${site.url}"> <img class="image is-16x16" style="display: initial;" src="${site.fav_icon}"> ${site.name}`;
        return label;
    }
    function clearUI(){
        while (options_form.childNodes.length > 2) {
            options_form.removeChild(options_form.firstChild);
        }
    }

    function create_option(value, innerText){
        let option = document.createElement("option");
        option.value = value;
        option.innerText = innerText;
        return option;
    }
    function buildUI(){
        default_select.innerHTML = "";
        default_select.appendChild(create_option("https://www.google.com/search?q=","Google"));
        for(const group of data){
        options_form.insertBefore(title(group.title),save_btn);
        if(group.title == "Shopping"){
            for(const country of group.elements){
                lang_code = navigator.language.split("-")
                if(init){
                    country_select.appendChild(create_option(country.code, country.country));
                    if(lang_code.length>1){
                    if(lang_code[1].toLocaleLowerCase()== country.code){
                    country_select.selectedIndex  = country_select.children.length-1
                }
                }
                else{
                    if(lang_code[0].toLocaleLowerCase()== country.lang){
                    country_select.selectedIndex  = country_select.children.length-1
                }
                }
                }
                
            }
            for(const site of group.elements[country_select.selectedIndex].sites){
                options_form.insertBefore(searchOption(site),save_btn);   
                default_select.appendChild(create_option(site.url,site.name));
            }
            country_flag.src = `assets/flags/${group.elements[country_select.selectedIndex].code}.png`
        }else{
            for(const site of group.sites){
                options_form.insertBefore(searchOption(site),save_btn);
                default_select.appendChild(create_option(site.url,site.name));
            }
        }
    }
    
    }
    
    // Fetch the JSON data using the fetch() method
    fetch(jsonPath)
    .then(response => response.json())
    .then(function(jsonData){
        data = jsonData;
        buildUI();
        init = false;
        country_select.onchange = (e) =>{
            clearUI();
            buildUI();
        };
    })
    .catch(error => {
    console.error("Error fetching JSON data:", error);
    });
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('options-form');

    // Load the saved options when the page is opened
    chrome.storage.local.get('sites', function(data) {
        if (data.sites) {
            for (const element of form.elements['site[]']) {
                var site = element.value;
                element.checked = data.sites.indexOf(site) !== -1;
            }
        }
    });

    // Save the options when the form is submitted
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let sites = [];
        for (const element of form.elements['site[]']) {
            if (element.checked) {
                sites.push({"title":element.parentElement.innerText,"url":element.value});
            }
        }
        chrome.storage.local.set({ sites: sites });
        chrome.storage.local.set({ default: default_select.value });
        alert('Options saved!');
    });
});

