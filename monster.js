var Monster = function(state){
	this.name = 'Monster';
	
	// Actions
	this.actionRunningDuration = 0;
	this.actionRunning = null;
	this.actionsElementId = 'monster-family',
	this.actionsAreBusy = false;
	this.unlockedActions = [
		'huntWisp',
		'fakeAction'
	];
	this.lockedActions = [
	]
	
	// Abilities
	this.maxActiveAbilities = function(){ return monster.stats.intellect.level; };
	this.abilitiesAreUnlocked = false;
	this.abilitiesAreTraining = false;
	this.abilityTraining = null;
	this.abilityTrainingDuration = 0;
	this.unlockedAbilities = [
	],
	this.lockedAbilities = [
		'sharedHealing',
		'fakeAbility',
		'assist'
	],
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
Monster.prototype.totalLevels = function(){
	var total = 0;
	$.each(this.stats, function(key, monsterStat){
		total += monsterStat.level;
	});
	return total;
}

var monster = new Monster({});