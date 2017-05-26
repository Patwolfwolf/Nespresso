
function MPO_ImageObject() {
	
	this.widthInProjection =  0;
	this.widthInPixels = 0;
	this.scale = 1;  // On save, reset this to 1
	this.resolution = 0;
	this.opacity = 0.7;
	this.imageNumber = -1;
	this.inputFileName = null;
	this.fileImage = null;
	this.title = null;
	this.attribution = null;
	this.center = [0,0];
	this.pictureLayer = null;
 

    this.setImageNumber = function (imageNumber) {
        this.imageNumber = imageNumber;
    }  

    this.getImageNumber = function () {
        return this.imageNumber;
    }    
	

	this.setCenter = function(center) {
	    this.center = center;
		this.displayImage();
	}
	
	this.getCenter = function() {
		return this.center;
	}
	
	this.getScale = function() {
		return this.scale;
	}
	
    this.setScale = function(scaleFactor) {
		this.scale = scaleFactor;
		this.displayImage();
	}
	
	this.setTitle = function(title) {
	    this.title = title;	
	}
	
	this.getTitle = function() {
		return this.title;
	}
	
	this.setInputFileName = function(fileName) {
		this.inputFileName = fileName;
	}
	
	this.getInputFileName = function() {
		return fileName;
	}
	
	this.setFileImage = function (fileImage) {
		this.fileImage = fileImage;
	}
	
	this.setOpacity = function(opacity) {
		this.opacity = opacity;
		this.displayImage();
	}
	
	this.getOpacity = function() {
		return this.opacity;
	}
	
	this.setAttribution = function(attribution) {
		this.attribution = attribution;
	}
	
	this.getAttribution = function() {
		return this.attribution;
	}

	this.displayImage = function() {
		if (this.pictureLayer != null) {
			mapOb.removeLayer(currentImageObject.pictureLayer);
		}
		
		var resolutionUnits = mapOb.getView().getResolution();
		var pointFeature = new ol.Feature(new ol.geom.Point(this.center));		
		var sizeofImage = ((this.widthInProjection/resolutionUnits)/this.fileImage.width) * this.scale
		
		this.pictureLayer =  new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [pointFeature]
            }),
            style: new ol.style.Style({
				image:  new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
					anchor: [0.5, 0.5],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: this.opacity,
					scale: sizeofImage,
					src: this.fileImage.src,
				}))
			}),
        });			  
		
		//Add new picture layer
		mapOb.addLayer(this.pictureLayer);
	}
	
	this.displayNewImage = function(pixels) {
		if (this.pictureLayer != null) {
			mapOb.removeLayer(currentImageObject.pictureLayer);
		}
		
		this.center=mapOb.getView().getCenter();
		this.ratioXtoY = this.fileImage.width / this.fileImage.height;
		var resolutionUnits = mapOb.getView().getResolution();
		this.widthInProjection =  resolutionUnits * (pixels);
		this.widthInPixels = this.fileImage.width;
		this.scale = 1.0;
	
	    this.displayImage();
	}
}
