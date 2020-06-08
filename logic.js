var save = function(saveName='saveState'){
	var saveState = JSON.stringify(state.toSaveState());
	setCookie(saveName, saveState, 360);
}

var settings = {
	ambush_frequency: 5, // Number of seconds, on average, between ambushes
	ambush_variability: .5 // Percent of of frequency value can vary until next ambush
}

var getAmbushClock = function(){
	var min = settings.ambush_frequency * settings.ambush_variability;
	var max = settings.ambush_frequency * (1+settings.ambush_variability);
	var range = max - min;
	return (Math.random() * range + min) * 1000;
}

var load = function(saveName='saveState'){
	if(getCookie(saveName)){
		var saveState = JSON.parse(getCookie(saveName));
		setup(saveState);
	} else {
		alert('no save game data detected');
	}
}

var resetGame = function(){
	setup();
	var saveState = JSON.stringify(state.toSaveState());
	setCookie('saveState', saveState, 360);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

var removeFromArray = function(array, value){
	return array.filter(function(elem){ return elem != value; }); 
};

var eqOr = function(conditional, fallback){
	return (conditional !== undefined) ? conditional : fallback;
}

var selectView = function(id){
	$(".view").hide();
	$('#'+id+'-view').show();
	$('.tab').removeClass('selected');
	$('#'+id+'-view-tab').addClass('selected');
}

var addLog = function(color, message){
	state.log.push([color, message]);
	if(state.log.length > 20){
		state.log.shift();
	}
};

var anyMonsterActionsAreBusy = function(){
	busy = false
	state.monsters.forEach(function(monster){
		busy = busy || monster.actionsAreBusy
	});
	return busy;
}

var anyActionsAreBusy = function(){
	return anyMonsterActionsAreBusy() || state.character.actionsAreBusy
}

var gainSpirit = function(value){
	state.monsters.forEach(function(monster){
		if(abilities.sharedHealing.isActive(monster) && state.character.diminished > 0){
			var amountToSiphon = monster.stats.power.level;
			if(amountToSiphon > value){
				amountToSiphon = value;
			}
			if(amountToSiphon > state.character.diminished){
				amountToSiphon = state.character.diminished;
			}
			state.character.diminished -= amountToSiphon;
			addLog('red', "Orphan healed "+amountToSiphon+" points of damage.");
			if(state.character.diminished <= 0){
				addLog('red', "Orphan fully healed.");
			}
			value = value - amountToSiphon;
		}
	})
	state.resources.spirit.change(value);
}

var exploreRegion = function(){
	var region = state.regions[state.currentRegion]
	if(region.awareness < region.size){
		region.awareness+=1;
		if(region.awareness in region.discoveries){
			region.discoveries[region.awareness]();
		}
	}
}


var openDescription = function(elem, description){
	var describerElement = jQuery(elem);
	var descriptionElement = $("#description")
	if('function' == typeof description){
		description = description();
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

var startScript = function(){
	//Setup Save/Load buttons
	$("#save-button").click(function(){save('saveState2')});
	$("#load-button").click(function(){load('saveState2')});
	$("#reset-button").click(function(){resetGame()});
	$("#summon-boss-button").click(function(){Battle.startBossFight()});
	$("#summon-ambush").click(function(){Battle.startAmbush('character')}); //state.monsters[0].id)});
	if(getCookie('saveState')){
		var saveState = JSON.parse(getCookie('saveState'));
		setup(saveState);
	} else {
		setup();
	}
	// First run of the update loop
	window.requestAnimationFrame(update);
};

$(document).ready(startScript);
  