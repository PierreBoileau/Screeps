module.exports = function() {

	// create a new function for StructureTower
	StructureLink.prototype.run = function () {

		// Determine your role as a link
		if (this.memory.role == undefined) {
			// Si le link est central / proche d'un storage
			if(this.pos.findInRange(FIND_STRUCTURES, 2, {filter : (s) => s.structureType == STRUCTURE_STORAGE}).length>0){
				// alors le link recevra et transférera
				this.memory.role = 'switch';
			}
			// Si le link sert de base pour les upgraders
			else if(this.pos.findInRange(FIND_STRUCTURES, 5, {filter : (s) => s.structureType == STRUCTURE_CONTROLLER}).length>0){
				// alors le link ne fera que recevoir
				this.memory.role = 'recever';
			}
			else{
				this.memory.role = 'sender';
			}
		} 

		else{
			//What do you do as a sender
			if (this.memory.role == 'sender'){
				if (this.energy == this.energyCapacity){
					let linkAvailable = this.room.find(FIND_MY_STRUCTURES, { filter : (l) => l.structureType = STRUCTURE_LINK && (l.memory.role == 'recever' || l.memory.role == 'switch') && l.energy == 0});
					if (linkAvailable.length){
						this.transferEnergy(linkAvailable[0]);
					}
				}
			}

			//What to do as a switch
			if (this.memory.role == 'switch'){
				if (this.energy > 0.95*this.energyCapacity){
					let linkAvailable = this.room.find(FIND_MY_STRUCTURES, { filter : (l) => l.structureType = STRUCTURE_LINK && l.memory.role == 'switch' && l.energy == 0});
					if (linkAvailable.length){
						this.transferEnergy(linkAvailable[0]);
					}
				}
			}
		}
	}
}