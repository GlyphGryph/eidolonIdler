// Arguments
// id: str
// name: str
// description : str or function
// unlockedConditionsMet : function
// runTime : int,
// start : function
// finish : function
var Action = function(definition){
	this.id = definition.id;
	this.elementId = this.id + '-action';
	this.upgradeElementId = this.id + '-train';
	this.name = definition.name;
	this.description = function(){ return definition.description };
	this.unlockedConditionsMet = definition.unlockedConditionsMet;
	this.shouldStart = false;
	this.runTime = definition.runTime;
	this.start = definition.start;
	this.finish = definition.finish;
}