//Generate map file with `node maps.js`

const mapsFilePath = './generatedMaps.json'
const fs = require('fs');
const Classes = require('./classes/Classes.js')

var maps = new Array()

let mapOne = new Classes.WorldMap( //Declare a first map
    new Classes.Name('North-West Prison Cell', ['north-west', 'north west']), //The map name and aliases
    'The cell is very narrow. In-front of you is a rusted barred door.',
    //List of the map's directions
    [new Classes.Direction( //A first direction
        new Classes.Name('Prison Room', ['exit', 'door']), //The name and aliases of the direction
        'You have exited the prison cell.', //Text that describe the description
        1//Index of the map the direction leads to
    )]
)

let mapTwo = new Classes.WorldMap( 
    new Classes.Name('Prison Room', ['north', 'exit', 'door']),
    'You are in the prison room. There is a prison cell at the North-East. There is light peering from a doorway on the south side of the room.',
    [new Classes.Direction(
        new Classes.Name('North-West Prison Cell', ['north-west', 'north west']),
        'You have entered the North-West Prison Cell.',
        0
    ),
	(
        new Classes.Name('Training Room', ['south']),
        'You have entered the Training Room.',
        2
    )],
    [new Classes.Grabbable(
        new Classes.Name('a set of keys on the ground.', ['keys', 'key']),
        'You pick up the keys.',
        //A list of all items you will grab
        [new Classes.Item(//Item declaration
            new Classes.Name('Keys', []),
            'A set of rusty keys.',//Name of the item
            //Optionnal, add an effect to the item
        )]
    )]
)

let mapThree = new Classes.WorldMap(
    new Classes.Name('Training Room', ['south', 'west']),
    'You are in what seems to be an abandoned room used for combat training. There are a set of three wooden mannequins standing in the side of the room. The Prison Room is through a doorway on the North side of the room. There is a doorway on east side of the room that leads to a hallway.',
    [new Classes.Direction( 
        new Classes.Name('Prison Room', ['north']),
        'You have entered the Prison Room.',
        1
    ),
	(
        new Classes.Name('Hallway', ['east']),
        'You have entered the Hallway.',
        3
	)]
)

let mapFour = new Classes.WorldMap(
    new Classes.Name('Hallway', ['west', 'north', 'south']),
    'You are in the dungeon hallway. There is a North doorway that leads to an Alchemy Lab. The dungeons exit gate is located East down the hallway. There is also a South doorway that leads to a Pantry. The west doorway leads back to the Training Room.',
    [new Classes.Direction( 
        new Classes.Name('Training Room', ['west']),
        'You have entered the Training Room.',
        2
    ),
	( 
        new Classes.Name('Alchemy Lab', ['north']),
        'You have entered the Alchemy Lab.',
        4
    ),
	( 
        new Classes.Name('Pantry', ['south']),
        'You have entered the Pantry.',
        5
	),
	( 
        new Classes.Name('End Forest', ['east']),
        'You have entered the End Forest and escaped the dungeon. Congratulations!',
        7
	)]
)

let mapFive = new Classes.WorldMap(
    new Classes.Name('Alchemy Lab', ['north', 'west']),
    'You are in the Alchemy Lab. There is an East doorway that is abstracted by rubble. South leads back to the Hallway.',
    [new Classes.Direction( 
        new Classes.Name('Hallway', ['south']),
        'You have entered the Hallway.',
        3
    ),
	( 
        new Classes.Name('Hidden Room', ['East']),
        'You have entered the Hidden Room.',
        6
	)]
)

let mapSix = new Classes.WorldMap(
    new Classes.Name('Pantry', ['south']),
    'You are in the Pantry. North leads back to the Hallway.',
    [new Classes.Direction( 
        new Classes.Name('Hallway', ['north']),
        'You have entered the Hallway.',
        3
    )]
)

let mapSeven = new Classes.WorldMap(
    new Classes.Name('Hidden Room', ['east']),
    'You are in the Hidden Room. There is a large rusty lever on the wall. West leads back to the Alchemy Lab.',
    [new Classes.Direction( 
        new Classes.Name('Alchemy Lab', ['west']),
        'You have entered the Alchemy Lab.',
        4
    )]
)

let mapEight = new Classes.WorldMap(
  new Classes.Name('End Forest'),
  'You are in a lively forest, there\'s no signs of the dungeon you just escaped from. Congratulations, you won.')//A map with no interactions or directions

maps.push(mapOne)
maps.push(mapTwo)
maps.push(mapThree)

fs.writeFile(mapsFilePath,JSON.stringify(maps),function(){
  console.log('Wrote maps');
})
