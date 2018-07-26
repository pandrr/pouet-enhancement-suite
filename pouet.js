
const MAX_SCREENSHOT_WIDTH=640;


//
// initialize screenshot gallery and start loading the first image
//
function initScreenShotGallery(data)
{
	if(!data.screenshots || !data.screenshots.length)
		return;

	var el=document.querySelector("#screenshot img");
	var screenIndex=0;
	el.classList.add('loading');
	el.src=data.screenshots[0].original_url;
	el.onload=function()
	{
		el.classList.add('fixed');
		el.classList.remove('loading');
	}

	if (data.screenshots.length == 1)
		return;

	var gallery=document.getElementById('screenshot');
	gallery.classList.add('gallery');
	var prev = document.createElement('span');
	prev.classList.add('prev');
	prev.innerHTML = "&#8249;";
	var next = document.createElement('span');
	next.classList.add('next');
	next.innerHTML = "&#8250;";
	gallery.appendChild(prev);
	gallery.appendChild(next);

	var indicator=document.createElement('div');
	gallery.appendChild(indicator);
	indicator.append.apply(indicator, data.screenshots.map(function(s)
	{
		var a = document.createElement('a');
		a.href = s.original_url;
		return a;
	}));
	indicator.children[0].classList.add('active');
	indicator.classList.add('indicator');

	prev.onclick=
	next.onclick=function()
	{
		if(this.classList.contains('prev'))
		{
			if(screenIndex==0)
				screenIndex=data.screenshots.length-1;
			else
				screenIndex--;
		}
		else
			screenIndex=(++screenIndex)%data.screenshots.length;

		Array.prototype.forEach.call(indicator.children,function(i)
		{
			i.classList.remove('active');
		});
		indicator.children[screenIndex].classList.add('active');
		el.classList.add('loading');
		el.src=data.screenshots[screenIndex].original_url;
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
		return;

	data.external_links.forEach(function(el)
	{
		if(el.link_class!='YoutubeVideo')
			return;

		var urlParts=el.url.split('/');
		urlParts=urlParts[urlParts.length-1];
		urlParts=urlParts.split('=');
		var id=urlParts[urlParts.length-1];

		var ytLinkEl=document.createElement("a");
		ytLinkEl.classList.add('playyoutubelink');
		ytLinkEl.dataset.ytid=id;
		ytLinkEl.onclick=playYoutube;
		ytLinkEl.appendChild( document.createTextNode('play youtube video') );

		linksEl.appendChild(ytLinkEl);
	});
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
			if(!data)
				return;
			initScreenShotGallery(data);
			initYoutubeLinks(data);
		})
		.catch(function(e) {
			console.log("fetch error",e);
		});
}



var elDemoZooId=document.querySelector('#demozooID a');
if(elDemoZooId) {
	var parts=elDemoZooId.href.split('/');
	getDemoZooData(parts[parts.length-2]);
}
