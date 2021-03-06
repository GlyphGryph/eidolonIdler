// State object arguments:
// name
// diminished
// actionsAreBusy
// unlockedActions
// lockedActions
// actionRunning
// actionRunningDuration
var Character = function(saveState){
	this.id = 'character';
	this.name = saveState.name;
	this.diminished = (saveState.diminished !== undefined) ? saveState.diminished :3;
	this.actionsAreBusy = (saveState.actionsAreBusy !== undefined) ? saveState.actionsAreBusy :false;
	this.unlockedActions = (saveState.unlockedActions !== undefined) ? saveState.unlockedActions :[];
	this.lockedActions = (saveState.lockedActions !== undefined) ? saveState.lockedActions :[
		'explore',
		'care'
	];
	this.actionsElementId = 'character-action-family';
	this.actionRunning = (saveState.actionRunning !== undefined) ? saveState.actionRunning :null;
	this.actionRunningDuration = (saveState.actionRunningDuration !== undefined) ? saveState.actionRunningDuration :0;
}

Character.prototype.toSaveState = function(){
	var thing = {
		name: this.name,
		diminished: this.diminished,
		actionsAreBusy: this.actionsAreBusy,
		unlockedActions: this.unlockedActions,
		lockedActions: this.lockedActions,
		actionRunning: this.actionRunning,
		actionRunningDuration: this.actionRunningDuration
	}
	return thing;
};

Character.prototype.isAlive = function(){
	return this.diminished < 1;
};

Character.prototype.setup = function(){
	var actionsElement = $("#action-family-template").clone();
	actionsElement.attr('id', this.actionsElementId);
	actionsElement.find('.monster-name').text(this.name);
	$("#action-view").append(actionsElement);
		
	var profileElement = $("#orphan-profile-template").clone();
	profileElement.attr('id', this.profileElementId);
	profileElement.find('.orphan-name').text(this.name);
	$("#orphan-view").append(profileElement);
};

Character.prototype.kill = function(amount){
	this.diminished += eqOr(amount, 30);
};

Character.prototype.update = function(){
	var characterElement = $('#orphan-view');
	var characterNameElement = characterElement.find('.orphan-name');
	var characterDiminishedElement = characterElement.find('.orphan-diminished');
	if(characterNameElement.text()!=this.name){
		characterNameElement.text(this.name);
	}
	if(this.diminished > 0){
		if(this.actionRunning){
			actions[this.actionRunning].cancel(this);
		}
		characterDiminishedElement.show();
		var characterDiminishedValueElement = characterDiminishedElement.find('.diminished-value');
		if(characterDiminishedValueElement.text() != this.diminished){
			characterDiminishedValueElement.text(this.diminished);
		}
	} else {
		characterDiminishedElement.hide();
	}
}

Character.prototype.bind = function(enemy){
	state.addTeammate(enemy.monsterTemplateId);
};