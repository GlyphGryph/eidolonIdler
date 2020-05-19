var state = {}

var State = function(saveState){
	var that = this;
	this.currentTime = saveState.currentTime || null;
	this.lastTime = saveState.lastTime || null;
	this.timeSinceLastUpdate = saveState.timeSinceLastUpdate || null;
	this.selectedTab = saveState.selectedTab || 'action';
	
	// Simple Trackers
	this.log = saveState.log || [];
	this.unlockedResources = saveState.unlockedResources || [];
	this.currentRegion = saveState.currentRegion || null;
	this.unlockedRegions = saveState.unlockedRegions || [];
	this.lockedRegions = saveState.lockedRegions || [];
	
	// Game Progress
	this.tabsAreUnlocked = saveState.tabsAreUnlockedfalse;
	this.orphanIsUnlocked = saveState.orphanIsUnlockedfalse;
	this.regionsAreUnlocked = saveState.regionsAreUnlockedfalse;
	
	
	// Complex Trackers
	this.monsters = [];
	saveState.monsters.forEach(function(monsterState){
		that.monsters.push(new Monster(monsterState));
	});
	
	this.regions = [];
	regionDefinitions.forEach(function(definition){
		that.regions[definition.id] = new Region(definition);
	});
	if(saveState.regions){
		saveState.regions.forEach(function(regionState){
			regions[regionState.id].awareness = regionState.awareness;
			regions[regionState.id].traveling = regionState.traveling;
		});
	}

	this.resources = [];
	resourceDefinitions.forEach(function(definition){
		that.resources[definition.id] = new Resource(definition.id, definition.name);
	});
	if(saveState.resources){
		saveState.resources.forEach(function(resourceState){
			resources[resourceState.id].value = resourceState.value;
		});
	}
	
	this.character = new Character(saveState.character)
};

State.prototype.toSaveState = function(){
	thing = {
		currentTime: this.currentTime,
		lastTime: this.lastTime,
		timeSinceLastUpdate: this.timeSinceLastUpdate,
		selectedTab: this.selectedTab,
		log: this.log,
		unlockedResources: this.unlockedResources,
		currentRegion: this.currentRegion,
		unlockedRegions: this.unlockedRegions,
		lockedRegions: this.lockedRegions,
		tabsAreUnlocked: this.tabsAreUnlocked,
		orphanIsUnlocked: this.orphanIsUnlocked,
		regionsAreUnlocked: this.regionsAreUnlocked,
	}
	thing.monsters = [];
	this.monsters.forEach(function(monster){
		thing.monsters.push(monster.toSaveState());
	});
	thing.regions = [];
	this.regions.forEach(function(region){
		thing.regions.push(region.toSaveState());
	});
	thing.character = state.character.toSaveState();
	return thing;
}


var newGameState = function(){
	var lockedRegions = []
	regionDefinitions.forEach(function(regionDefinition){
		lockedRegions.push(regionDefinition.id);
	});
	var currentRegion = "blackenedWasteland";
	
		// Create all monsters
	var monsters = [{
		id: 'monster-1',
		name: "Monster One",
		lockedAbilities: [
			'sharedHealing',
			'fakeAbility',
			'assist'
		]
	}]
	
	var character = {
		name: "Wayward Orphan"
	}
	
	
	return new State({
		lockedRegions: lockedRegions,
		currentRegion: currentRegion,
		monsters: monsters,
		character: character
	});
}