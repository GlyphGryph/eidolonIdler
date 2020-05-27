

// The main game loop
var update = function(timestamp){
	// We want time to persist between sessions, so we use absolute time instead of the given timestamp
	timestamp = (new Date()).getTime();
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
	updateRegions();
	updateLog();
	updateBattle();
	save();
	
	window.requestAnimationFrame(update);
}

var updateBattle = function(){
	if(state.mode == 'battle'){
		state.currentBattle.update();
	} else {
		$("#battle").hide();
	}
};

var updateCharacter = function(){
	var characterElement = $('#orphan-view');
	var characterNameElement = characterElement.find('.orphan-name');
	var characterDiminishedElement = characterElement.find('.orphan-diminished');
	if(characterNameElement.text()!=state.character.name){
		characterNameElement.text(state.character.name);
	}
	if(state.character.diminished > 0){
		characterDiminishedElement.show();
		var characterDiminishedValueElement = characterDiminishedElement.find('.diminished-value');
		if(characterDiminishedValueElement.text()!=state.character.diminished){
			characterDiminishedValueElement.text(state.character.diminished);
		}
	} else {
		characterDiminishedElement.hide();
	}
};

var updateActions = function(){
	[state.character, ...state.monsters].forEach(function(context){
		if(context.unlockedActions.length > 0){
			$("#"+context.actionsElementId).show();
		}else{
			$("#"+context.actionsElementId).hide();
		}
		context.lockedActions.forEach(function(id){
			var action = actions[id];
			if(action.unlockedConditionsMet(context)){
				action.unlock(context);
			}
		});
		context.unlockedActions.forEach(function(id){
			actions[id].update(context);
		});
	})
};

var updateRegions = function(){
	state.lockedRegions.forEach(function(id){
		var region = state.regions[id];
		if(region.unlockedConditionsMet()){
			region.unlock();
		}
	});
	state.unlockedRegions.forEach(function(id){
		var region = state.regions[id];
		region.update();
	});
};

var updateResources = function(){
	state.unlockedResources.forEach(function(id){
		state.resources[id].update();
	});
};

var updateLog = function(){
	var logElement = $('#log');
	logElement.html("");
	[...state.log].reverse().forEach(function(message){
		messageElement = $("<p>"+message[1]+"</p>");
		messageElement.css('color', message[0]);
		logElement.append(messageElement);
	});
};

var updateStats = function(){
	state.monsters.forEach(function(monster){
		monster.lockedStats.forEach(function(id){
			var stat = monster.stats[id];
			if(stat.unlockedConditionsMet()){
				stat.unlock();
			}
		});
		monster.unlockedStats.forEach(function(id){
			var stat = monster.stats[id];
			stat.update();
		});
	});
}

var updateAbilities = function(){
	state.monsters.forEach(function(monster){
		$('#'+monster.profileElementId+' .currently-active-abilities').text(monster.activeAbilities.length);
		$('#'+monster.profileElementId+' .max-active-abilities').text(monster.maxActiveAbilities());
		monster.lockedAbilities.forEach(function(id){
			var ability = abilities[id];
			if(ability.unlockedConditionsMet(monster)){
				ability.unlock(monster);
			}
		});
		monster.unlockedAbilities.forEach(function(id){
			var ability = abilities[id];
			ability.update(monster);
		});
	});
}

var updateMonsters = function(){
	state.monsters.forEach(function(monster){
		monster.update();
	});
};

var updateProgress = function(){
	// Unlock tabs at 4 spirit
	if(!state.tabsAreUnlocked){
		if(state.resources.spirit.value > 3){
			state.tabsAreUnlocked = true;
			$("#view-select-menu").show();
			addLog('green', "The monster has grown in strength and may improve his skills.")
		}
	}
	if(!state.orphanIsUnlocked){
		state.monsters.forEach(function(monster){
			if(abilities.sharedHealing.isActive(monster)){
				state.orphanIsUnlocked = true;
				$("#orphan-view-tab").show();
				addLog('red', "A new tab has become available.")
			}
		});
	}
	
	if(!state.regionsAreUnlocked){
		if(state.regions.blackenedWasteland.awareness > 0){
			state.regionsAreUnlocked = true;
			$("#region-view-tab").show();
		}
	}
}