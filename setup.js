var clearOldElements = function(){
	$('#action-view').html('');
	$('#monster-view').html('');
	$('#orphan-view').html('');
	$('#region-view').html('');
	$('#resources').html('');
	$('#log').html('');
	$('#description').html('');
	$('#battle .title').html('');
};

// Runs once at game start / on game load
var setup = function(saveState){
	if(saveState){
		state = new State(saveState);
	}else{
		state = newGameState();
	}
	
	clearOldElements();
	
	// Setup unlocked regions
	state.unlockedRegions.forEach(function(id){
		var region = state.regions[id];
		region.setup();
	});
	
	state.unlockedResources.forEach(function(id){
		var resource = state.resources[id];
		resource.setup();
	});
	
	// Setup each monster
	state.monsters.forEach(function(monster){
		monster.setup();
	});
	
	// Setup character actions
	state.character.setup();
	state.character.unlockedActions.forEach(function(id){
		var action = actions[id];
		action.setup(state.character); 
	});
	
	//Setup Tabs
	$("#action-view-tab").click(function(){selectView('action')});
	$("#monster-view-tab").click(function(){selectView('monster')});
	$("#orphan-view-tab").click(function(){selectView('orphan')});
	$("#region-view-tab").click(function(){selectView('region')});

	selectView('action');
	if(state.tabsAreUnlocked){
		$("#view-select-menu").show();
	}else{
		$("#view-select-menu").hide();
	}
	
	if(state.orphanIsUnlocked){
		$("#orphan-view-tab").show();
	}else{
		$("#orphan-view-tab").hide();
	}
	
	if(state.regionsAreUnlocked){
		$("#region-view-tab").show();
	}else{
		$("#region-view-tab").hide();
	}
	
	if('battle' == state.mode){
		state.battle.setup();
	}

	// Finally, show the play area to the player
	$('#play-area').show();
}