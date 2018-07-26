
const MAX_SCREENSHOT_WIDTH=640;


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

