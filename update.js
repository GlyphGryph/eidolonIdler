// The main game loop
var update = function(timestamp){
	if(state.currentTime){
		state.lastTime = state.currentTime;
	}else{
		state.lastTime = timestamp;
	}
	state.currentTime = timestamp;
	state.timeSinceLastUpdate = state.currentTime - state.lastTime;
	updateActionFamilies();
	updateResources();
	updateStats();
	updateAbilities();
	updateProgress();
	updateLog();
	
	window.requestAnimationFrame(update);
}

var updateAction = function(id){
	var action = actions[id];
	var actionElement = $("#"+action.id);
	var family = actionFamilies[action.family];
	if(action.visible){
		actionElement.show();
	}else{
		actionElement.hide();
	}
	if(true==action.shouldStart){
		action.start();
		action.running = action.runTime;
		action.shouldStart=false;
		actionElement.find('button').hide();
	}
	if(family.busy){
		actionElement.find('button').prop('disabled', true);
	}else{
		actionElement.find('button').prop('disabled', false);
	}
	
	// Return early if the action does not need to be run
	if(action.running < 1){ return; }
	action.running -= state.timeSinceLastUpdate;
	if(action.running >= 1){
		progress = Math.floor(100 - (action.running / action.runTime) * 100)
		actionElement.find('.progress-bar').css('width', ''+progress+'%');
	}
	if(action.running < 1){
		action.running = 0;
		var family = actionFamilies[action.family];
		family.busy = false;
		actionElement.find('.progress-bar').css('width', '0%');
		actionElement.find('button').show();
		action.finish();
	}
};

var updateActionFamilies = function(){
	$.each(actionFamilies, function(key, actionFamily){
		if(actionFamily.visible){
			$("#"+actionFamily.id).show();
		}else{
			$("#"+actionFamily.id).hide();
		}
		actionFamily.actions.forEach(updateAction);
	});
};

var updateResources = function(){
	$.each(resources, function(key, resource){
		if(resource.visible){
			var resourceElement = $("#"+resource.id)
			resourceElement.show();
			resourceElement.html(resource.name +": "+resource.value);
		} else {
			$("#"+resource.id).hide()
		}
	})
};

var updateLog = function(){
	var logElement = $('#log-text');
	logElement.html("");
	[...log].reverse().forEach(function(message){
		messageElement = $("<p>"+message[1]+"</p>");
		messageElement.css('color', message[0]);
		logElement.append(messageElement);
	});
};

var updateStat = function(stat){
	var statElement = $("#"+stat.elementId);
	var levelElement = statElement.find('.level');
	var maxLevelElement = statElement.find('.max-level');
	if(levelElement.html()!=stat.level.toString){
		levelElement.html(stat.level);
	}
	if(maxLevelElement.html()!=stat.maxLevel.toString){
		maxLevelElement.html(stat.maxLevel);
	}
	if(stat.level==stat.maxLevel || !canStatBeUpgraded(stat)){
		statElement.find('.upgrade-button button').prop('disabled', true);
	} else {
		statElement.find('.upgrade-button button').prop('disabled', false);	
	}
}

var updateStats = function(){
	monster.lockedStats.forEach(function(id){
		var stat = monster.stats[id];
		if(stat.unlockedConditionsMet()){
			unlockStat(stat);
		}
	});
	monster.unlockedStats.forEach(function(id){
		var stat = monster.stats[id];
		updateStat(stat);
	});
}

var updateAbility = function(ability){
	var abilityElement = $("#"+ability.elementId);
	var levelElement = abilityElement.find('.level');
	var maxLevelElement = abilityElement.find('.max-level');
	var upgrade = ability.upgrade
	var upgradeElement = $("#"+upgrade.elementId);
	
	if(levelElement.html()!=ability.level.toString){
		levelElement.html(ability.level);
	}
	
	if(maxLevelElement.html()!=ability.maxLevel.toString){
		maxLevelElement.html(ability.maxLevel);
	}
	
	if(monster.abilitiesAreTraining){
		upgradeElement.find('button').prop('disabled', true);
	} else {
		upgradeElement.find('button').prop('disabled', false);	
	}
	
	if(ability.canBeTrained()){
		upgradeElement.show();
	} else {
		upgradeElement.hide();	
	}
	
	if(true==ability.upgrade.shouldStart){
		upgrade.start();
		upgrade.running = upgrade.runTime;
		upgrade.shouldStart=false;
		upgradeElement.find('button').hide();
	}
	if(monster.abilitiesAreTraining){
		upgradeElement.find('button').prop('disabled', true);
	}else{
		upgradeElement.find('button').prop('disabled', false);
	}
	
	// Return early if the ability is not being trained
	if(upgrade.running < 1){ return; }
	upgrade.running -= state.timeSinceLastUpdate;
	if(upgrade.running >= 1){
		progress = Math.floor(100 - (upgrade.running / upgrade.runTime) * 100)
		upgradeElement.find('.progress-bar').css('width', ''+progress+'%');
	}
	if(upgrade.running < 1){
		upgrade.running = 0;
		ability.level += 1;
		monster.abilitiesAreTraining = false
		upgradeElement.find('.progress-bar').css('width', '0%');
		upgradeElement.find('button').show();
		upgrade.finish();
	}
}

var updateAbilities = function(){
	monster.lockedAbilities.forEach(function(id){
		var ability = monster.abilities[id];
		if(ability.unlockedConditionsMet()){
			unlockAbility(ability);
		}
	});
	monster.unlockedAbilities.forEach(function(id){
		var ability = monster.abilities[id];
		updateAbility(ability);
	});
}

var updateProgress = function(){
	// Unlock tabs at 4 spirit
	if(!gameProgress.tabsAreUnlocked){
		if(resources.monsterSpirit.value > 3){
			gameProgress.tabsAreUnlocked=true;
			$("#view-select-menu").show();
			addLog('green', "The monster has grown in strength and may improve his skills.")
		}
	}
	if(!monster.abilitiesAreUnlocked){
		if(monster.unlockedAbilities.length > 0){
			monster.abilitiesAreUnlocked=true;
			$("#abilities").show();
		}
	}
}