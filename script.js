$(document).ready(function(){
    var url = $("#cartoonVideo").attr('src');
    
    $("#myModal").on('hide.bs.modal', function(){
        $("#cartoonVideo").attr('src', '');
    });

});

function showModal(id,title,description)
{
	let urlVideo = `//www.youtube.com/embed/${id}`;
    
	$("#cartoonVideo").attr('src', urlVideo);
	$("#myModal").modal("show");
	
	$("#modal-title").text(title);
	$("#modal-desc").text(description);
	
}

// Carga los datos de los videos al cargar la página
loadData();

function sendData() {
	  
    const XHR = new XMLHttpRequest();

    XHR.addEventListener("load", (event) => {
	  loadData();
    });

    XHR.addEventListener("error", (event) => {
      alert('Algo salió mal...');
    });

    XHR.open("POST", "https://4p09zln2n6.execute-api.us-east-1.amazonaws.com/Prod/videos");
	XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	//XHR.setRequestHeader('Access-Control-Allow-Origin', '*');
	
	const url = document.getElementById("inputUrl");
	
	var data = {
		"body": {
			"url": url.value
		}
	};
	
	XHR.send(JSON.stringify(data));
	url.value = "";
}

function removeData(dbID) {
	  
    const XHR = new XMLHttpRequest();

    XHR.addEventListener("load", (event) => {
	  loadData();
    });

    XHR.addEventListener("error", (event) => {
      alert('Algo salió mal...');
    });

    XHR.open("DELETE", "https://4p09zln2n6.execute-api.us-east-1.amazonaws.com/Prod/videos");
	XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	//XHR.setRequestHeader('Access-Control-Allow-Origin', '*');
	
	var data = {
		"body": {
			"id": dbID
		}
	};
	
	XHR.send(JSON.stringify(data));
}
  
const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
	sendData();
	event.preventDefault();  
});


async function loadData()
{
	let ids = [];
	
	const result = await fetch('https://4p09zln2n6.execute-api.us-east-1.amazonaws.com/Prod/videos');
	const resultJSON = await result.json();
	
	let elems = resultJSON.body;
	let elemsJSON = JSON.parse(elems);
	
	elemsJSON.Items.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
	elemsJSON.Items.map(x => ids.push(x.videoID));
	
	let urlYT = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBU2B2cqMlnE8f6irEk2_sz4di9QUwQ2ak&part=snippet&id=${ids.join(',')}`;
	
	const resultYT = await fetch(urlYT);
	const resultYTJSON = await resultYT.json();
	
	processResult(resultYTJSON, elemsJSON.Items);
}


function processResult(json, itemsDB)
{
	let result = "";

	const divContent = document.getElementById("content");
	
	if (json.items.length > 0)
	{
		for (let i = json.items.length - 1; i >= 0; i--)
		{
			json.items[i].dbID = itemsDB[i].id
			result += createHtml(json.items[i]);
		}
	}
	else 
	{
		result = "<div class='alert alert-warning' role='alert'>La lista de reproducción está vacía</div>";
	}
	
	divContent.innerHTML = result;
}

function createHtml(elem)
{
	let result = "";
	let imgUrl = "";
	let title = elem.snippet.title;
	let description = "";
	
	if (elem.snippet.description.length > 100)
	{
		description = elem.snippet.description.slice(0,100).replace("'", "\'").replace('"', '\"') + "...";
	}
	else
	{
		description = elem.snippet.description;
	}
	
	if (elem.snippet.thumbnails.standard)
	{
		imgUrl = elem.snippet.thumbnails.standard.url;
	}
	else
	{
		imgUrl = elem.snippet.thumbnails.default.url;
	}
	
	result += '<div class="col-xs-12 col-sm-4">';
	result += `<div class="card" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('${imgUrl}');">`;
	result += '<div class="card-description">';
	result += `<a href="#" onclick="showModal('${elem.id}', '${title}', '${description}')"><h4><b>${elem.snippet.title}</b></h4></a>`;
	result += `<p>${elem.snippet.channelTitle}</p>`;
	result += '</div>';
	result += `<a href="#" onclick="removeData('${elem.dbID}')"><img class="card-user avatar avatar-large" src="delete.png"></a>`;
	result += '</div>';
	result += '</div>';

	return result;
}


