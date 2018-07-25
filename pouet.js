
function getDemoZooData(id)
{
	console.log("fetching...");
	fetch('https://demozoo.org/api/v1/productions/'+id)

		.then(function(response) { console.log('fetchhhhh');return response.json(); })
	    .then(function(data) {

	// .then(
	// 	function(response)
	// {

	// 	response.json().then(
	// 		function(data)
		// {

			console.log("got response...");

	        console.log(data);

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
		})

		.catch(function(e) {
        console.log("error",e);
    	});;
	// });	
}



var elDemoZooId=document.querySelector('#demozooID a');
if(elDemoZooId)
{
	var parts=elDemoZooId.href.split('/');
	getDemoZooData(parts[parts.length-2]);
}
else
{
	console.log('could not find demozone id');
}

