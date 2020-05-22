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
	this.name = definition.name;
	this.description = function(){ return definition.description };
	this.unlockedConditionsMet = definition.unlockedConditionsMet;
	this.runTime = definition.runTime;
	this.start = definition.start;
	this.finish = definition.finish;
}

Action.prototype.getElementId = function(context){
	return this.elementId+'-action-of-'+context.actionsElementId
};

// Attach handlers when an action is loaded or unlocked
Action.prototype.setup = function(context){
	var that = this;
	var contextElement = $("#"+context.actionsElementId);
	var actionElement = $("#action-template").clone();
	actionElement.attr('id', this.getElementId(context));
	actionElement.find('.name').text(this.name);
	contextElement.append(actionElement);
	actionElement.mouseenter(function(){openDescription(this, that.description)});
	actionElement.mouseleave(function(){closeDescription()});
	actionElement.click(function(){that.begin(context)});
};


Action.prototype.begin = function(context){
	if(!context.actionsAreBusy  && 'standard' == state.mode){
		this.start();
		context.actionsAreBusy = true;
		context.actionRunning = this.id;
		context.actionRunningDuration = this.runTime;
		var actionElement = $("#"+this.getElementId(context));
	}
};

Action.prototype.update = function(context){
	var actionElement = $("#"+this.getElementId(context));
	if(context.actionsAreBusy || 'standard' != state.mode){
		actionElement.find('button').prop('disabled', true);
	}else{
		actionElement.find('button').prop('disabled', false);
	}
	
	// If this action is currently running...
	if(context.actionRunning == this.id && 'standard' == state.mode){
		actionElement.find('button').hide();
		context.actionRunningDuration -= state.timeSinceLastUpdate;
		if(context.actionRunningDuration >= 1){
			progress = Math.floor(100 - (context.actionRunningDuration / this.runTime) * 100)
			actionElement.find('.progress-bar').css('width', ''+progress+'%');
		}
		if(context.actionRunningDuration < 1){
			context.actionRunningDuration = 0;
			context.actionsAreBusy = false;
			context.actionRunning = null;
			actionElement.find('.progress-bar').css('width', '0%');
			actionElement.find('button').show();
			this.finish();
		}
	}
};

Action.prototype.unlock = function(context){
	context.lockedActions = removeFromArray(context.lockedActions, this.id);
	context.unlockedActions.push(this.id);
	this.setup(context);
	addLog('black', "Action "+this.name+" unlocked.");
};