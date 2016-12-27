var utilities = require('utilities');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, miners) {

        if(creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        else if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
        }

        if(creep.memory.harvesting){
            var bestMiner = utilities.sortBestMinerForCreep(miners, creep)[0];
            creep.say(bestMiner.name);
            if( bestMiner.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bestMiner);
            }
        }
        else if (!creep.memory.harvesting){
            var sourceTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            })
            var targets = sourceTargets;
            if(sourceTargets.length == 0) {

                var storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_CONTAINER && _.sum(i.store) < i.storeCapacity)
                });

                targets = sourceTargets.concat(storageTargets);
            }

            if(targets.length > 0) {
                
                var closestTarget = creep.pos.findClosestByPath(targets);
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget);
                }
            } else {
                creep.moveTo(Game.spawns['Spawn1']);
                

            }
        }
    }
};

module.exports = roleHarvester;