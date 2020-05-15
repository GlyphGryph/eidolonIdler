// State object arguments:
// name
// diminished
// actionsAreBusy
// unlockedActions
// lockedActions
// actionRunning
// actionRunningDuration
var Character = function(state){
	this.name = state.name;
	this.diminished = state.diminished;
	this.actionsAreBusy = state.actionsAreBusy;
	this.unlockedActions = state.unlockedActions;
	this.lockedActions = state.lockedActions;
	this.actionsElementId = 'character-family';
	this.actionRunning = state.actionRunning;
	this.actionRunningDuration = state.actionRunningDuration;
}

var character =	new Character({
	name: "Wayward Orphan",
	diminished: 3,
	actionsAreBusy: false,
	unlockedActions:[],
	lockedActions:[
		'explore',
		'care'
	],
	actionRunningDuration: 0,
	actionRunning: null
});