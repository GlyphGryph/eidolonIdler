var selectView = function(id){
	if('action'==id){
		$('#monster-view').hide();
		$('#action-view').show();
		$('#action-view-tab').addClass('selected');
		$('#monster-view-tab').removeClass('selected');
	}else if('monster'==id){
		$('#action-view').hide();
		$('#monster-view').show();
		$('#monster-view-tab').addClass('selected');
		$('#action-view-tab').removeClass('selected');
	}
}

var addLog = function(color, message){
	log.push([color, message]);
};

var runAction = function(id){
	var action = actions[id];
	if(action.running < 1){ return; }
	var actionElement = $("#"+action.id);
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

var totalLevels = function(){
	var total = 0;
	$.each(monster.stats, function(key, monsterStat){
		total += monsterStat.level;
	});
	return total;
}

var upgradeMultiplier = function(){
	return totalLevels();
}

var changeResource = function(id, value){
	var resource = resources[id];
	resource.value += value;
	resource.visible = true;
	addLog('black', "Gained "+value+" "+resource.name+".");
};

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
	runAction(id);
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
	if(stat.visible){
		statElement.show();
	}else{
		statElement.hide();
	}
}

var updateStats = function(){
	$.each(monster.stats, function(key, stat){
		updateStat(stat);
	})
}

var updateProgress = function(){
	// Unlock tabs at 4 spirit
	if(!gameProgress.tabsUnlocked){
		if(resources.monsterSpirit.value > 3){
			gameProgress.tabsUnlocked=true;
			$("#view-select-menu").show();
			addLog('green', "The monster has grown in strength and may improve his skills.")
		}
	}
}

var prepareActionToStart = function(action){
	var actionFamily = actionFamilies[action.family];
	if(!actionFamily.busy){
		action.shouldStart=true;
		actionFamily.busy=true;
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

// Attach handlers when a stat is loaded or unlocked
var setupStat = function(stat){
	$("#"+stat.elementId+" .name").mouseenter(function(){openDescription(this, stat)});
	$("#"+stat.elementId+" .name").mouseleave(closeDescription);
	$("#"+stat.upgrade.elementId).mouseenter(function(){openDescription(this, stat.upgrade)});
	$("#"+stat.upgrade.elementId).mouseleave(closeDescription);
	$("#"+stat.upgrade.elementId).click(function(){upgradeStat(stat)});	
}

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
	updateProgress();
	updateLog();
	
	window.requestAnimationFrame(update);
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
	monster.unlockedStats.forEach(function(id){
		var stat = monster.stats[id];
		setupStat(stat);
	});
	$.each(actions, function(key, action){
		$("#"+action.id).mouseenter(function(){openDescription(this, action)});
		$("#"+action.id).mouseleave(function(){closeDescription()});
	});
	$("#action-view-tab").click(function(){selectView('action')});
	$("#monster-view-tab").click(function(){selectView('monster')});
	selectView('action');
	if(gameProgress.tabsUnlocked){
		$("#view-select-menu").show();
	}else{
		$("#view-select-menu").hide();
	}
	update();
	$('#play-area').show();
}

var startScript = function(){
	setup();
};

$(document).ready(startScript);
  