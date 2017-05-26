function showMapOptions() {
	if ($('#mapOptionsBox')[0].checked) {
		$('#mapOptions').show(500);
	}
	else {
		$('#mapOptions').hide(500);			
	}
}

function saveMapOptions() {
	if ($("#mapOptionsButton")[0].value == "Save") {
		$("#mapOptionsText")[0].innerHTML = "Click Edit to change the background map.  Note that changing the background map invalidates all images on the map.";
		$("#mapOptionsSet")[0].src="checkbox_checked.png";
		$("#mapOptionsButton")[0].value="Edit";
		$("#mapImagesText")[0].innerHTML = "Click the Add button to add an image";
		$("#mapAddImagesButton")[0].disabled = false;
		
		var center=mapOb.getView().getCenter();
		var zoomLevel=mapOb.getView().getZoom();
		// Sets the resolution to the 1/2 the max size of width and height in pixels at zoom level.
		var resolution = mapOb.getView().getResolution() * 450;
		var boxExtent = new Array(4);
		boxExtent[0] = center[0] - resolution;
		boxExtent[1] = center[1] - resolution;
		boxExtent[2] = center[0] + resolution;
		boxExtent[3] = center[1] + resolution;
		var view=new ol.View({
			center: center,
			zoom: zoomLevel,
			extent: boxExtent,
			maxZoom: zoomLevel+6,
			minZoom: zoomLevel
		});
		mapOb.setView(view);
		mapOb.getView().on("change:resolution", function() {
			if (currentImageObject != null)
				currentImageObject.displayImage();
		});

		backgroundMap.change(true, view);
	}
	else {
		$("#mapOptionsText")[0].innerHTML = "Set the background map you wish to use, and press the save button.";
		$("#mapOptionsSet")[0].src="checkbox_unchecked.png";				
		$("#mapOptionsButton")[0].value="Save";
		$("#mapImagesText")[0].innerHTML = "You cannot add images until the map is set ";
		$("#mapAddImagesButton")[0].disabled = true;
			
		backgroundMap.change(false, null);
	}
}

function showImagesOptions() {
	if ($('#mapImagesBox')[0].checked) {
		$('#mapImages_Images').show(500);
	}
	else {
		$('#mapImages_Images').hide(500);			
	}
}

function showImageControlPanel(imageNumber) {
	if (currentImageObject != null)
		mapOb.removeLayer(currentImageObject.pictureLayer);
	
	if (imageNumber == -1) {
		$("#filePreview")[0].src = "";;
		$("#imageFileTitle")[0].value = "";
		$("#imageFileSource")[0].value = "";
		currentImageObject = new MPO_ImageObject();
		document.getElementById("newOpacity").value = 70;
		document.getElementById("newSize").value = 50;
	}
	
	else {
		currentImageObject = imagesOnMap[imageNumber];
		currentImageObject.setImageNumber(imageNumber);
		$("#filePreview")[0].src = currentImageObject.fileImage.src;
		$("#imageFileTitle")[0].value = currentImageObject.title;
		//$("#imageFileSource")[0].value = currentImageObject.originURL;
		document.getElementById("newOpacity").value = currentImageObject.getOpacity() * 100;
		document.getElementById("newSize").value = currentImageObject.getScale() * 50;
		// This has to be changed to reculate the picture every time due to the zoom level.
		mapOb.addLayer(currentImageObject.pictureLayer);
	}
	$('#mapImageControlPanel').show(500);
}

function cancelImageEdit() {
	if (currentImageObject != null) {
		mapOb.removeLayer(currentImageObject.pictureLayer);
		currentImageObject = null;
	}
	$('#mapImageControlPanel').hide(500);
}		

function saveImageEdit() {
	
	if (currentImageObject == null) {
		alert("You have not chosen a map image");
		return;
	}
	
	currentImageObject.setTitle($("#imageFileTitle")[0].value);
	//currentImageObject.setAttribution($("#imageFileSource")[0].value);
	
	var imageNumber;
	
	if (currentImageObject.getImageNumber() == -1) {
		imageNumber = imagesOnMap.length;
		imagesOnMap[imageNumber] = currentImageObject;
			
		parentMapDiv = $("#mapImages_Images")[0];
		newDiv = document.createElement('div');
		newDiv.className = 'overlayImageDiv';	
		parentMapDiv.appendChild(newDiv);
		
		newImageDiv = document.createElement('div');
		newImageDiv.className = "overlayImageDiv_Image";
		newImageDiv.innerHTML = '<img src="" height="60px" id="filePreview' + imageNumber + '" />';
		newDiv.appendChild(newImageDiv);
		
		newInfoDiv = document.createElement('div');
		newInfoDiv.className = "overlayImageDiv_Info";
		newInfoDiv.innerHTML = "<p id='imageTitle" + imageNumber + "'> </p>";
		newInfoDiv.innerHTML += '<p><input type="button" value="Edit" onClick="showImageControlPanel('+ imageNumber + ')" /> </p>';
		newDiv.appendChild(newInfoDiv);
	}
	else {
		imageNumber = currentImageObject.getImageNumber();
		imagesOnMap[imageNumber] = currentImageObject;
	}

	document.getElementById("filePreview"+imageNumber).src = currentImageObject.fileImage.src;
	document.getElementById("imageTitle"+imageNumber).innerHTML = "Title: " + currentImageObject.title;
	$('#mapImageControlPanel').hide(500);
}

function changeOpacity() {
	opacityValue = document.getElementById("newOpacity").value/100;
	currentImageObject.setOpacity(opacityValue);
}

function changeSize() {
	currentImageObject.setScale(document.getElementById("newSize").value/50);
}