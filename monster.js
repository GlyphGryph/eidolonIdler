// Mandatory arguments
// id
// name
// abilities
var Monster = function(definition){
	this.name = definition.name;
	
	// Actions
	this.actionRunningDuration = definition.actionRunningDuration || 0;
	this.actionRunning = definition.actionRunning || null;
	this.actionsElementId = definition.id + '-family';
	this.profileElementId = definition.id + '-monster-profile';
	this.actionsAreBusy = definition.actionsAreBusy || false;
	this.unlockedActions = definition.unlockedActions || [
		'huntWisp',
		'fakeAction'
	];
	this.lockedActions = definition.lockedActions || [
	]
	
	// Abilities
	this.abilitiesAreUnlocked = definition.abilitiesAreUnlocked || false;
	this.abilitiesAreTraining = definition.abilitiesAreTraining || false;
	this.abilityTraining = definition.abilityTraining || null;
	this.abilityTrainingDuration = definition.abilityTrainingDuration || 0;
	this.unlockedAbilities = definition.unlockedAbilities || [],
	this.lockedAbilities = definition.abilities;
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
	var monsterActionsElement = $("#action-family-template").clone();
	monsterActionsElement.attr('id', this.actionsElementId);
	monsterActionsElement.find('.name').text(this.name);
	$("#action-view").append(monsterActionsElement);
		
	var monsterProfileElement = $("#monster-profile-template").clone();
	monsterProfileElement.attr('id', this.profileElementId);
	monsterProfileElement.find('.monster-name').text(this.name);
	$("#monster-view").append(monsterProfileElement);
}

Monster.prototype.update = function(){
	if(!this.abilitiesAreUnlocked){
		if(this.unlockedAbilities.length > 0){
			this.abilitiesAreUnlocked = true;
			$("#abilities").show();
		}
	}	
}