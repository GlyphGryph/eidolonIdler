// Region
// id: str
// name: str
// description : str or function
// unlockedConditionsMet : function
// size : int
var Region = function(definition){
	this.id = definition.id;
	this.elementId = this.id+'-resource';
	this.name = definition.name;
	this._description = definition.description;
	this.bossId = definition.bossId;
	this.minionId = definition.minionId;
	this.size = definition.size;
	this.unlockedConditionsMet = definition.unlockedConditionsMet;
	this.discoveries = definition.discoveries;
	this.travelTime = 1000;
	this.awareness = 0;
	this.traveling = 0;
}

Region.prototype.toSaveState = function(){
	var thing = {
		id: this.id,
		awareness: this.awareness,
		traveling: this.traveling,
		bossId: this.bossId,
		minionId: this.minionId
	}
	return thing;
}


Region.prototype.travelDescription = function(){
	var txt="<div>Time to Travel to this location: "+this.travelTime/1000+" seconds.</div>";
	if(anyActionsAreBusy()){
		txt+="<div>You or one of your monsters are too busy to travel. Wait until all actions have been completed.</div>";
	}
	return txt;
}

Region.prototype.beginTravel = function(){
	if(!anyActionsAreBusy() && 'standard' == state.mode){
		this.traveling = this.travelTime;
		travelElement = $("#"+this.elementId+" .travel-button");
		travelElement.hide();
		state.monsters.forEach(function(monster){
			monster.actionsAreBusy=true;
		});
		state.character.actionsAreBusy=true;
	}
};


Region.prototype.unlock = function(){
	state.lockedRegions = removeFromArray(state.lockedRegions, this.id);
	state.unlockedRegions.push(this.id);
	this.setup();
	addLog('black', "Region "+this.name+" unlocked.");
}


// Attach handlers when a region is loaded or unlocked
Region.prototype.setup = function(){
	var that = this;
	var regionElement = $("#region-template").clone();
	regionElement.attr('id', this.elementId);
	
	var nameElement = regionElement.find('.name')
	nameElement.text(this.name);
	$("#region-view").append(regionElement);
	regionElement.show();
	nameElement.mouseenter(function(){openDescription(this, that.description)});
	nameElement.mouseleave(closeDescription);
	
	var travelElement = regionElement.find('.travel-button')
	travelElement.mouseenter(function(){openDescription(this, that.travelDescription())});
	travelElement.mouseleave(closeDescription);
	travelElement.click(function(){that.beginTravel()});
	
	var fightBossElement = regionElement.find('.fight-boss');
	fightBossElement.click(function(){Battle.startBossFight()});
	fightBossElement.hide();
	
	regionElement.find('.dangerous').hide();
}

Region.prototype.cancel = function(){
	this.traveling = 0;
	state.monsters.forEach(function(monster){
		monster.actionsAreBusy = false;
	});
	state.character.actionsAreBusy = false;
	regionElement.find('.progress-bar').css('width', '0%');
};

Region.prototype.update = function(){
	regionElement = $("#"+this.elementId);
	var exploredElement = regionElement.find(".explored");
	var exploredPercent = (this.awareness/this.size*100).toFixed(1);
	var exploredText = ""+exploredPercent+"%";
	var travelElement = regionElement.find('.travel-button');
	
	if(100 == exploredPercent && this.bossId != null && this.id==state.currentRegion){
		regionElement.find('.fight-boss').show();
	}else{
		regionElement.find('.fight-boss').hide();
	}
	
	if(this.bossId == null){
		regionElement.find('.dangerous').hide();
	}else{
		regionElement.find('.dangerous').show();
	}
	
	if(exploredElement.text() != exploredText){
		exploredElement.text(""+exploredPercent+"%");
	}
	
	if(anyActionsAreBusy() || 'standard' != state.mode || !state.character.isAlive()){
		travelElement.find('button').prop('disabled', true);
	}else{
		travelElement.find('button').prop('disabled', false);
	}
	
	// Cancel travel if the player becomes diminished
	if(this.traveling >= 1 && !state.character.isAlive()){
		this.cancel();
	}
	
	// If this action is currently running...
	if(this.traveling >= 1 && 'standard' == state.mode){
		this.traveling -= state.timeSinceLastUpdate;
		if(this.traveling >= 1){
			progress = Math.floor(100 - (this.traveling / this.travelTime) * 100)
			regionElement.find('.progress-bar').css('width', ''+progress+'%');
		}
		if(this.traveling < 1){
			this.traveling = 0;
			state.monsters.forEach(function(monster){
				monster.actionsAreBusy = false;
			});
			state.character.actionsAreBusy = false;
			regionElement.find('.progress-bar').css('width', '0%');
			state.currentRegion = this.id;
		}
	}
	
	if(this.traveling > 0){
		regionElement.find('.travel-button').hide();
		regionElement.find('.current-location').hide();
		regionElement.find('.travel-bar').show();
	}else if(this.id==state.currentRegion){
		regionElement.find('.travel-button').hide();
		regionElement.find('.current-location').show();
		regionElement.find('.travel-bar').hide();
	}else{
		regionElement.find('.travel-button').show();
		regionElement.find('.current-location').hide();
		regionElement.find('.travel-bar').hide();
	}
};