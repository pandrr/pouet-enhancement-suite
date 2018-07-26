
let pesSettings=
	{
		max_screenshot_width:640
	};

loadSettings(function()
	{
		initSettings();
		startDemoZoo();

	});

// const MAX_SCREENSHOT_WIDTH=640;


//
// initialize screenshot gallery and start loading the first image
//
function initScreenShotGallery(data)
{
	if(data.screenshots && data.screenshots.length>0)
	{
		var el=document.querySelector("#screenshot img");
		var screenIndex=0;
		
		el.classList.add('loading');

		el.src=data.screenshots[0].original_url;
		el.onload=function()
		{
			el.classList.add('fixed');
			el.classList.remove('loading');

			el.style="max-width:"+pesSettings.max_screenshot_width+'px';

			if(data.screenshots.length>1)
				el.classList.add('multiscreenshot');
		}

		el.onclick=function()
		{
			screenIndex=(++screenIndex)%data.screenshots.length;
			el.classList.add('loading');
			el.src=data.screenshots[screenIndex].original_url;
		}
	}
	else
	{
		console.log('no demozoo screenshots');
	}
}


//
// insert youtube embed code
//
function playYoutube(event)
{
	var id=event.srcElement.dataset.ytid;
	var html='<iframe width="640" height="360" src="https://www.youtube.com/embed/'+id+'?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

	var container=document.getElementById('screenshot');
	if(container)container.innerHTML=html;

	var imgEl=document.querySelector("#screenshot img");
	if(imgEl)imgEl.classList.add('hidden');
}

//
// parse demozoo external links for youtube and create play links
//
function initYoutubeLinks(data)
{
	var linksEl=document.getElementById('links');

	if(data.external_links && linksEl)
	{
		data.external_links.forEach(function(el)
		{
			if(el.link_class=='YoutubeVideo')
			{
				var urlParts=el.url.split('/');
				urlParts=urlParts[urlParts.length-1];
				urlParts=urlParts.split('=');
				var id=urlParts[urlParts.length-1];

				var ytLinkEl = document.createElement("a");
				ytLinkEl.classList.add('playyoutubelink');
				ytLinkEl.dataset.ytid=id;
				ytLinkEl.onclick=playYoutube;
				ytLinkEl.appendChild( document.createTextNode('play youtube video') );

				linksEl.appendChild(ytLinkEl);
			}
		});
	}
}


//
// request prod information from demozoo API
//
function getDemoZooData(id)
{
	fetch('https://demozoo.org/api/v1/productions/'+id)
		.then(function(response) { return response.json(); })
	    .then(function(data)
	    {
	    	// console.log(data);
			if(data)
			{
				initScreenShotGallery(data);
				initYoutubeLinks(data);
			}
		})
		.catch(function(e) {
       		console.log("fetch error",e);
    	});
}


function startDemoZoo()
{
	var elDemoZooId=document.querySelector('#demozooID a');
	if(elDemoZooId)
	{
		var parts=elDemoZooId.href.split('/');
		getDemoZooData(parts[parts.length-2]);
	}
	else
	{
		console.log('could not find demozoo id');
	}

}





















function closeSettings()
{
	if(document.getElementById("pes-settingspanel"))
		document.getElementById("pes-settingspanel").remove();
}

function openSettings()
{
	console.log(pesSettings);
	if(document.getElementById("pes-settingspanel"))
	{
		return;
	}

	var settingsPanel = document.createElement("div");
	settingsPanel.classList.add('settingspanel');
	settingsPanel.id="pes-settingspanel";
	settingsPanel.innerHTML=
		'max width screenshot <input type="number" id="setting_max_screenshot_width"/>'+
		'<br/><br/>'+
		'<input id="pes-savesettingspanel" type="button" class="pes-button" value="save"/>'+
		'<input id="pes-closesettingspanel" type="button" class="pes-button" value="close"/>'+
		'<br/><br/>pouet enhancement suite uses <a href="https://demozoo.org/">demozoo.org</a> as source. please support them, they are doing amazing work!';

	document.body.appendChild(settingsPanel);
	document.getElementById("pes-closesettingspanel").onclick=closeSettings;
	document.getElementById("pes-savesettingspanel").onclick=saveSettings;
	document.getElementById("setting_max_screenshot_width").value=pesSettings.max_screenshot_width;
}



function initSettings()
{
	var settingsButton = document.createElement("div");
	settingsButton.classList.add('settingsbutton');
	settingsButton.onclick=openSettings;

	document.body.appendChild(settingsButton);
}



function saveSettings()
{
	for(var i in pesSettings)
	{
		var settingEle=document.getElementById("setting_"+i);
		console.log(i);
		if(settingEle)
		{
			console.log(settingEle.value);
			pesSettings[i]=settingEle.value;
		}
	}

	console.log(pesSettings);

	chrome.storage.local.set(pesSettings,
		function(r)
		{
			console.log('settings saved',r); 
		});
}

function loadSettings(next)
{
	var keys=[];
	for(var i in pesSettings)keys.push(i);

	chrome.storage.local.get(keys, 
		function(result)
		{
			console.log(result);

			if(result.max_screenshot_width)
			{
				pesSettings=result;
				console.log('loaded pesSettings', result);
			}
			else
			{
				console.log("no valid pesSettings found...");
			}

			if(next)next();

		});
}

