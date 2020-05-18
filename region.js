// Region
// id: str
// name: str
// description : str or function
// unlockedConditionsMet : function
// size : int
var Region = function(definition, awareness, traveling){
	this.id = definition.id;
	this.elementId = this.id+'-resource';
	this.name = definition.name;
	this._description = definition.description;
	this.size = definition.size;
	this.unlockedConditionsMet = definition.unlockedConditionsMet;
	this.discoveries = definition.discoveries;
	this.travelTime = 1000;
	this.travelDescription = definition.travelDescription;
	
	this.awareness = awareness;
	this.traveling = traveling;
}

Region.prototype.beginTravel = function(){
	if(!anyActionsAreBusy()){
		this.traveling = this.travelTime;
		travelElement = $("#"+this.elementId+" .travel-button");
		travelElement.hide();
		monsters.forEach(function(monster){
			monster.actionsAreBusy=true;
		});
		character.actionsAreBusy=true;
	}
};


Region.prototype.unlock = function(){
	lockedRegions = removeFromArray(lockedRegions, this.id);
	unlockedRegions.push(this.id);
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
}

Region.prototype.update = function(){
	regionElement = $("#"+this.elementId);
	var exploredElement = regionElement.find(".explored");
	var exploredPercent = (this.awareness/this.size*100).toFixed(1);
	var exploredText = ""+exploredPercent+"%";
	var travelElement = regionElement.find('.travel-button');
	
	if(exploredElement.text() != exploredText){
		exploredElement.text(""+exploredPercent+"%");
	}
	
	if(anyActionsAreBusy()){
		travelElement.find('button').prop('disabled', true);
	}else{
		travelElement.find('button').prop('disabled', false);
	}
	
	// If this action is currently running...
	if(this.traveling >= 1){
		this.traveling -= state.timeSinceLastUpdate;
		if(this.traveling >= 1){
			progress = Math.floor(100 - (this.traveling / this.travelTime) * 100)
			regionElement.find('.progress-bar').css('width', ''+progress+'%');
		}
		if(this.traveling < 1){
			this.traveling = 0;
			monsters.forEach(function(monster){
				monster.actionsAreBusy = false;
			});
			character.actionsAreBusy = false;
			regionElement.find('.progress-bar').css('width', '0%');
			currentRegion = this.id;
		}
	}
	
	if(this.traveling > 0){
		regionElement.find('.travel-button').hide();
		regionElement.find('.current-location').hide();
		regionElement.find('.travel-bar').show();
	}else if(this.id==currentRegion){
		regionElement.find('.travel-button').hide();
		regionElement.find('.current-location').show();
		regionElement.find('.travel-bar').hide();
	}else{
		regionElement.find('.travel-button').show();
		regionElement.find('.current-location').hide();
		regionElement.find('.travel-bar').hide();
	}
};