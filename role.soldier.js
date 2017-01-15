var roleSoldier = {

    // The goal of the soldier is to get in a target room and attack the closest target!

    run : function(creep){

        // go to the room"

        if (creep.room.name != creep.memory.target){
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }

        // when in the room

        else {

            // let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter : (s) => s.structureType == STRUCTURE_TOWER });
            let target = creep.pos.findClosestByRange([creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter : (s) => s.structureType != STRUCTURE_CONTROLLER}), creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS), {filter : (c) => c.owner.username != 'ANB'}]);

            
            if(target != null) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else{
                    creep.attack(target);
                }
            }

            else{
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES);
                if(target != null) {
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    else{
                        creep.attack(target);
                    }
                }
            }
        }
    }
};

module.exports = roleSoldier; 