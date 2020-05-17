removeFromArray = function(array, value){
	return array.filter(function(elem){ return elem != value; }); 
};

var selectView = function(id){
	$(".view").hide();
	$('#'+id+'-view').show();
	$('.tab').removeClass('selected');
	$('#'+id+'-view-tab').addClass('selected');
}

var addLog = function(color, message){
	log.push([color, message]);
};



var gainSpirit = function(value){
	if(abilities.sharedHealing.isActive(monster) && character.diminished > 0){
		var amountToSiphon = monster.stats.power.level;
		if(amountToSiphon > value){
			amountToSiphon = value;
		}
		if(amountToSiphon > character.diminished){
			amountToSiphon = character.diminished;
		}
		character.diminished -= amountToSiphon;
		addLog('red', "Orphan healed "+amountToSiphon+" points of damage.");
		if(character.diminished <= 0){
			addLog('red', "Orphan fully healed.");
		}
		value = value - amountToSiphon;
	}
	resources.spirit.change(value);
}

var exploreRegion = function(){
	var region = regions[currentRegion]
	if(region.awareness < region.size){
		region.awareness+=1;
		if(region.awareness in region.discoveries){
			region.discoveries[region.awareness]();
		}
	}
}

var unlockRegion = function(region){
	lockedRegions = removeFromArray(lockedRegions, region.id);
	unlockedRegions.push(region.id);
	setupRegion(region);
	addLog('black', "Region "+region.name+" unlocked.");
}

var unlockStat = function(stat){
	monster.lockedStats = removeFromArray(monster.lockedStats, stat.id);
	monster.unlockedStats.push(stat.id);
	setupStat(stat);
	addLog('black', "Stat "+stat.name+" unlocked.");
}

var prepareTravelToStart = function(region){
	if(!monster.actionsAreBusy && !character.actionsAreBusy){
		region.travel.shouldStart=true;
		monster.actionsAreBusy=true;
		character.actionsAreBusy=true;
	}
}

var openDescription = function(elem, description){
	var describerElement = jQuery(elem);
	var descriptionElement = $("#description")
	if('function' == typeof description){
		description = description();
	}
	var gutter = 15;
	var raise = 15;
	leftPosition = describerElement.position().left + describerElement.width() + gutter;
	topPosition = describerElement.position().top - raise;
	descriptionElement.html(description)
	descriptionElement.css('left', ""+leftPosition+"px").css('top', ""+topPosition+"px");
	descriptionElement.show();
}

var closeDescription = function(){
	$("#description").html("").hide();
}

var canMeetCost = function(costArray){
	// TODO : For ability training and actions
}

var payCost = function(costArray){
	// TODO: For ability training and actions
}

var startScript = function(){
	setup();
};

$(document).ready(startScript);
  