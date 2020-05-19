// Mandatory arguments
// id
// name
// abilities
//
// Form of stats in definition: {bond: value, will: value, intellect: value, power: value}
var Monster = function(definition){
	this.name = definition.name;
	
	// Actions
	this.actionRunningDuration = definition.actionRunningDuration || 0;
	this.actionRunning = definition.actionRunning || null;
	this.id = definition.id;
	this.actionsElementId = this.id + '-action-family';
	this.profileElementId = this.id + '-monster-profile';
	this.actionsAreBusy = definition.actionsAreBusy || false;
	this.unlockedActions = definition.unlockedActions || [
		'huntWisp',
		'fakeAction'
	];
	this.lockedActions = definition.lockedActions || [];
	
	// Abilities
	this.abilitiesAreUnlocked = definition.abilitiesAreUnlocked || false;
	this.abilitiesAreTraining = definition.abilitiesAreTraining || false;
	this.abilityTraining = definition.abilityTraining || null;
	this.abilityTrainingDuration = definition.abilityTrainingDuration || 0;
	this.unlockedAbilities = definition.unlockedAbilities || [];
	this.lockedAbilities = definition.lockedAbilities;
	this.activeAbilities = definition.activeAbilities || [];
	this.trainedAbilities = definition.trainedAbilities || [];
	
	// Stats
	this.unlockedStats = definition.unlockedStats || [
		'bond'
	];
	this.lockedStats = definition.lockedStats || [
		'will',
		'intellect',
		'power'
	];
	if(definition.stats){
		this.stats = {
			bond: new BondStat(this, definition.stats.bond),
			will: new WillStat(this, definition.stats.will),
			intellect: new IntellectStat(this, definition.stats.intellect),
			power: new PowerStat(this, definition.stats.power),
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
	actionsElement.find('.name').text(this.name);
	$("#action-view").append(actionsElement);
		
	var profileElement = $("#monster-profile-template").clone();
	profileElement.attr('id', this.profileElementId);
	profileElement.find('.monster-name').text(this.name);
	$("#monster-view").append(profileElement);
}

Monster.prototype.update = function(){
	if(!this.abilitiesAreUnlocked){
		if(this.unlockedAbilities.length > 0){
			this.abilitiesAreUnlocked = true;
			$("#abilities").show();
		}
	}	
}