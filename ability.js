// Arguments
// id: str
// name: str
// description : str or function
// unlockedConditionsMet : function
// trainTime : int
var Ability = function(definition){
	this.id = definition.id;
	this.name = definition.name;
	this._description = definition.description;
	this.unlockedConditionsMet = definition.unlockedConditionsMet;
	this.trainTime = definition.trainTime;

	this.canBeTrained =  function(context){
		return !(context.trainedAbilities.includes(this.id));
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

Ability.prototype.description = function(){ return this._description };

Ability.prototype.getElementId = function(context){
	return this.id+'-ability-of-'+context.actionsElementId;
};

Ability.prototype.getUpgradeElementId = function(context){
	return this.id+'-ability-trainer-of-'+context.actionsElementId;
};

Ability.prototype.begin = function(context){
	if(!context.abilitiesAreTraining){
		this.start();
		context.abilitiesAreTraining = true;
		context.abilityTraining = this.id;
		context.abilityTrainingDuration = this.trainTime;
		var upgradeElement = $("#"+this.getUpgradeElementId(context));
	}
}

Ability.prototype.unlock = function(context){
	context.lockedAbilities = removeFromArray(context.lockedAbilities, this.id);
	context.unlockedAbilities.push(this.id);
	this.setup(context);
	addLog('black', "Ability "+this.name+" unlocked.");
};

Ability.prototype.activate = function(context){
	if(context.activeAbilities.length < context.maxActiveAbilities()){
		context.activeAbilities.push(this.id);
	}
}

Ability.prototype.deactivate = function(context){
	context.activeAbilities = removeFromArray(context.activeAbilities, this.id);
}

Ability.prototype.isActive = function(context){
	return context.activeAbilities.includes(this.id)
}

// Attach handlers when a stat is loaded or unlocked
Ability.prototype.setup = function(context){
	var that = this;
	var abilityElement = $("#ability-template").clone();
	abilityElement.attr('id', this.getElementId(context));
	var upgradeElement = abilityElement.find('#trainer-template');
	upgradeElement.attr('id', this.getUpgradeElementId(context));
	abilityElement.find('.name').text(this.name);
	$("#"+context.profileElementId+" .abilities").append(abilityElement);
	abilityElement.find(".text").mouseenter(function(){openDescription(this, that.description())});
	abilityElement.find(".text").mouseleave(closeDescription);
	upgradeElement.mouseenter(function(){openDescription(this, that.upgradeDescription())});
	upgradeElement.mouseleave(closeDescription);
	upgradeElement.click(function(){that.begin(context)});
	abilityElement.find('.activate').click(function(){that.activate(context)});
	abilityElement.find('.deactivate').click(function(){that.deactivate(context)});
};

Ability.prototype.update = function(context){
	var abilityElement = $("#"+this.getElementId(context));
	var statusElement = abilityElement.find('.status');
	var upgradeElement = $("#"+this.getUpgradeElementId(context));
	var activateElement = abilityElement.find('.activate');
	var deactivateElement = abilityElement.find('.deactivate');

	
	if(context.trainedAbilities.includes(this.id)){
		if(statusElement.text()!=''){
			statusElement.text('');
		}
	}else{
		if(statusElement.text()!='(Untrained)'){
			statusElement.text('(Untrained)');
		}
	}
	
	if(context.abilitiesAreTraining){
		upgradeElement.find('button').prop('disabled', true);
	}else{
		upgradeElement.find('button').prop('disabled', false);	
	}
	
	if(this.canBeTrained(context)){
		upgradeElement.show();
	}else{
		upgradeElement.hide();	
	}
	
	if(context.trainedAbilities.includes(this.id)){
		if(this.isActive(context)){
			abilityElement.addClass('active');
			activateElement.hide();
			deactivateElement.show();
		}else{
			abilityElement.removeClass('active');
			deactivateElement.hide();
			if(context.activeAbilities.length < context.maxActiveAbilities()){
				activateElement.show();
			}else{
				activateElement.hide();
			}
		}
	}else{
		abilityElement.removeClass('active');
		activateElement.hide();
		deactivateElement.hide();
	}
	
	if(context.abilitiesAreTraining){
		upgradeElement.find('button').prop('disabled', true);
	}else{
		upgradeElement.find('button').prop('disabled', false);
	}
	
	if(context.abilityTraining==this.id){
		context.abilityTrainingDuration -= state.timeSinceLastUpdate;
		upgradeElement.find('button').hide();
		if(context.abilityTrainingDuration >= 1){
			progress = Math.floor(100 - (context.abilityTrainingDuration / this.trainTime) * 100)
			upgradeElement.find('.progress-bar').css('width', ''+progress+'%')
			upgradeElement.find('.progress-bar-text').text(""+(context.abilityTrainingDuration/1000).toFixed(2)+" seconds");
		}
		if(context.abilityTrainingDuration < 1){
			context.abilityTrainingDuration = 0;
			context.trainedAbilities.push(this.id);
			context.abilityTraining = null;
			context.abilitiesAreTraining = false;
			upgradeElement.find('.progress-bar').css('width', '0%');
			upgradeElement.find('.progress-bar-text').text("");
			upgradeElement.find('button').show();
			this.finish();
		}
	}
}