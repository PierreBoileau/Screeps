var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //To reallocate a builder to another room
        if(creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
            return;
        }

        if( _.sum(creep.carry) == 0) {
            creep.memory.hauling = true;
        }
        else if( _.sum(creep.carry) == creep.carryCapacity){
            creep.memory.hauling = false;
        }

        //How he gets energy
        if(creep.memory.hauling){
            if(creep.room.find(FIND_DROPPED_RESOURCES).length>0){
                let droppedResource = creep.room.find(FIND_DROPPED_RESOURCES)[0];
                if(creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResource);
                }
                else{
                    creep.pickup(droppedResource);
                }
            }
            else{
                creep.getEnergy(true, true, false, true, false, 2);    
            }            
        }

        //Where he unloads
        else if (!creep.memory.hauling){
            // Find empty spawns or extensions
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity
            });

            if (targets.length == 0){
                // Find empty towers
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 0.75*structure.energyCapacity
                });

                if (targets.length == 0){
                    // Find empty storages
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (i) => (i.structureType == STRUCTURE_STORAGE && _.sum(i.store) < i.storeCapacity)
                    });
                }
            }
            // Unload if one target is found
            if(targets.length > 0) {
                var closestTarget = creep.pos.findClosestByPath(targets);
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget);
                }
            } 
            // Else go in the garage
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