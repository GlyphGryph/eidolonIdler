var Monster = function(definition){
	this.name = definition.name;
	
	// Actions
	this.actionRunningDuration = 0;
	this.actionRunning = null;
	this.actionsElementId = definition.id + '-family';
	this.profileElementId = definition.id + '-monster-profile';
	this.actionsAreBusy = false;
	this.unlockedActions = [
		'huntWisp',
		'fakeAction'
	];
	this.lockedActions = [
	]
	
	// Abilities
	this.abilitiesAreUnlocked = false;
	this.abilitiesAreTraining = false;
	this.abilityTraining = null;
	this.abilityTrainingDuration = 0;
	this.unlockedAbilities = [
	],
	this.lockedAbilities = definition.abilities;
	this.activeAbilities = [];
	this.trainedAbilities = [];
	
	// Stats
	this.unlockedStats = [
		'bond'
	];
	this.lockedStats = [
		'will',
		'intellect',
		'power'
	];
	this.stats = {
		bond: new BondStat(this, 0),
		will: new WillStat(this, 1),
		intellect: new IntellectStat(this, 1),
		power: new PowerStat(this, 1),
	};
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