var roleMultiRoomHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.carry.energy == 0) {
            creep.memory.hauling = true;
        }
        else if(creep.carry.energy == creep.carryCapacity){
            creep.memory.hauling = false;
        }

        //Si il doit récupérer de l'énergie
        if(creep.memory.hauling){
            
            //si il n'est pas dans la bonne room
            if (creep.room.name != creep.memory.target){
                let exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }

            // else {
            //     creep.moveTo(Game.getObjectById(creep.memory.sourceId));
            // }

            //si il est dans la bonne room
            else{
                
                let droppedRessources = creep.room.find(FIND_DROPPED_ENERGY);
                let containers = Game.getObjectById(creep.memory.sourceId).pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                });

                if (droppedRessources.length){
                    if(creep.pickup(droppedRessources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(droppedRessources[0]);
                    }
                    else{
                        creep.pickup(droppedRessources[0], RESOURCE_ENERGY);
                    }
                }

                else if (containers.length){
                    if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(containers[0]);
                    }
                    else{
                        creep.withdraw(containers[0], RESOURCE_ENERGY);
                    }
                }
            }
        }
        
        //Si il doit déposer de l'énergie
        else if (!creep.memory.hauling){
            
            //Si il n'est pas dans la bonne room
            if (creep.room.name != creep.memory.origin){
                creep.repairRoadYouTravelOnIfNecessary();
                let exit = creep.room.findExitTo(creep.memory.origin);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }

            //Si il est dans la bonne room
            else{

                let storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => ((i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && _.sum(i.store) < i.storeCapacity)
                });

                if(storageTargets.length){
                    var closestTarget = creep.pos.findClosestByPath(storageTargets);
                    if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.repairRoadYouTravelOnIfNecessary();
                        creep.moveTo(closestTarget);
                    }
                }
            }
        }
    }
};

module.exports = roleMultiRoomHauler;