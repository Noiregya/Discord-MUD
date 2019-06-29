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
    'You are in the prison room. There is a prison cell at the North-West. There is light peering from a doorway on the south side of the room.',
    [new Classes.Direction(
        new Classes.Name('North-West Prison Cell', ['north-west', 'north west']),
        'You have entered the North-West Prison Cell.',
        0
    ),
	new Classes.Direction(
        new Classes.Name('Training Room', ['south']),
        'You have entered the Training Room.',
        2
    )],
    [new Classes.Grabbable(
        new Classes.Name('a set of keys on the ground', ['keys', 'key']),
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
    ), new Classes.Direction(
        new Classes.Name('Hallway', ['east']),
        'You have entered the Hallway.',
        3
	    )],
	[
      new Classes.Grabbable(new Classes.Name('training sword', ['sword']), 'A wooden training sword',
        [new Classes.Item(new Classes.Name('training sword', ['sword']), 'A wooden training sword',
          [new Classes.Unlock('You should train on these mannequins.', 'sword')])]),

      new Classes.Interaction(new Classes.Name('the left mannequin', ['left', 'left_mannequin']), 'It\'s just a mannequin.'),

      new Classes.Activable(new Classes.Name('a mannequin on the center', ['center', 'center_mannequin']),'You examine the mannequin on the center.',
        [new Classes.Lock('You make a big slit on the mannequin despite the sword being made out of wood. This makes you feel powerful.',
        'It\'s just a mannequin.',
        'sword'
          )
        ]
      ),

      new Classes.Interaction(new Classes.Name('the right mannequin', ['right', 'right_mannequin']), 'It might be right, but don\'t lsiten to it.')
    ]
)


let mapFour = new Classes.WorldMap(
    new Classes.Name('Hallway', ['west', 'north', 'south']),
    'You are in the dungeon hallway. There is a North doorway that leads to an Alchemy Lab. The dungeons exit gate is located East down the hallway. There is also a South doorway that leads to a Pantry. The west doorway leads back to the Training Room.',
    [new Classes.Direction(
        new Classes.Name('Training Room', ['west']),
        'You have entered the Training Room.',
        2
    ),
	new Classes.Direction(
        new Classes.Name('Alchemy Lab', ['north']),
        'You have entered the Alchemy Lab.',
        4
    ),
	new Classes.Direction(
        new Classes.Name('Pantry', ['south']),
        'You have entered the Pantry.',
        5
	)
],[new Classes.Activable(new Classes.Name('Main entrence', ['exit', 'door', 'outside', 'troll']), 'This seems to be the main entrence.',
  new Classes.Lock(
      'The troll is gone, you can finally escape, and oh boy, you do!',
      'You can see outside, threes are waving to the wind, but a troll is waiting for you at the entrence, better not take that route if you want to be back home in one piece.',
      'lever',[new Classes.Teleportation('You run outside, welcomed by the soft wind and the grassy smells.', 7)]
    ))]
)

let mapFive = new Classes.WorldMap(
    new Classes.Name('Alchemy Lab', ['north', 'west']),
    'You are in the Alchemy Lab. There is an East doorway that is abstracted by rubble. South leads back to the Hallway.',
    [new Classes.Direction(
        new Classes.Name('Hallway', ['south']),
        'You have entered the Hallway.',
        3
    )],[

    new Classes.Grabbable(new Classes.Name('Mage staff', ['staff', 'wand']), 'You take the mage staff.', [
      new Classes.Item(new Classes.Name('Mage staff', ['staff', 'wand']), 'A staff with "Explosion" engraved into it.',
        [new Classes.Unlock('The tip of the staff makes the whole place shake, you hear something crumbling.', 'staff')])]),

    new Classes.Activable(new Classes.Name('A pile of rubble blocking the path.', ['rubble', 'door', 'entrence']),'You examine the rubble, it seems fragile.',
      [new Classes.Lock('The eartquake that your staff caused removed the rubble partially, you decide to enter.',
      'The rubble is blocking the way but you can clearly see some sort of entrence.',
      'staff',[new Classes.Teleportation('You manage to walk between the rubble bits and discover a secret room.', 6)]
        )
      ]
    )

  ]
)

let mapSix = new Classes.WorldMap(
    new Classes.Name('Pantry', ['south']),
    'You are in the Pantry. North leads back to the Hallway.',
    [new Classes.Direction(
        new Classes.Name('Hallway', ['north']),
        'You have entered the Hallway.',
        3
    )],
)

let mapSeven = new Classes.WorldMap(
    new Classes.Name('Hidden Room', ['east']),
    'You are in the Hidden Room. There is a large rusty lever on the wall. West leads back to the Alchemy Lab.',
    [new Classes.Direction(
        new Classes.Name('Alchemy Lab', ['west']),
        'You have entered the Alchemy Lab.',
        4
    )],[
      new Classes.Activable(new Classes.Name('A rusty lever.', ['lever']),'You examine the lever, it\'s a good old lever.',
        [new Classes.Unlock('You hear some sort of alarm.','lever')]
          )
        ]
      )

let mapEight = new Classes.WorldMap(
  new Classes.Name('End Forest'),
  'You are in a lively forest, there\'s no signs of the dungeon you just escaped from. Congratulations, you won.')//A map with no interactions or directions

maps.push(mapOne)
maps.push(mapTwo)
maps.push(mapThree)
maps.push(mapFour)
maps.push(mapFive)
maps.push(mapSix)
maps.push(mapSeven)
maps.push(mapEight)

fs.writeFile(mapsFilePath,JSON.stringify(maps),function(){
  console.log('Wrote maps');
})
