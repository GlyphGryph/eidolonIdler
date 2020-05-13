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

var totalLevels = function(){
	var total = 0;
	$.each(monster.stats, function(key, monsterStat){
		total += monsterStat.level;
	});
	return total;
}

var upgradeMultiplier = function(){
	// We don't count the first three levels into the multiplier
	var levels = totalLevels()-3;
	if( levels < 0){
		return 0
	}else{
		return levels;
	}
}

var gainSpirit = function(value){
	if(monster.abilities.sharedHealing.active && character.diminished > 0){
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
	changeResource('monsterSpirit', value);
}

var changeResource = function(id, value){
	var resource = resources[id];
	resource.value += value;
	resource.visible = true;
	addLog('black', "Gained "+value+" "+resource.name+".");
};

var unlockAction = function(context, action){
	context.lockedActions = removeFromArray(context.lockedActions, action.id);
	context.unlockedActions.push(action.id);
	setupAction(context, action);
	addLog('black', "Action "+action.name+" unlocked.");
}

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

var activateAbility = function(ability){
	if(monster.activeAbilities.length < monster.maxActiveAbilities()){
		monster.activeAbilities.push(ability.id);
		ability.active = true;
	}
}

var deactivateAbility = function(ability){
	monster.activeAbilities = removeFromArray(monster.activeAbilities, ability.id);
	ability.active = false;
}

var prepareActionToStart = function(context, action){
	if(!context.actionsAreBusy){
		action.shouldStart=true;
		context.actionsAreBusy=true;
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
  