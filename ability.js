// Arguments
// id: str
// name: str
// description : str or function
// unlockedConditionsMet : function
// runTime : int,
// start : function
// finish : function
var Ability = function(definition){
	this.id = definition.id;
	this.elementId = this.id + '-ability';
	this.upgradeElementId = this.id + '-train';
	this.name = definition.name;
	this.description = function(){ return definition.description };
	this.unlockedConditionsMet = definition.unlockedConditionsMet;
	this.trainTime = definition.trainTime,
	this.shouldStart = false;

	this.canBeTrained =  function(){
		return !(monster.trainedAbilities.includes(this.id));
	};
	this.upgradeDescription = function(){
		return "Takes "+this.trainTime/1000+" seconds.";
	};
	this.start = function(){
		addLog('green', "Started training "+this.name+".");
	},
	this.finish = function(){
		addLog('green', "Finished training "+this.name+".");
	}				
	this.check = function(){
		console.log(this.id);
	}
}