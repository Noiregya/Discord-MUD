//Generate map file with `node maps.js`

const mapsFilePath = './generatedMaps.json'
const fs = require('fs');
const Classes = require('./classes/Classes.js')

var maps = new Array()

let mapOne = new Classes.WorldMap( //Declare a first map
    new Classes.Name('First map', ['Other name', 'A third name']), //The map name and aliases
    'Placeholder description of first map',
    //List of the map's directions
    [new Classes.Direction( //A first direction
        new Classes.Name('Direction second map', ['South']), //The name and aliases of the direction
        'This is the second map that you can find by taking the south path.', //Text that describe the description
        1//Index of the map the direction leads to
    ), new Classes.Direction(
        new Classes.Name('Also direction second map', ['North']),
        'This is the second map that you can find by taking the north path.',
        1
    )],
    //A list of all interactions available on the current map
    [new Classes.Interaction(//A generic Interaction that does nothing
        new Classes.Name('A rock that you can do nothing with.', ['Rock', 'Boulder']),
        'You cannot do anything with this rock.',
        'it does nothing so we can put anything/nothing here' //Optionnal field, you can leave blank
    ), new Classes.Grabbable( //A special kind of Interaction that consist in grabbing objects and adding them to your inventory
        new Classes.Name('A coin that you can pick.', ['coin', 'money']),
        'You pick up the coin and put it in your bag.',
        //A list of all items you will grab
        [new Classes.Item(//Item declaration
            new Classes.Name('Coin', ['coin']),
            'A rusty coin.',//Name of the item
            //Optionnal, add an effect to the item
        )]
    )]
)
let mapTwo = new Classes.WorldMap( //Declare a second map
    new Classes.Name('Second map', []),
    'Placeholder description of second map, there is a lever on the left, on the right, on the middle and on the back.',
    [new Classes.Direction(
        new Classes.Name('Direction first map', ['South', 'Back']),
        'Text that displays when you go back to the first map.',
        0
    )],
    [new Classes.Activable(
        new Classes.Name('A dubitous lever on the left.', ['left', 'left lever']),
        'You activate the lever.',
        [new Classes.Death(//A special kind of WorldAction that is a death
            'The ground starts to crumble, you fall in a pit to your doom',//Description of the death
            ''//Leaving blank means the death is on the players who initiated the action
        )]
    ), new Classes.Activable(//A special kind of Interaction that is Activable, something you can use and cause WorldActions
        new Classes.Name('A trusty lever on the middle.', ['middle', 'middle lever']),
        'You activate the middle lever.',
        [new Classes.Teleportation(//A special kind of WorldAction, teleports a player somewhere
            'You see a flash of light only to find yourself in some sort of forest.',
            '',//Leave blank for self
            2//Index of the map it leads to
        )]
    ), new Classes.Activable(
        new Classes.Name('A funky lever on the right.', ['right', 'right lever']),
        'You activate the funky lever.',
        [new Classes.Unlock(//A special kind of WorldAction that is unlock, gives a pass to a player
            'You see a ticket poking out of the wall. You decide to take it.',
            'ticket'//Name of the pass the players gains
        )]
    ), new Classes.Activable(
        new Classes.Name('A hidden lever on the back.', ['back', 'back lever']),
        'You activate the hidden lever.',
        [new Classes.Lock(//A special kind of WorldAction that is Lock, an action you can do only with a pass
            'You see a flat hole on the wall lighting up, looks like it\'s asking for something',//What you see when you don't have the pass
            'You put the ticket in the wall, the light turns green.',//What you see when you have the pass
            'ticket',//Name of the pass
            new Classes.Teleportation(
                'The wall opens and you walk in some sort of forest.',
                '',
                2)
        )])]
)

let mapThree = new Classes.WorldMap('The end forest',
'You are in a lively forest, there\'s no signs of the dungeon you just escaped from. Congratulations, you won.')//A map with no interactions or directions

maps.push(mapOne)
maps.push(mapTwo)
maps.push(mapThree)

fs.writeFile(mapsFilePath,JSON.stringify(maps),function(){
  console.log('Wrote maps');
})
