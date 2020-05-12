removeFromArray = function(array, value){
	return array.filter(function(elem){ return elem != value; }); 
};

var selectView = function(id){
	if('action'==id){
		$('#monster-view').hide();
		$('#action-view').show();
		$('#action-view-tab').addClass('selected');
		$('#monster-view-tab').removeClass('selected');
	}else if('monster'==id){
		$('#action-view').hide();
		$('#monster-view').show();
		$('#monster-view-tab').addClass('selected');
		$('#action-view-tab').removeClass('selected');
	}
}

var addLog = function(color, message){
	log.push([color, message]);
};

var totalLevels = function(){
	var total = 0;
	$.each(monster.stats, function(key, monsterStat){
		total += monsterStat.level;
	});
	return total;
}

var upgradeMultiplier = function(){
	return totalLevels();
}

var changeResource = function(id, value){
	var resource = resources[id];
	resource.value += value;
	resource.visible = true;
	addLog('black', "Gained "+value+" "+resource.name+".");
};

var unlockStat = function(stat){
	monster.lockedStats = removeFromArray(monster.lockedStats, stat.id);
	monster.unlockedStats.push(stat.id);
	setupStat(stat);
	addLog('black', "Stat "+stat.name+" unlocked.");
}

var unlockAbility = function(ability){
	monster.lockedAbilities = removeFromArray(monster.lockedAbilities, ability.id);
	monster.unlockedAbilities.push(ability.id);
	setupAbility(ability);
	addLog('black', "Ability "+ability.name+" unlocked.");
}

var prepareAbilityToTrain = function(ability){
	if(!monster.abilitiesAreTraining && ability.canBeTrained()){
		ability.upgrade.shouldStart=true;
		monster.abilitiesAreTraining=true;
	}
}

var prepareActionToStart = function(action){
	var actionFamily = actionFamilies[action.family];
	if(!actionFamily.busy){
		action.shouldStart=true;
		actionFamily.busy=true;
	}
}

var openDescription = function(elem, describer){
	var describerElement = jQuery(elem);
	var descriptionElement = $("#description")
	var description;
	if('function' == typeof describer.description){
		description = describer.description();
	}else{
		description = describer.description;
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

var canStatBeUpgraded = function(stat){
	return (
		stat.level < stat.maxLevel &&
		resources.monsterSpirit.value >= stat.upgrade.spiritCost() &&
		resources[stat.upgrade.specialCostType].value >= stat.upgrade.specialCost()
	);
}

var upgradeStat = function(stat){
	if(canStatBeUpgraded(stat)){
		var specialResource = resources[stat.upgrade.specialCostType]
		resources.monsterSpirit.value -= stat.upgrade.spiritCost();
		specialResource.value -= stat.upgrade.specialCost();
		stat.level += 1;
		addLog('black', "Spent "+stat.upgrade.spiritCost()+" Spirit and "+stat.upgrade.specialCost()+" "+specialResource.name);
	}
	openDescription($("#"+stat.upgrade.elementId),stat.upgrade);
}



var startScript = function(){
	setup();
};

$(document).ready(startScript);
  