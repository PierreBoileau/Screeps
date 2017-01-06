require('prototype.spawn')();
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleClaimer = require('role.claimer');
var roleHarvester = require('role.harvester');
var roleLightUpgrader = require('role.lightUpgrader');
var roleLongDistanceMiner = require('role.longDistanceMiner');
var roleReserver = require('role.reserver');
var roleMultiRoomHauler = require('role.multiRoomHauler');

module.exports.loop = function () {

    // Garbage collector
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Gestion des actions des Creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        } else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        } else if(creep.memory.role == 'longDistanceMiner') {
            roleLongDistanceMiner.run(creep);
        } else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'lightUpgrader'){
            roleLightUpgrader.run(creep);
        } else if(creep.memory.role == 'reserver'){
            roleReserver.run(creep);
        } else if(creep.memory.role == 'multiRoomHauler'){
            roleMultiRoomHauler.run(creep);
        }
    }

    // Gestion du SPAWN des différents CREEPS selon les SPAWN


    for (let spawnName in Game.spawns) {
        
        //DESCRIPTION du SPAWN et de la ROOM

        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
        let room = spawn.room;
        let energy = spawn.room.energyCapacityAvailable;
        let levelController = spawn.room.controller.level;
        let sources = spawn.room.find(FIND_SOURCES);
        let numberOfSources = sources.length;
        let storage = spawn.room.find(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_STORAGE)
                });
        let numberOfStorage = storage.length;

        // GESTION DES TOURS
        var towers = room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        for (let tower of towers){
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
        }



        //DESCRIPTION DES CREEPS

        var numberOfHaulers = _.sum(creepsInRoom, (c) => (c.memory.role == 'hauler' && c.ticksToLive > 150));
        var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
        var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
        var numberOfMiners = _.sum(creepsInRoom, (c) => (c.memory.role == 'miner'));
        var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
        var numberOfLightUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'lightUpgrader');

        //comportement en intérieur

        //comportement zone de niveau inférieur à 3

        if (levelController < 3){

            //HARVESTERS
            if (numberOfHarvesters < 2 * numberOfSources){
                var newName = spawn.createHarvester(energy);
            }

            else if(numberOfBuilders < 2) {
                var newName = spawn.createBuilder(energy);
            } 

            //UPGRADERS réservés aux zones qui disposent d'un STORAGE
            else if(numberOfUpgraders < 1 && numberOfStorage > 0){
                //UPGRADERS réservés aux zones qui disposent d'un STORAGE
                var newName = spawn.createUpgrader(energy);
            }    
            else if(numberOfLightUpgraders < 2 * numberOfSources + 5){
                var newName = spawn.createLightUpgrader(energy);
            }
        }

        //comportement zone de niveau égal à 3 et plus
        //MINERS and HAULERS réservés aux zones de niveau 3 et supérieurs

        if (levelController > 2) {
            
            //MINERS

            var sourceUnusedId = 0;
            // iterate over all sources
            for (let source of sources) {
            // if the source has no miner
                if (!_.some(Game.creeps, c => (c.memory.role == 'miner' && c.ticksToLive > 100) && c.memory.sourceId == source.id)) {
                    // check whether or not the source has a container
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    // if there is a container next to the source
                    if (containers.length > 0) {
                        // create the condition to spawn a new miner
                        sourceUnusedId = source.id;
                        break;
                    }
                }
            }

            if (sourceUnusedId != 0){
                var newName = spawn.createMiner(energy, sourceUnusedId);
                sourceUnusedId = 0;
            }

            //Harvesters in case of no Miners

            else if (numberOfHarvesters + 2 * numberOfMiners < 2 * numberOfSources){
                var newName = spawn.createHarvester(energy);
            }
            
            //HAULERS

            else if(numberOfHaulers < numberOfSources) {
            var newName = spawn.createHauler(energy);
            } 

            //BUILDERS & REPAIRERS

            else if(numberOfBuilders < 2) {
                var newName = spawn.createBuilder(energy);
            } 

            //UPGRADERS

            else if(numberOfUpgraders < 1 && numberOfStorage > 0){
                //UPGRADERS réservés aux zones qui disposent d'un STORAGE
                var newName = spawn.createUpgrader(energy);
            }    
            else if(numberOfStorage < 1 && (numberOfLightUpgraders < 2*numberOfSources)){
                var newName = spawn.createLightUpgrader(energy);
            }
        }

        //comportement en extérieur

        //CLAIMERS

        if(spawn.memory.claimRoom != undefined){
            var newName = spawn.createClaimer(spawn.memory.claimRoom);
            if(!(newName < 0)) {
                delete spawn.memory.claimRoom;
            }
        } 

        //RESERVERS, LONG_DISTANCE_HARVESTERS

        if(spawn.memory.longDistanceMineRoom != undefined){
            //For every room, the present spawn deals with
            for (let roomArray of spawn.memory.longDistanceMineRoom){
                //roomArray is composed of [roomName, sourceId1, sourceId2 ...]
                let roomName = roomArray[0];

                //if the controller has no reserver
                if (!_.some(Game.creeps, c => (c.memory.role == 'reserver' && c.ticksToLive > 200) && c.memory.target == roomName)) {
                    if(roomName != undefined){
                        var newName = spawn.createReserver(roomName);
                    }
                }
                
                if(roomArray.length > 1){
                    for (var i = 0; i < roomArray.length + 1; i++) {
                        if(roomArray[i+1] != undefined){
                            //if the source has no miner
                            if (!_.some(Game.creeps, c => (c.memory.role == 'longDistanceMiner' && c.ticksToLive > 100) && c.memory.sourceId == roomArray[i+1])) {
                                var newName = spawn.createLongDistanceMiner(energy, roomName, roomArray[i+1]);   
                            }
                            // if the source has no multiRoomHauler
                            if (!_.some(Game.creeps, c => (c.memory.role == 'multiRoomHauler' && c.ticksToLive > 100) && c.memory.sourceId == roomArray[i+1])) {
                                var newName = spawn.createMultiRoomHauler(energy, roomName, 'W72N21', roomArray[i+1]);
                            }
                        }
                    }
                }
            }
        }
    }
}