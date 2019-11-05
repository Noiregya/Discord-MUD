const Classes = require('../../classes/Classes.js')
var document;
function generateItem(htmlItem){
  //TODO
}
function generateInteraction(htmlInteraction){
  //TODO
}
function generateDirection(htmlDirection){
  return new Classes.Direction(
    generateName(htmlDirection.getElementsByName('name')),
    htmlDirection.getElementsByName('description')[0].getTextContent(),
    htmlDirection.getElementsByName('targetMap')[0].value()
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
  htmlDirections.forEach(htmlDirection => {
    directions.push(generateDirection(htmlDirection));
  })
  return directions;
}

function generateAliases(htmlAliases){
  let aliases = new Array();
  htmlAliases.getElementsByName('alias').forEach(alias => {
    aliases.push(alias.getTextContent());
  })
  return aliases;
}

function generateName(htmlName){
  //TODO generate Aliases and load the text value for name
  return new Classes.Name(
    htmlName.getElementByName('name')[0].getTextContent(),
    generateAliases(htmlName.getElementsByName('aliases')[0])
  );
}

function generateMap(htmlMap){
  return new Classes.WorldMap(
    generateName(htmlMap.elements[0]),
    htmlMap.elements[1].getTextContent(),//Description
    generateDirections(htmlMap.elements[2]),//Directions
    generateInteractions(htmlMap.elements[3]),//Interactions
    generateItems(htmlMap.elements[4])//Items
  );
}
function generateMaps(){
  let htmlMaps = document.getElementsByName('map'); //get all elements of the map name
  let maps = new Array();
  htmlMaps.forEach(htmlMap=>{ //For each HTML Element
    if(htmlMap.elements.length < 1){
      alert('Fieldset map not correctly initialized.');
    }else{
      maps.push(generateMap(htmlMap)); //Add the JS element to the list
    }
  })
  return maps;
}
function generateWorld(myDocument){
  document = myDocument;
  document.getElementById('result').innerHTML = JSON.stringify(generateMaps()); //put result in field
}
module.exports = {generateWorld: generateWorld};
