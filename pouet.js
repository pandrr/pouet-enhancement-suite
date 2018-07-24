
function getDemoZooData(id)
{
	fetch('//demozoo.org/api/v1/productions/'+id).then(function(response)
	{
		response.json().then(function(data)
		{
	        console.log(data);

			if(data.screenshots && data.screenshots.length>0)
			{
				var el=document.querySelector("#screenshot img");
				var screenIndex=0;
				
				el.src=data.screenshots[0].original_url;
				el.onload=function()
				{
					el.classList.add('fixed');
				}

				el.onclick=function()
				{
					screenIndex=(++screenIndex)%data.screenshots.length;
					el.src=data.screenshots[screenIndex].original_url;
				}
			}
		});
	});	
}



var elDemoZooId=document.querySelector('#demozooID a');
if(elDemoZooId)
{
	console.log(elDemoZooId);
	console.log(elDemoZooId.href);

	var parts=elDemoZooId.href.split('/');

	console.log(parts);
	getDemoZooData(parts[parts.length-2]);
}
else
{
	console.log('could not find demozone id');
}

