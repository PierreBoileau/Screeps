module.exports = function() {

	StructureSpawn.prototype.spawnCreepsIfNecessary = function() {
		
		//DESCRIPTION DE LA ROOM

    let creepsInRoom = this.room.find(FIND_MY_CREEPS);
    let energy = this.room.energyCapacityAvailable;
    let levelController = this.room.controller.level;
    let sources = this.room.find(FIND_SOURCES);
    let numberOfSources = sources.length;
    let storage = this.room.find(FIND_STRUCTURES, {filter: (i) => (i.structureType == STRUCTURE_STORAGE)});
    let numberOfStorage = storage.length;

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
    	if (numberOfHarvesters < 2 * numberOfSources){ var newName = this.createHarvester(energy); }
    	//BUILDERS
    	else if(numberOfBuilders < 2) { var newName = this.createBuilder(energy); } 
    	//LIGHT_UPGRADERS
	  	else if(numberOfLightUpgraders < 2 * numberOfSources + 5){ var newName = this.createLightUpgrader(energy); }
    }

    //comportement zone de niveau égal à 3 et plus
    if (levelController > 2) {        
	    //MINERS
	    var sourceUnusedId = 0;
	    // iterate over all sources
	    for (let source of sources) {
	    	// if the source has no miner
	      if (!_.some(Game.creeps, c => (c.memory.role == 'miner' && c.ticksToLive > 100) && c.memory.sourceId == source.id)) {
	        // check whether or not the source has a container
	        let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER});
	        // if there is a container next to the source
	        if (containers.length > 0) {
	          // create the condition to spawn a new miner
	          sourceUnusedId = source.id;
	          break;
	        }
	      }
	    }
	    if (sourceUnusedId != 0){ var newName = this.createMiner(energy, sourceUnusedId); sourceUnusedId = 0; }
	    //HARVESTERS in case of no Miners
	    else if (numberOfHarvesters + 2 * numberOfMiners < 2 * numberOfSources){ var newName = this.createHarvester(energy); }         
	    //HAULERS
	    else if(numberOfHaulers < numberOfSources) { var newName = this.createHauler(energy); } 
	    //BUILDERS
	    else if(numberOfBuilders < 1) { var newName = this.createBuilder(energy); } 
	    //UPGRADERS réservés aux zones qui disposent d'un STORAGE
	    else if(numberOfUpgraders < 1 && numberOfStorage > 0){ var newName = this.createUpgrader(energy); }   
	    //Sinon LIGHT_UPGRADERS
	    else if(numberOfStorage < 1 && (numberOfLightUpgraders < 2*numberOfSources)){ var newName = this.createLightUpgrader(energy); }
    }

    //comportement en extérieur

    //CLAIMERS
    if(this.memory.claimRoom != undefined){
      var newName = this.createClaimer(this.memory.claimRoom);
      if(!(newName < 0)) {
        delete this.memory.claimRoom;
      }
    } 
    //RESERVERS, LONG_DISTANCE_HARVESTERS
    if(this.memory.longDistanceMineRoom != undefined){
      //For every room, the present spawn deals with
      for (let roomArray of this.memory.longDistanceMineRoom){
        //roomArray is composed of [roomName, sourceId1, sourceId2 ...]
        let roomName = roomArray[0];
        //RESERVER
        if (!_.some(Game.creeps, c => (c.memory.role == 'reserver' && c.ticksToLive > 200) && c.memory.target == roomName)) {
          if(roomName != undefined){
            var newName = this.createReserver(roomName);
          }
        }
        if(roomArray.length > 1){
          for (var i = 0; i < roomArray.length + 1; i++) {
            if(roomArray[i+1] != undefined){
              //if the source has no miner
              if (!_.some(Game.creeps, c => (c.memory.role == 'longDistanceMiner' && c.ticksToLive > 100) && c.memory.sourceId == roomArray[i+1])) {
                var newName = this.createLongDistanceMiner(energy, roomName, roomArray[i+1]);   
              }
 		          // if the source has no multiRoomHauler
              if (!_.some(Game.creeps, c => (c.memory.role == 'multiRoomHauler' && c.ticksToLive > 100) && c.memory.sourceId == roomArray[i+1])) {
                var newName = this.createMultiRoomHauler(energy, roomName, 'W72N21', roomArray[i+1]);
              }
            }
          }
        }
      }
		}
	}	

	StructureSpawn.prototype.createLongDistanceMiner = function(energy, target, sourceId) {
		let body = [];
		//longDistance_Miners are not very mobile but need to get in place in a relatively short term, therefore MOVE are relatively important and will match the number of WORK.
		//On the contrary, they do not need to CARRY anything as they will build a storage
		let energyUsed = Math.min(energy, 800);
		let numberOfWork = Math.floor((energyUsed-50)/150);
		for(let i =0; i < numberOfWork; i++) {
			body.push(WORK); body.push(MOVE);
		}
		body.push(CARRY);
		return this.createCreep(body, undefined, { role : 'longDistanceMiner', target : target, sourceId : sourceId })
	}

	StructureSpawn.prototype.createMultiRoomHauler = function(energy, target, origin, sourceId) {
		let body = [];
		//haulers are focused on transporting energy at max speed, so we basically focus on CARRY and MOVE
		//We will not want more than 10 CARRY parts at the moment, so 10 MOVE as well
		let energyUsed = Math.min(energy, 2000);
		let numberOfCarry = Math.floor(energyUsed/100);
		//We will equal the number of CARRY body parts with MOVE body parts
		for (let i = 0; i < numberOfCarry; i++) {
			body.push(CARRY); body.push(MOVE);
		}
		return this.createCreep(body, undefined, { role : 'multiRoomHauler', target : target, origin : origin, sourceId : sourceId});
	}


	StructureSpawn.prototype.createHauler = function(energy) {
		let body = [];
		//haulers are focused on transporting energy at max speed, so we basically focus on CARRY and MOVE
		//We will not want more than 14 CARRY parts at the moment, so 14 MOVE as well
		let energyUsed = Math.min(energy, 1400);
		let numberOfCarry = Math.floor(energyUsed/100);
		//We will equal the number of CARRY body parts with MOVE body parts
		for (let i = 0; i < numberOfCarry; i++) {
			body.push(CARRY); body.push(MOVE);
		}
		return this.createCreep(body, undefined, { role : 'hauler', target : undefined});
	}

	StructureSpawn.prototype.createBuilder = function(energy) {
		let body = [];
		//builders should be able to move, work and carry equally
		//for safety reasons we will not want builders with more than 6 WORK, 6 CARRY, 6 MOVE
		var energyUsed = Math.min(energy, 1200);
		var numberOfWork = Math.floor(energyUsed/200);
		//We will equal the number of WORK with CARRY and MOVE body parts
		for (let i = 0; i < numberOfWork; i++) {
			body.push(WORK); body.push(CARRY); body.push(MOVE);
		} 
		return this.createCreep(body, undefined, { role : 'builder', target : undefined});
	}

	StructureSpawn.prototype.createUpgrader = function(energy) {
		let body = [];
		let energyUsed = Math.min(energy, 1200);
		let numberOfCarry = Math.floor((energyUsed-50)/250);
		let numberOfWork = Math.floor((energyUsed-50*(1+numberOfCarry))/100);
		for (let i = 0; i < numberOfWork; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < numberOfCarry; i++) {
			body.push(CARRY);
		}
		body.push(MOVE);
		return this.createCreep(body, undefined, { role : 'upgrader', target : undefined});
	}

	StructureSpawn.prototype.createHarvester = function(energy) {
		let body = [];
		//harvesters should be able to move, work and carry equally
		//for safety reasons we will not want builders with more than 6 WORK, 6 CARRY, 6 MOVE
		var energyUsed = Math.min(energy, 1200);
		var numberOfWork = Math.floor(energyUsed/200);
		//We will equal the number of WORK with CARRY and MOVE body parts
		for (let i = 0; i < numberOfWork; i++) {
			body.push(WORK); body.push(CARRY); body.push(MOVE);
		} 
		return this.createCreep(body, undefined, { role : 'harvester', working : false, target: undefined});
	}

	StructureSpawn.prototype.createLightUpgrader = function(energy) {
		let body = [];
		//LightUpgraders should be able to move, work and carry equally
		//for safety reasons we will not want builders with more than 6 WORK, 6 CARRY, 6 MOVE
		var energyUsed = Math.min(energy, 1200);
		var numberOfWork = Math.floor(energyUsed/200);
		//We will equal the number of WORK with CARRY and MOVE body parts
		for (let i = 0; i < numberOfWork; i++) {
			body.push(WORK); body.push(CARRY); body.push(MOVE);
		} 
		return this.createCreep(body, undefined, { role : 'lightUpgrader', working : false, target: undefined});
	}

  StructureSpawn.prototype.createMiner = function (energy, sourceId) {
    var energyUsed = Math.min(energy, 550);
		var numberOfWork = Math.floor((energyUsed-50)/100);
		var body = [];
		//We will stick with one MOVE body part
		for (let i = 0; i < numberOfWork; i++) {
			body.push(WORK);
		}
		body.push(MOVE);
		return this.createCreep(body, undefined, { role : 'miner', sourceId : sourceId});
  }

	StructureSpawn.prototype.createClaimer = function (target) {
		return this.createCreep([CLAIM, MOVE], undefined, {role : 'claimer', target : target});
	}

	StructureSpawn.prototype.createReserver = function (target) {
		return this.createCreep([CLAIM, MOVE], undefined, {role : 'reserver', target : target});
	}

}