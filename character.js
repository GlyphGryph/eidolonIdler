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
	this.actionsElementId = 'character-family';
	this.actionRunning = definition.actionRunning || null;
	this.actionRunningDuration = definition.actionRunningDuration || 0;
}