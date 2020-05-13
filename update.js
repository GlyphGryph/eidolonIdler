// The main game loop
var update = function(timestamp){
	if(state.currentTime){
		state.lastTime = state.currentTime;
	}else{
		state.lastTime = timestamp;
	}
	state.currentTime = timestamp;
	state.timeSinceLastUpdate = state.currentTime - state.lastTime;
	updateActions();
	updateResources();
	updateStats();
	updateAbilities();
	updateProgress();
	updateCharacter();
	updateLog();
	
	window.requestAnimationFrame(update);
}

var updateCharacter = function(){
	var characterElement = $('#orphan-view');
	var characterNameElement = characterElement.find('#orphan-name');
	var characterDiminishedElement = characterElement.find('#orphan-diminished');
	if(characterNameElement.text()!=character.name){
		characterNameElement.text(character.name);
	}
	if(character.diminished > 0){
		characterDiminishedElement.show();
		var characterDiminishedValueElement = characterDiminishedElement.find('#diminished-value');
		if(characterDiminishedValueElement.text()!=character.diminished){
			characterDiminishedValueElement.text(character.diminished);
		}
	} else {
		characterDiminishedElement.hide();
	}
}

var updateAction = function(context, action){
	var actionElement = $("#"+action.elementId);
	if(true==action.shouldStart){
		action.start();
		action.running = action.runTime;
		action.shouldStart=false;
		actionElement.find('button').hide();
	}
	if(context.actionsAreBusy){
		actionElement.find('button').prop('disabled', true);
	}else{
		actionElement.find('button').prop('disabled', false);
	}
	
	// If this action is currently running...
	if(action.running >= 1){
		action.running -= state.timeSinceLastUpdate;
		if(action.running >= 1){
			progress = Math.floor(100 - (action.running / action.runTime) * 100)
			actionElement.find('.progress-bar').css('width', ''+progress+'%');
		}
		if(action.running < 1){
			action.running = 0;
			context.actionsAreBusy = false;
			actionElement.find('.progress-bar').css('width', '0%');
			actionElement.find('button').show();
			action.finish();
		}
	}
};

var updateActions = function(){
	[character, monster].forEach(function(context){
		if(context.unlockedActions.length > 0){
			$("#"+context.actionsElementId).show();
		}else{
			$("#"+context.actionsElementId).hide();
		}
		context.lockedActions.forEach(function(id){
			var action = context.actions[id];
			if(action.unlockedConditionsMet()){
				unlockAction(context, action);
			}
		});
		context.unlockedActions.forEach(function(id){
			var action = context.actions[id];
			updateAction(context, action);
		});
	})
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
	var statusElement = abilityElement.find('.status');
	var upgrade = ability.upgrade
	var upgradeElement = $("#"+upgrade.elementId);
	var activateElement = abilityElement.find('.activate');
	var deactivateElement = abilityElement.find('.deactivate');

	
	if(ability.trained){
		if(statusElement.text()!=''){
			statusElement.text('');
		}
	}else{
		if(statusElement.text()!='(Unrained)'){
			statusElement.text('(Untrained)');
		}
	}
	
	if(monster.abilitiesAreTraining){
		upgradeElement.find('button').prop('disabled', true);
	}else{
		upgradeElement.find('button').prop('disabled', false);	
	}
	
	if(ability.canBeTrained()){
		upgradeElement.show();
	}else{
		upgradeElement.hide();	
	}
	
	if(ability.trained){
		if(ability.active){
			abilityElement.addClass('active');
			activateElement.hide();
			deactivateElement.show();
		}else{
			abilityElement.removeClass('active');
			deactivateElement.hide();
			if(monster.activeAbilities.length < monster.maxActiveAbilities()){
				activateElement.show();
			}else{
				activateElement.hide();
			}
		}
	}else{
		abilityElement.removeClass('active');
		activateElement.hide();
		deactivateElement.hide();
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
		upgradeElement.find('.progress-bar').css('width', ''+progress+'%')
		upgradeElement.find('.progress-bar-text').text(""+(upgrade.running/1000).toFixed(2)+" seconds");
	}
	if(upgrade.running < 1){
		upgrade.running = 0;
		ability.trained = true;
		monster.abilitiesAreTraining = false
		upgradeElement.find('.progress-bar').css('width', '0%');
		upgradeElement.find('.progress-bar-text').text("");
		upgradeElement.find('button').show();
		upgrade.finish();
	}
}

var updateAbilities = function(){
	$('#currently-active-abilities').text(monster.activeAbilities.length);
	$('#max-active-abilities').text(monster.maxActiveAbilities());
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
			gameProgress.tabsAreUnlocked = true;
			$("#view-select-menu").show();
			addLog('green', "The monster has grown in strength and may improve his skills.")
		}
	}
	if(!gameProgress.orphanIsUnlocked){
		if(monster.abilities.sharedHealing.active){
			gameProgress.orphanIsUnlocked = true;
			$("#orphan-view-tab").show();
			addLog('red', "A new tab has become available.")

		}
	}
	if(!monster.abilitiesAreUnlocked){
		if(monster.unlockedAbilities.length > 0){
			monster.abilitiesAreUnlocked = true;
			$("#abilities").show();
		}
	}
}