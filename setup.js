// Runs once at game start / on game load
var setup = function(){
	state = newGameState();
	// Setup unlocked regions
	state.unlockedRegions.forEach(function(id){
		var region = state.regions[id];
		region.setup();
	});
	
	// Setup each monster
	state.monsters.forEach(function(monster){
		monster.setup();
		
		// Setup stats
		monster.unlockedStats.forEach(function(id){
			monster.stats[id].setup()
		});
		
		// Setup abilities
		monster.unlockedAbilities.forEach(function(id){
			abilities[id].setup();
		});
		
		if(monster.abilitiesAreUnlocked){
			$("#abilities").show();
		}else{
			$("#abilities").hide();
		}
		
		monster.unlockedActions.forEach(function(id){
			var action = actions[id];
			action.setup(monster);
		});
	});

	// Setup resources
	state.unlockedResources.forEach(function(id){
		var ability = abilities[id];
		ability.setup;
	});
	
	// Setup character actions
	state.character.unlockedActions.forEach(function(id){
		var action = actions[id];
		action.setup(context);
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
	
	// First run of the update loop
	update();
	
	// Finally, show the play area to the player
	$('#play-area').show();
}