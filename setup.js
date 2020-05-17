// Runs once at game start / on game load
var setup = function(){
	// Create all regions
	regionDefinitions.forEach(function(definition){
		regions[definition.id] = new Region(definition, 0, 0);
	})

	// Setup regionsAreUnlocked
	unlockedRegions.forEach(function(id){
		var region = regions[id];
		region.setup();
	});
	
	// Setup stats
	monster.unlockedStats.forEach(function(id){
		var stat = monster.stats[id];
		stat.setup();
	});
	
	// Setup abilities
	monster.unlockedAbilities.forEach(function(id){
		var ability = abilities[id];
		setupAbility(ability);
	});
	if(monster.abilitiesAreUnlocked){
		$("#abilities").show();
	}else{
		$("#abilities").hide();
	}
	
	// Setup resources
	unlockedResources.forEach(function(id){
		var ability = abilities[id];
		ability.setup;
	});
	
	// Setup actions
	[character, monster].forEach(function(context){
		context.unlockedActions.forEach(function(id){
			var action = actions[id];
			action.setup(context);
		});
	});
	
	//Setup Tabs
	$("#action-view-tab").click(function(){selectView('action')});
	$("#monster-view-tab").click(function(){selectView('monster')});
	$("#orphan-view-tab").click(function(){selectView('orphan')});
	$("#region-view-tab").click(function(){selectView('region')});

	selectView('action');
	if(gameProgress.tabsAreUnlocked){
		$("#view-select-menu").show();
	}else{
		$("#view-select-menu").hide();
	}
	
	if(gameProgress.orphanIsUnlocked){
		$("#orphan-view-tab").show();
	}else{
		$("#orphan-view-tab").hide();
	}
	
	if(gameProgress.regionsAreUnlocked){
		$("#region-view-tab").show();
	}else{
		$("#region-view-tab").hide();
	}
	
	// First run of the update loop
	update();
	
	// Finally, show the play area to the player
	$('#play-area').show();
}