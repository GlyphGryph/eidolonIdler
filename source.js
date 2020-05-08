var state = {
	currentTime: null,
	lastTime: null,
	timeSinceLastUpdate: null,
	resources: {
		monsterSpirit: {
			id: 'monster-spirit',
			name: "Spirit",
			value: 0,
			visible: false
		}
	},
	selectedTab: 'action',
	progress: {
		tabsUnlocked: false
	}
};

var log = [];

var actions = {
	huntWisp: {
		id: 'hunt-wisp',
		family: 'monster',
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 1000,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Monster starts hunting Wisps");
		},
		finish: function(){
			changeResource('monsterSpirit', 2);
			addLog('green', "Monster caught a Wisp.");
		}
	},
	fakeAction: {
		id: 'fake-action',
		family: 'monster',
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 10000,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Fake Action started");
		},
		finish: function(){
			addLog('green', "Fake Action finished.");
		}
	},
	explore: {
		id: 'explore',
		family: 'character',
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 100,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Fake Action started");
		},
		finish: function(){
			addLog('green', "Fake Action finished.");
		}
	},
	care: {
		id: 'care',
		family: 'character',
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 100,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Fake Action started");
		},
		finish: function(){
			addLog('green', "Fake Action finished.");
		}
	}
};

var actionFamilies = {
	monster: {
		id: 'monster-family',
		visible: true,
		busy: false,
		actions: ['huntWisp', 'fakeAction']
	},
	character: {
		id: 'character-family',
		visible: false,
		actions: ['explore', 'care']
	}
};

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

var changeResource = function(id, value){
	var resource = state.resources[id];
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

var updateActionFamily = function(key, actionFamily){
	if(actionFamily.visible){
		$("#"+actionFamily.id).show();
	}else{
		$("#"+actionFamily.id).hide();
	}
	actionFamily.actions.forEach(updateAction);
};

var updateResources = function(){
	$.each(state.resources, function(key, resource){
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

var updateProgress = function(){
	// Unlock tabs at 4 spirit
	if(!state.progress.tabsUnlocked){
		if(state.resources.monsterSpirit.value > 3){
			state.progress.tabsUnlocked=true;
			$("#view-select-menu").show();
			addLog('green', "The monster has grown in strength and may improve his skills.")
		}
	}
}

var update = function(timestamp){
	if(state.currentTime){
		state.lastTime = state.currentTime;
	}else{
		state.lastTime = timestamp;
	}
	state.currentTime = timestamp;
	state.timeSinceLastUpdate = state.currentTime - state.lastTime;
	$.each(actionFamilies, updateActionFamily);
	updateResources();
	updateProgress();
	updateLog();
	
	window.requestAnimationFrame(update);
}

var prepareActionToStart = function(action){
	var actionFamily = actionFamilies[action.family];
	if(!actionFamily.busy){
		action.shouldStart=true;
		actionFamily.busy=true;
	}
}

var setup = function(){
	$.each(actionFamilies, function(key, actionFamily){
		actionFamily.actions.forEach(function(id){
			var action = actions[id];
			if(action.start){
				$("#"+action.id).click(function(){prepareActionToStart(action)});
			}
		});
	});
	$("#action-view-tab").click(function(){selectView('action')});
	$("#monster-view-tab").click(function(){selectView('monster')});
	selectView('action');
	if(state.progress.tabsUnlocked){
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
  