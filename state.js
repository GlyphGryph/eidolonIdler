var state = {}

var State = function(saveState){
	var that = this;
	this.currentTime = (saveState.currentTime !== undefined) ? saveState.currentTime : null;
	this.lastTime = (saveState.lastTime !== undefined) ? saveState.lastTime : null;
	this.timeSinceLastUpdate = (saveState.timeSinceLastUpdate !== undefined) ? saveState.timeSinceLastUpdate : null;
	this.selectedTab = (saveState.selectedTab !== undefined) ? saveState.selectedTab : 'action';
	this.mode = eqOr(saveState.mode, 'standard'); // Valid: 'standard', 'battle' 
	
	// Simple Trackers
	this.log = (saveState.log !== undefined) ? saveState.log : [];
	this.unlockedResources = (saveState.unlockedResources !== undefined) ? saveState.unlockedResources : [];
	this.currentRegion = (saveState.currentRegion !== undefined) ? saveState.currentRegion : null;
	this.unlockedRegions = (saveState.unlockedRegions !== undefined) ? saveState.unlockedRegions : [];
	this.lockedRegions = (saveState.lockedRegions !== undefined) ? saveState.lockedRegions : [];
	
	// Game Progress
	this.tabsAreUnlocked = (saveState.tabsAreUnlocked !== undefined) ? saveState.tabsAreUnlocked : false;
	this.orphanIsUnlocked = (saveState.orphanIsUnlocked !== undefined) ? saveState.orphanIsUnlocked : false;
	this.regionsAreUnlocked = (saveState.regionsAreUnlocked !== undefined) ? saveState.regionsAreUnlocked : false;
	
	// Complex Trackers
	
	this.monsters = [];
	saveState.monsters.forEach(function(monsterState){
		that.monsters.push(new Monster(monsterState));
	});
	
	this.regions = {};
	regionDefinitions.forEach(function(definition){
		that.regions[definition.id] = new Region(definition);
	});
	if(saveState.regions){
		saveState.regions.forEach(function(regionState){
			that.regions[regionState.id].awareness = regionState.awareness;
			that.regions[regionState.id].traveling = regionState.traveling;
		});
	}

	this.resources = {};
	resourceDefinitions.forEach(function(definition){
		that.resources[definition.id] = new Resource(definition.id, definition.name);
	});
	if(saveState.resources){
		saveState.resources.forEach(function(resourceState){
			that.resources[resourceState.id].value = resourceState.value;
		});
	}
	
	this.character = new Character(saveState.character);
	
	
	if('battle' == this.mode){
		this.battle = new Battle(saveState.battle);
	}else{
		this.battle = null;
	}
};

State.prototype.toSaveState = function(){
	var that = this;
	thing = {
		currentTime: this.currentTime,
		lastTime: this.lastTime,
		timeSinceLastUpdate: this.timeSinceLastUpdate,
		selectedTab: this.selectedTab,
		mode: this.mode,
		log: this.log,
		unlockedResources: this.unlockedResources,
		currentRegion: this.currentRegion,
		unlockedRegions: this.unlockedRegions,
		lockedRegions: this.lockedRegions,
		tabsAreUnlocked: this.tabsAreUnlocked,
		orphanIsUnlocked: this.orphanIsUnlocked,
		regionsAreUnlocked: this.regionsAreUnlocked
	}
	if('battle' == this.mode){
		thing.battle = this.battle.toSaveState();
	}
	
	thing.monsters = [];
	this.monsters.forEach(function(monster){
		thing.monsters.push(monster.toSaveState());
	});
	
	thing.regions = [];
	regionDefinitions.forEach(function(definition){
		region = that.regions[definition.id];
		thing.regions.push(region.toSaveState());
	});
	
	thing.resources = [];
	resourceDefinitions.forEach(function(resource){
		thing.resources.push({id: resource.id, value: that.resources[resource.id].value}); 
	});
	
	thing.character = state.character.toSaveState();
	return thing;
}

State.prototype.getTeammate = function(id){
	if('character' == id){
		return this.character;
	}else{
		return this.monsters.find(function(monster){ return monster.id == id });
	}
}

State.prototype.addTeammate = function(templateId){
	var monster = {};
	monster.id = 'monster-' + (this.monsters.length+1);
	monster.name = "Captured Monster";
	monster.primaryTemplateId = templateId;
	monster = new Monster(monster);
	this.monsters.push(monster);
	monster.setup();
}


var newGameState = function(){
	var lockedRegions = []
	regionDefinitions.forEach(function(regionDefinition){
		lockedRegions.push(regionDefinition.id);
	});
	var currentRegion = "blackenedWasteland";
	
		// Create all monsters
	var monsters = [
		{
			id: 'monster-1',
			name: "Monster One",
			primaryTemplateId: 'genericMonster'
		},
		{
			id: 'monster-2',
			name: "Monster Two",
			primaryTemplateId: 'genericMonster'
		}, 
	]
	
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