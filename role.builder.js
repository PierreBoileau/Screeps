var utilities = require('utilities');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, miners) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.buildingTargetId = 'None';

        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            if (creep.memory.buildingTargetId = 'None') {
                var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

                var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.hits < structure.hitsMax &&
                        ((structure.structureType == STRUCTURE_WALL && structure.hits < 50000) ||
                        (structure.structureType != STRUCTURE_WALL)));
                    }
                })
                targets = constructionSites.concat(damagedStructures);

                if(targets.length) {
                    var closestTarget = creep.pos.findClosestByPath(targets);
                    if (closestTarget != null) {creep.memory.buildingTargetId = closestTarget.id;}
                } else {
                    creep.memory.buildingTargetId = 'None';
                }
            }

            if(creep.memory.buildingTargetId != 'None') {
                var target = Game.getObjectById(creep.memory.buildingTargetId);

                var error = creep.build(target);

                if(error == ERR_INVALID_TARGET) {
                    error = creep.repair(target);
                }
                if(error == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
        else {
            var bestMiner = utilities.sortBestMinerForCreep(miners, creep)[0];
            if( bestMiner.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bestMiner);
            }
        }
    }
};

module.exports = roleBuilder;