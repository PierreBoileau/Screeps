var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.carry.energy == 0) {
            creep.memory.hauling = true;
        }
        else if(creep.carry.energy == creep.carryCapacity){
            creep.memory.hauling = false;
        }

        //How he gets energy
        if(creep.memory.hauling){
            creep.getEnergy(true, false, false);
        }

        //Where he unloads
        else if (!creep.memory.hauling){
            var sourceTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
            })
            var targets = sourceTargets;
            if(sourceTargets.length == 0) {

                var storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_STORAGE && _.sum(i.store) < i.storeCapacity)
                });

                targets = sourceTargets.concat(storageTargets);
            }

            if(targets.length > 0) {
                
                var closestTarget = creep.pos.findClosestByPath(targets);
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget);
                }
            } 
            else {
                let spawn = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => (structure.structureType == STRUCTURE_SPAWN)
                });
                creep.moveTo(spawn);
                

            }
        }
    }
};

module.exports = roleHauler;