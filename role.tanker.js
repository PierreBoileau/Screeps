var roleTanker = {

    // The goal of the soldier is to get in a target room and attack the closest target!

    run : function(creep){

        // go to the room"

        if (creep.room.name != creep.memory.target){
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }

        // when in the room

        else {

            if(creep.memory.action <3){
                creep.move(DOWN);
                creep.memory.action = creep.memory.action +1;
            }         
        }
    }
};

module.exports = roleTanker; 