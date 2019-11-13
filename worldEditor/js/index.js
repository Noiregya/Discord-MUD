const Classes = require('../../classes/Classes.js')
var document;
function generateItem(htmlItem){
  //TODO
}
function generateInteraction(htmlInteraction){
  //TODO
}
function generateDirection(htmlDirection){
  let name;
  let index;
  let description;
  for(l=0; l<htmlDirection.elements.length; l++){
    switch (htmlDirection.elements[l].name){
      case 'name':
        name = generateName(htmlDirection.elements[l]);
      break;
      case 'mapIndex':
        index = htmlDirection.elements[l].value;
      break;
      case 'description':
        description = htmlDirection.elements[l].value;
      break;
      default:
        //TODO: maybe something here??
      }
    }
  return new Classes.Direction(
    name,
    description,
    index
  );
}
function generateItems(htmlItems){
  let items = new Array();
  htmlItems.forEach(htmlItem =>{
    items.push(generateItem(htmlItem));
  })
  return items;
}
function generateInteractions(htmlInteractions){
  let interactions = new Array();
  htmlInteractions.forEach(htmlInteraction => {
    interactions.push(generateInteraction(htmlInteraction));
  })
  return interactions;
}
function generateDirections(htmlDirections){
  let directions = new Array();
  for(k=0; k<htmlDirections.elements.length;k++){

    if(htmlDirections.elements[k].name == 'direction'){
      directions.push(generateDirection(htmlDirections.elements[k]));
    }
  }
  return directions;
}

function generateAliases(htmlAliases){
  let aliases = new Array();
  for(j=0;j<htmlAliases.elements.length;j++){
    if(htmlAliases.elements[j].type=='text'){
        aliases.push(htmlAliases.elements[j].value);
    }
  }
  return aliases;
}

function generateName(htmlName){
  //TODO generate Aliases and load the text value for name
  return new Classes.Name(
    htmlName.elements[0].value,
    generateAliases(htmlName.elements[1])
  );
}

function generateMap(htmlMap){
  let name;
  let mapDescription;
  let directions;
  let interactions;
  let items;

  for(i=0; i<htmlMap.elements.length; i++){
    switch (htmlMap.elements[i].name){
      case 'mapName':
        name = generateName(htmlMap.elements[i]);
      break;
      case 'mapDescription':
        mapDescription = htmlMap.elements[i].value;
      break;
      case 'mapDirections':
        directions = generateDirections(htmlMap.elements[i]);
      break;
      case 'mapInteractions':
        //interactions = generateInteractions(htmlMap.elements[i]);
      break;
      case 'mapItems':
        //items = generateItems(htmlMap.elements[i]);
      break;
      default:
        //console.log(htmlMap.elements[i].name);
    }
  }
  console.log(name);
  console.log(mapDescription);
  return new Classes.WorldMap(
    name, mapDescription, directions, interactions, items
  );
}
function generateMaps(){
  let htmlMaps = document.getElementsByName('map'); //get all elements of the map name
  let maps = new Array();
  htmlMaps.forEach(htmlMap=>{ //For each HTML Element
    maps.push(generateMap(htmlMap)); //Add the JS element to the list
  })
  return maps;
}
function generateWorld(myDocument){
  document = myDocument;
  document.getElementById('result').innerHTML = JSON.stringify(generateMaps()); //put result in field
}
module.exports = {generateWorld: generateWorld};
