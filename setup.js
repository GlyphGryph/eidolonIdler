// Attach handlers when a stat is loaded or unlocked
var setupStat = function(stat){
	$("#"+stat.elementId).show();
	$("#"+stat.elementId+" .name").mouseenter(function(){openDescription(this, stat)});
	$("#"+stat.elementId+" .name").mouseleave(closeDescription);
	$("#"+stat.upgrade.elementId).mouseenter(function(){openDescription(this, stat.upgrade)});
	$("#"+stat.upgrade.elementId).mouseleave(closeDescription);
	$("#"+stat.upgrade.elementId).click(function(){upgradeStat(stat)});	
}

// Attach handlers when a stat is loaded or unlocked
var setupAbility = function(ability){
	abilityElement = $("#ability-template").clone();
	abilityElement.attr('id', ability.elementId);
	abilityElement.find('#trainer-template').attr('id', ability.upgrade.elementId);
	abilityElement.find('.name').text(ability.name);
	$("#abilities").append(abilityElement);
	$("#"+ability.elementId).show();
	$("#"+ability.elementId+" .text").mouseenter(function(){openDescription(this, ability)});
	$("#"+ability.elementId+" .text").mouseleave(closeDescription);
	$("#"+ability.upgrade.elementId).mouseenter(function(){openDescription(this, ability.upgrade)});
	$("#"+ability.upgrade.elementId).mouseleave(closeDescription);
	$("#"+ability.upgrade.elementId).click(function(){prepareAbilityToTrain(ability)});
	abilityElement.find('.activate').click(function(){activateAbility(ability)});
	abilityElement.find('.deactivate').click(function(){deactivateAbility(ability)});	
}

// Runs once at game start / on game load
var setup = function(){
	$.each(actionFamilies, function(key, actionFamily){
		actionFamily.actions.forEach(function(id){
			var action = actions[id];
			if(action.start){
				$("#"+action.id).click(function(){prepareActionToStart(action)});
			}
		});
	});
	
	// Setup stats
	monster.unlockedStats.forEach(function(id){
		var stat = monster.stats[id];
		setupStat(stat);
	});
	monster.lockedStats.forEach(function(id){
		var stat = monster.stats[id];
		$("#"+stat.elementId).hide();
	});
	
	// Setup abilities
	monster.unlockedAbilities.forEach(function(id){
		var ability = monster.abilities[id];
		setupStat(ability);
	});
	monster.lockedAbilities.forEach(function(id){
		var ability = monster.abilities[id];
		$("#"+ability.elementId).hide();
	});
	if(monster.abilitiesAreUnlocked){
		$("#abilities").show();
	}else{
		$("#abilities").hide();
	}
	
	// Setup actions	
	$.each(actions, function(key, action){
		$("#"+action.id).mouseenter(function(){openDescription(this, action)});
		$("#"+action.id).mouseleave(function(){closeDescription()});
	});
	
	//Setup Tabs
	$("#action-view-tab").click(function(){selectView('action')});
	$("#monster-view-tab").click(function(){selectView('monster')});
	$("#orphan-view-tab").click(function(){selectView('orphan')});

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
	
	// First run of the update loop
	update();
	
	// Finally, show the play area to the player
	$('#play-area').show();
}