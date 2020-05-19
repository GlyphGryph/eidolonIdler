// State object arguments:
// name
// diminished
// actionsAreBusy
// unlockedActions
// lockedActions
// actionRunning
// actionRunningDuration
var Character = function(definition){
	this.name = definition.name;
	this.diminished = definition.diminished || 3;
	this.actionsAreBusy = definition.actionsAreBusy || false;
	this.unlockedActions = definition.unlockedActions || [];
	this.lockedActions = definition.lockedActions || [
		'explore',
		'care'
	];
	this.actionsElementId = 'character-action-family';
	this.actionRunning = definition.actionRunning || null;
	this.actionRunningDuration = definition.actionRunningDuration || 0;
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
}

Character.prototype.setup = function(){
	var actionsElement = $("#action-family-template").clone();
	actionsElement.attr('id', this.actionsElementId);
	actionsElement.find('.name').text(this.name);
	$("#action-view").append(actionsElement);
		
	var profileElement = $("#orphan-profile-template").clone();
	profileElement.attr('id', this.profileElementId);
	profileElement.find('.orphan-name').text(this.name);
	$("#orphan-view").append(profileElement);
}