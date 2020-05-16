// Attach handlers when a region is loaded or unlocked
var setupRegion = function(region){
	var regionElement = $("#region-template").clone();
	regionElement.attr('id', region.elementId);
	var nameElement = regionElement.find('.name')
	nameElement.text(region.name);
	$("#region-view").append(regionElement);
	regionElement.show();
	nameElement.mouseenter(function(){openDescription(this, region.description)});
	nameElement.mouseleave(closeDescription);
	var travelElement = regionElement.find('.travel-button')
	travelElement.mouseenter(function(){openDescription(this, region.travel.description())});
	travelElement.mouseleave(closeDescription);
	travelElement.click(function(){prepareTravelToStart(region)});
}

// Attach handlers when a stat is loaded or unlocked
var setupStat = function(stat){
	var statElement = $("#stat-template").clone();
	statElement.attr('id', stat.elementId);
	statElement.find('#upgrade-template').attr('id', stat.upgradeElementId);
	statElement.find('.name').text(stat.name);
	$("#monster-stats").append(statElement);
	$("#"+stat.elementId+" .name").mouseenter(function(){openDescription(this, stat.description())});
	$("#"+stat.elementId+" .name").mouseleave(closeDescription);
	$("#"+stat.upgradeElementId).mouseenter(function(){openDescription(this, stat.upgradeDescription())});
	$("#"+stat.upgradeElementId).mouseleave(closeDescription);
	$("#"+stat.upgradeElementId).click(function(){stat.upgrade()});	
}

// Attach handlers when an action is loaded or unlocked
var setupAction = function(context, action){
	var contextElement = $("#"+context.actionsElementId);
	var actionElement = $("#action-template").clone();
	actionElement.attr('id', action.elementId);
	actionElement.find('.name').text(action.name);
	contextElement.append(actionElement);
	actionElement.mouseenter(function(){openDescription(this, action.description)});
	actionElement.mouseleave(function(){closeDescription()});
	actionElement.click(function(){prepareActionToStart(context, action)});
}

// Attach handlers when a stat is loaded or unlocked
var setupAbility = function(ability){
	var abilityElement = $("#ability-template").clone();
	abilityElement.attr('id', ability.elementId);
	abilityElement.find('#trainer-template').attr('id', ability.upgradeElementId);
	abilityElement.find('.name').text(ability.name);
	$("#abilities").append(abilityElement);
	$("#"+ability.elementId).show();
	$("#"+ability.elementId+" .text").mouseenter(function(){openDescription(this, ability.description())});
	$("#"+ability.elementId+" .text").mouseleave(closeDescription);
	$("#"+ability.upgradeElementId).mouseenter(function(){openDescription(this, ability.upgradeDescription())});
	$("#"+ability.upgradeElementId).mouseleave(closeDescription);
	$("#"+ability.upgradeElementId).click(function(){prepareAbilityToTrain(ability)});
	abilityElement.find('.activate').click(function(){activateAbility(ability)});
	abilityElement.find('.deactivate').click(function(){deactivateAbility(ability)});	
}

// Runs once at game start / on game load
var setup = function(){
	// Setup regionsAreUnlocked
	unlockedRegions.forEach(function(id){
		var region = regions[id];
		setupRegion(region);
	});
	
	// Setup stats
	monster.unlockedStats.forEach(function(id){
		var stat = monster.stats[id];
		setupStat(stat);
	});
	
	// Setup abilities
	monster.unlockedAbilities.forEach(function(id){
		var ability = abilities[id];
		setupStat(ability);
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
			setupAction(monster, action);
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