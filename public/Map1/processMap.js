var myMap;
var pictureArrayTemp;

function saveTiles(tiles)
{
    var selectPicture = new Array(2)
    selectPicture[0]  = null
    selectPicture[1] = null
    var myTiles = tiles;
    var baseMap = new ol.Map({
      target: 'map',
      layers: tiles[0],
      view: new ol.View({
        center: ol.proj.transform([-77.23, 39.83], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13,
        extent:  ol.proj.transformExtent([-77.14, 39.75, -77.26, 39.90],  'EPSG:4326', 'EPSG:3857'),
        maxZoom: 18.0,
        minZoom: 12.0
      })
    });

    this.display = function (layer) {
      layers=baseMap.getLayers().getArray()
      var length=layers.length
      for (i=0;i<length;i++) {
      baseMap.removeLayer(layers[0])
      }

      for (a=0;a<myTiles[layer].length;a++)
        baseMap.addLayer(myTiles[layer][a])

      for (var i = 0; i < selectPicture.length; i++) {
        if (selectPicture[i] != null) {
          baseMap.addLayer(selectPicture[i])
        }
      }
    }

    this.getbaseMap = function() {
      return myMap;
    }

    this.changeOpacity = function(section, opacity) {
      selectPicture[section].setOpacity(opacity)
    }

    this.changePicture = function(section, picNum) {
      for (var j = 0; j < selectPicture.length; j++) {
          if (selectPicture != null) {
            console.log("successfully added1");
            baseMap.removeLayer(selectPicture)
          }
       }
       readPictureFile("pictures.json");
       console.log("hhhh");
       console.log(pictureArrayTemp);
       console.log(pictureArrayTemp[2]);
        selectPicture = pictureArrayTemp[picNum];
        // for (var k = 0; k < selectPicture.length; k++) {
          if (selectPicture != null) {
            console.log("successfully added");
            baseMap.addLayer(selectPicture);
          }
        // }
        selectPicture.setOpacity(100)
     }
  return this;
}


function StamenMap (options) {
    var label = options["label"]
    var tl = new ol.layer.Tile({
      source: new ol.source.Stamen({
              layer: label
            })
    })
    return tl;
}

function XYZMap(options) {
  var myUrl=options["url"]
  var tl=new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: myUrl,
      opacity: true
    })
  })
  return tl;
}

function PictureMap(options) {
  var myUrl = options["url"];
  var myExtent = options["extent"];
  console.log(myExtent);
  var trueTrueExtent = ol.proj.transformExtent(myExtent, 'EPSG:4326','EPSG:3857');
  console.log(trueTrueExtent);
  var t1 = new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: myUrl,
      opacity: true,
      // imageExtent: ol.extent.applyTransform(myExtent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
      imageExtent: trueTrueExtent
    })
  })
  return t1;
}

    /*
    This function reads the object parsed from JSON.  Since JSON does not
    maintain the obj.constructor property, I create an instance of the
    specific object type (stored in instanceType) and copy the fields
    into this new object.  This "effectively" casts the object to the correct
    type.
    */
function getPicturesFromJSON(string) {
  var pictures = new Array();
  parsedArray = JSON.parse(string);
  var length = parsedArray.length;
  console.log("aaa");
  for (var i = 0; i<length; i++) {
    console.log(parsedArray[i].url);
    pictures[i] = PictureMap(parsedArray[i]);
  }
  console.log(pictures[2]);
  return pictures;
}

function getMapsFromJSON(string) {
  var maps = new Array();
  parsedArray = JSON.parse(string);
  var len1 = parsedArray.length;
  for (var i = 0; i < len1; i++){
    maps[i] = new Array();
    var len2 = parsedArray[i].length;
    for (var j = 0; j < len2; j++){
        objType=parsedArray[i][j].instanceType;
        maps[i][j] = window[objType](parsedArray[i][j]);
      }
  }
  return maps;
 }

function readPictureFile(file) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", file, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.onreadystatechange = function () {
    if(xmlhttp.readyState === 4) {
      if(xmlhttp.status === 200 || xmlhttp.status == 0){
        var allText = xmlhttp.responseText;
        // console.log("status =  " + xmlhttp.status + " text = "  + allText)
        // console.log(allText);
        var pictureArray = getPicturesFromJSON(allText);
        pictureArrayTemp = pictureArray;
        console.log(pictureArrayTemp[2]);
        console.log("bbbb");
      }
    }
  }
  xmlhttp.send();
}

function readMapFile(file){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file, true);
    xmlhttp.onreadystatechange = function (){
      if(xmlhttp.readyState === 4){
        if(xmlhttp.status === 200 || xmlhttp.status == 0){
          var allText = xmlhttp.responseText;
          // console.log("status =  " + xmlhttp.status + " text = "  + allText)
          var tiles = getMapsFromJSON(allText);
          // console.log(tiles);
          myMap = saveTiles(tiles)
        }
      }
    }
    xmlhttp.send();
}
