// Mandatory arguments
// id
// name
// abilities
//
// Form of stats in saveState: {bond: value, will: value, intellect: value, power: value}
var Monster = function(saveState){
	this.name = saveState.name;
	this.primaryTemplateId = saveState.primaryTemplateId;
	this.primaryTemplate = monsterTemplates[this.primaryTemplateId];
	this.secondaryTemplateId = eqOr(saveState.secondaryTemplateId, null);
	if(this.secondaryTemplateId){
		this.secondaryTemplate = monsterTemplates[this.secondaryTemplateId];
	}else{
		this.secondaryTemplate = null;
	}
	// Status
	this.destroyed = eqOr(saveState.destroyed, false);
	
	// Actions
	this.actionRunningDuration = (saveState.actionRunningDuration !== undefined) ? saveState.actionRunningDuration : 0;
	this.actionRunning = (saveState.actionRunning !== undefined) ? saveState.actionRunning : null;
	this.id = saveState.id;
	this.actionsElementId = this.id + '-action-family';
	this.profileElementId = this.id + '-monster-profile';
	this.actionsAreBusy = (saveState.actionsAreBusy !== undefined) ? saveState.actionsAreBusy : false;
	this.unlockedActions = eqOr(saveState.unlockedActions, this.primaryTemplate.actions);
	this.lockedActions = (saveState.lockedActions !== undefined) ? saveState.lockedActions : [];
	
	// Abilities
	this.abilitiesAreUnlocked = (saveState.abilitiesAreUnlocked !== undefined) ? saveState.abilitiesAreUnlocked : false;
	this.abilitiesAreTraining = (saveState.abilitiesAreTraining !== undefined) ? saveState.abilitiesAreTraining : false;
	this.abilityTraining = (saveState.abilityTraining !== undefined) ? saveState.abilityTraining : null;
	this.abilityTrainingDuration = (saveState.abilityTrainingDuration !== undefined) ? saveState.abilityTrainingDuration : 0;
	this.unlockedAbilities = (saveState.unlockedAbilities !== undefined) ? saveState.unlockedAbilities : [];
	this.lockedAbilities = eqOr(saveState.lockedAbilities, this.primaryTemplate.abilities);
	this.activeAbilities = (saveState.activeAbilities !== undefined) ? saveState.activeAbilities : [];
	this.trainedAbilities = (saveState.trainedAbilities !== undefined) ? saveState.trainedAbilities : [];
	
	// Stats
	this.unlockedStats = (saveState.unlockedStats !== undefined) ? saveState.unlockedStats : [
		'bond'
	];
	this.lockedStats = (saveState.lockedStats !== undefined) ? saveState.lockedStats : [
		'will',
		'intellect',
		'power'
	];
	if(saveState.stats){
		this.stats = {
			bond: new BondStat(this, saveState.stats.bond),
			will: new WillStat(this, saveState.stats.will),
			intellect: new IntellectStat(this, saveState.stats.intellect),
			power: new PowerStat(this, saveState.stats.power),
		};
	}else{
		this.stats = {
			bond: new BondStat(this, 0),
			will: new WillStat(this, 1),
			intellect: new IntellectStat(this, 1),
			power: new PowerStat(this, 1),
		};
	}
};

Monster.prototype.toSaveState = function(){
	var thing = {
		name: this.name,
		id: this.id,
		destroyed: this.destroyed,
		primaryTemplateId: this.primaryTemplateId, 
		secondaryTemplateId: this.secondaryTemplateId,
		
		// Actions
		actionRunningDuration: this.actionRunningDuration,
		actionRunning: this.actionRunning,
		profileElementId: this.profileElementId,
		actionsAreBusy: this.actionsAreBusy,
		unlockedActions: this.unlockedActions,
		lockedActions: this.lockedActions,
		
		// Abilities
		abilitiesAreUnlocked: this.abilitiesAreUnlocked,
		abilitiesAreTraining: this.abilitiesAreTraining,
		abilityTraining: this.abilityTraining,
		abilityTrainingDuration: this.abilityTrainingDuration,
		unlockedAbilities: this.unlockedAbilities,
		lockedAbilities: this.lockedAbilities,
		activeAbilities: this.activeAbilities,
		trainedAbilities: this.trainedAbilities,
		
		// Stats
		unlockedStats: this.unlockedStats,
		lockedStats: this.lockedStats,
		stats: {
			bond: this.stats.bond.level,
			will: this.stats.will.level,
			intellect: this.stats.intellect.level,
			power: this.stats.power.level
		}
	}
	return thing;
}

Monster.prototype.isAlive = function(){
	return !this.destroyed;
};

Monster.prototype.maxActiveAbilities = function(){
	return this.stats.intellect.level;
};

Monster.prototype.totalLevels = function(){
	var total = 0;
	$.each(this.stats, function(key, monsterStat){
		total += monsterStat.level;
	});
	return total;
}

Monster.prototype.setup = function(){
	var actionsElement = $("#action-family-template").clone();
	actionsElement.attr('id', this.actionsElementId);
	actionsElement.find('.monster-name').text(this.name);
	$("#action-view").append(actionsElement);
		
	var profileElement = $("#monster-profile-template").clone();
	profileElement.attr('id', this.profileElementId);
	profileElement.find('.monster-name').text(this.name);
	$("#monster-view").append(profileElement);
}

Monster.prototype.updateAbilities = function(){
	var that = this;
	$('#'+this.profileElementId+' .currently-active-abilities').text(this.activeAbilities.length);
	$('#'+this.profileElementId+' .max-active-abilities').text(this.maxActiveAbilities());

	this.lockedAbilities.forEach(function(id){
		var ability = abilities[id];
		if(ability.unlockedConditionsMet(that)){
			ability.unlock(that);
		}
	});
	this.unlockedAbilities.forEach(function(id){
		var ability = abilities[id];
		ability.update(that);
	});
}

Monster.prototype.update = function(){
	if(!this.abilitiesAreUnlocked){
		if(this.unlockedAbilities.length > 0){
			this.abilitiesAreUnlocked = true;
			$("#abilities").show();
		}
	}
	this.updateAbilities();
	
	var displayName = this.name;
	if(this.destroyed){
		var displayName = this.name + " (Destroyed)";
	}
	var actionsNameElement = $("#"+this.actionsElementId+" .monster-name");
	if(actionsNameElement.text() != displayName){
		actionsNameElement	 .text(displayName);
	}
	var profileNameElement = $("#"+this.profileElementId+" .monster-name");
	if(profileNameElement.text() != displayName){
		profileNameElement.text(displayName);
	}
	
	var displayType = this.primaryTemplate.name;
	if(this.secondaryTemplate){
		displayType += "/"+this.secondaryTemplate.name;
	}
	var profileTypeElement = $("#"+this.profileElementId+" .monster-type");
	if(profileTypeElement.text() != displayType){
		profileTypeElement.text(displayType);
	}
}

Monster.prototype.kill = function(){
	this.destroyed = true;
	addLog('red', this.name + ' was destroyed!');
	if(null != this.abilityTraining){
		abilities[this.abilityTraining].cancelTraining(this);
	}
	if(null != this.actionRunning){
		actions[this.actionRunning].cancel(this);
	};
}

Monster.prototype.consume = function(enemy){
	if('minion' == enemy.type){
		gainSpirit(100);
	}else if('boss' == enemy.type){
		gainSpirit(100);
		// Do nothing more if we already have a secondary template
		if(this.secondaryTemplate){return;}
		// Otherwise, gain a secondary template
		this.secondaryTemplateId = enemy.monsterTemplateId;
		this.secondaryTemplate = monsterTemplates[this.secondaryTemplateId];
		addLog("green", this.name+" gained additional monster type "+this.secondaryTemplate.name);
	}
}