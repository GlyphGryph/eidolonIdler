var Stat = function(id, owner, level, maxLevel){
	this.id = id;
	this.owner = owner;
	this.level = level;
	this.maxLevel = maxLevel;
	this.elementId = this.id + '-stat-for-' + this.owner.profileElementId;
	this.upgradeElementId = this.id + '-upgrade-for-' + this.owner.profileElementId;
	this.upgradeCost = [
		['spirit', function(stat){ return 4+4*stat.upgradeMultiplier()+2*stat.level; }],
		['affection', function(stat){ return stat.level; }]
	]
}

Stat.prototype.upgradeMultiplier = function(){
	// We don't count the first three levels into the multiplier
	var levels = this.owner.totalLevels()-3;
	if( levels < 0){
		return 0
	}else{
		return levels;
	}
}

Stat.prototype.upgradeDescription = function(){
	var that = this;
	if(this.level == this.maxLevel){
		return "At Max Level"
	};
	
	var body = "<p>Cost is:</p>"
	this.upgradeCost.forEach( function(costPair){
		resource = state.resources[costPair[0]];
		body += resource.name+": "+costPair[1](that)+"<br />";
	});
	return body;
}

Stat.prototype.canBeUpgraded = function(){
	var that = this;
	var canBe = true;
	this.upgradeCost.forEach( function(costPair){
		resource = state.resources[costPair[0]];
		needs = costPair[1](that);
		if(resource.value < needs){
			canBe = false;
		}
	});
	if(!this.owner.isAlive()){
		canBe = false;
	}
	return canBe;
};

Stat.prototype.unlock = function(){
	this.owner.lockedStats = removeFromArray(this.owner.lockedStats, this.id);
	this.owner.unlockedStats.push(this.id);
	this.setup();
	addLog('black', "Stat "+this.name+" unlocked.");
};


Stat.prototype.setup = function(){
	var that = this;
	var statElement = $("#stat-template").clone();
	statElement.attr('id', this.elementId);
	statElement.find('#upgrade-template').attr('id', this.upgradeElementId);
	statElement.find('.name').text(this.name);
	$("#"+this.owner.profileElementId+" .monster-stats").append(statElement);
	$("#"+this.elementId+" .name").mouseenter(function(){openDescription(this, that.description())});
	$("#"+this.elementId+" .name").mouseleave(closeDescription);
	$("#"+this.upgradeElementId).mouseenter(function(){openDescription(this, that.upgradeDescription())});
	$("#"+this.upgradeElementId).mouseleave(closeDescription);
	$("#"+this.upgradeElementId).click(function(){that.upgrade()});
};


Stat.prototype.upgrade = function(){
	var that = this;
	if(this.canBeUpgraded()){
		this.upgradeCost.forEach( function(costPair){
			resource = state.resources[costPair[0]];
			needs = costPair[1](that);
			resource.value -= needs;
		});
		this.level += 1;
		addLog('black', "Upgraded "+this.name+" to level "+this.level);
		openDescription($("#"+this.upgradeElementId), this.upgradeDescription());
	}
}

Stat.prototype.update = function(){
	var statElement = $("#"+this.elementId);
	var levelElement = statElement.find('.level');
	var maxLevelElement = statElement.find('.max-level');
	if(levelElement.html()!=this.level.toString){
		levelElement.html(this.level);
	}
	if(maxLevelElement.html()!=this.maxLevel.toString){
		maxLevelElement.html(this.maxLevel);
	}
	if(this.level==this.maxLevel || !this.canBeUpgraded()){
		statElement.find('.upgrade-button button').prop('disabled', true);
	} else {
		statElement.find('.upgrade-button button').prop('disabled', false);	
	}
};


var BondStat = function(owner, level){
	Stat.call(this, 'bond', owner, level, 3);
	this.name = 'Bond';
	this.description = function(){ return "The connection between a person and their monster, a strong bond unlocks many opportunities for growth."};
	this.unlockedConditionsMet = function(){true};
}

BondStat.prototype = Object.create(Stat.prototype);
BondStat.prototype.constructor = BondStat;

var WillStat = function(owner, level){
	Stat.call(this, 'will', owner, level, 3);
	this.name = 'Will';
	this.description = function(){ return "A monster's persistence and resilience, their ability to keep going when things get difficult."};
	this.unlockedConditionsMet = function(){ return owner.stats.bond.level > 0};
}

WillStat.prototype =  Object.create(Stat.prototype);
WillStat.prototype.constructor = WillStat;

var PowerStat = function(owner, level){
	Stat.call(this, 'power', owner, level, 3);
	this.name = 'Power';
	this.description = function(){ return "A more powerful monster is simply better at doing things, and a powerful monster excels at direct confrontation."};
	this.unlockedConditionsMet = function(){ return owner.stats.bond.level > 0};
}

PowerStat.prototype = Object.create(Stat.prototype);
PowerStat.prototype.constructor = PowerStat;

var IntellectStat = function(owner, level){
	Stat.call(this, 'intellect', owner, level, 3);
	this.name = 'Intellect';
	this.description = function(){ return "The higher a monsters intellect, the more abilities they can make use of at once."};
	this.unlockedConditionsMet = function(){ return owner.stats.bond.level > 0};
}

IntellectStat.prototype = Object.create(Stat.prototype);	
IntellectStat.prototype.constructor = IntellectStat;