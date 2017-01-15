module.exports = function() {

	// create a new function for StructureTower
	StructureTower.prototype.spendEnergy = function () {

	  // find closest hostile creep
	  let enemyTarget = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter : (c) => c.owner.username != 'ANB'});
	 	// if one is found...
	 	if (enemyTarget != undefined) {
	    // ...FIRE!
	    this.attack(enemyTarget);
	  }
	  // if no enemy is found
	  else{
	   	// find closest hurt allied creep
	   	alliedTarget = this.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
	   	// if one is found...
	   	if (alliedTarget != undefined) {
	   		//...HEAL!
	   		this.heal(alliedTarget);
	   	}
	   	// if no available target for either attack or heal is found
	   	else if (this.energy > 1/4*this.energyCapacity) { 
	   		// find closest structure to repair
	   		repairTarget = this.room.find(FIND_STRUCTURES, {filter: s => s.hits < Math.min(75000, s.hitsMax)});
	   		// if one is found...
	   		if (repairTarget.length) {
	   			//...REPAIR!
	   			function compare(s,t){
	   				let sHitsMax;
	   				let tHitsMax;
	   				if(s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART ){ sHitsMax = 75000;}
	   				else{ sHitsMax = s.hitsMax;}
	   				if(t.structureType == STRUCTURE_WALL || t.structureType == STRUCTURE_RAMPART ){ tHitsMax = 75000;}
	   				else{ tHitsMax = t.hitsMax;}
	   				if ( s.hits/sHitsMax < t.hits/tHitsMax) {return -1;}
	   				else if ( s.hits/sHitsMax == t.hits/tHitsMax ) {return 0;}
	   				else { return 1; }
	   			}
	   			let repairTargetSorted = repairTarget.sort(compare);
	   			this.repair(repairTargetSorted[0]);
	   		}
	   	}
	  }
	}
}