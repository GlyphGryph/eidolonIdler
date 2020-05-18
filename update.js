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
	updateRegions();
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

var updateActions = function(){
	[character, ...monsters].forEach(function(context){
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
	lockedRegions.forEach(function(id){
		var region = regions[id];
		if(region.unlockedConditionsMet()){
			region.unlock();
		}
	});
	unlockedRegions.forEach(function(id){
		var region = regions[id];
		region.update();
	});
};

var updateResources = function(){
	unlockedResources.forEach(function(id){
		resources[id].update();
	});
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

var updateStats = function(){
	monsters.forEach(function(monster){
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
	monsters.forEach(function(monster){
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
	monsters.forEach(function(monster){
		monster.update();
	});
};

var updateProgress = function(){
	// Unlock tabs at 4 spirit
	if(!gameProgress.tabsAreUnlocked){
		if(resources.spirit.value > 3){
			gameProgress.tabsAreUnlocked = true;
			$("#view-select-menu").show();
			addLog('green', "The monster has grown in strength and may improve his skills.")
		}
	}
	if(!gameProgress.orphanIsUnlocked){
		if(abilities.sharedHealing.active){
			gameProgress.orphanIsUnlocked = true;
			$("#orphan-view-tab").show();
			addLog('red', "A new tab has become available.")

		}
	}
	
	if(!gameProgress.regionsAreUnlocked){
		if(regions.blackenedWasteland.awareness > 0){
			gameProgress.regionsAreUnlocked = true;
			$("#region-view-tab").show();
		}
	}
}