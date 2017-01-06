module.exports = function() {

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
		let energyUsed = Math.min(energy, 1000);
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
		let energyUsed = Math.min(energy, 800);
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