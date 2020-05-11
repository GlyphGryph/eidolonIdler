var state = {
	currentTime: null,
	lastTime: null,
	timeSinceLastUpdate: null,
	selectedTab: 'action'
};

var log = [];

var gameProgress = {
	tabsUnlocked: false,
}

var resources = {
	monsterSpirit: {
		id: 'monster-spirit',
		name: "Spirit",
		value: 0,
		visible: false
	}
}

var monster = {
	unlockedAbilities:[
	],
	lockedAbilities:[
		'sharedHealing'
	],
	abilities: {
		sharedHealing: {
			id: 'sharedHealing',
			elementId: 'shared-healing-ability',
			name: 'Shared Healing',
			description: "Some of the Spirit you earn from hunting goes to heal your Orphan.",
			locked: true,
			unlockedConditionsMet: function(){
				return monster.stats.bond.level >= 1;
			},
			level: 0,
			maxLevel: 1,
			active: false,
			upgrade: {
				elementId: 'bond-upgrade',
				spiritCost: 0,
				shouldStart: false,
				running: 0,
				runTime: 100,
				progressBarElement: $("#templates .progress-bar").clone(),
				start: function(){
					addLog('green', "Fake Action started");
				},
				finish: function(){
					addLog('green', "Fake Action finished.");
				}				
			}
		}
	},
	unlockedStats:[
		'bond'
	],
	lockedStats:[
		'will',
		'intellect',
		'power'
	],
	stats: {
		bond: {
			id: 'bond',
			elementId: 'bond-stat',
			name: 'Bond',
			description: "Strengthens the connection between a character and their monster.",
			level: 0,
			maxLevel: 1,
			unlockedConditionsMet: function(){true},
			upgrade: {
				elementId: 'bond-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.bond.level },
				specialCostType: 'monsterSpirit',
				specialCost: function(){ return 0 },
				description: function(){
					if(monster.stats.bond.level == monster.stats.bond.maxLevel){ return "At Max Level" };
					return "Cost is "+monster.stats.bond.upgrade.spiritCost()+" Spirit";
				}
			}
		},
		will: {
			id: 'will',
			elementId: 'will-stat',
			name: "Will",
			description: "--",
			level: 0,
			maxLevel: 1,
			unlockedConditionsMet: function(){ return monster.stats.bond.level > 0},
			upgrade: {
				elementId: 'will-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.will.level },
				specialCostType: 'monsterSpirit',
				specialCost: function(){ return 0 },
				description: function(){
					if(monster.stats.will.level == monster.stats.will.maxLevel){ return "At Max Level" };
					return "Cost is "+monster.stats.will.upgrade.spiritCost()+" Spirit";
				}
			}
		},
		intellect: {
			id: 'intellect',
			elementId: 'intellect-stat',
			name: "Intellect",
			description: "--",
			level: 0,
			maxLevel: 1,
			unlockedConditionsMet: function(){ return monster.stats.bond.level > 0},
			upgrade: {
				elementId: 'intellect-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.intellect.level },
				specialCostType: 'monsterSpirit',
				specialCost: function(){ return 0 },
				description: function(){
					if(monster.stats.intellect.level == monster.stats.intellect.maxLevel){ return "At Max Level" };
					return "Cost is "+monster.stats.intellect.upgrade.spiritCost()+" Spirit";
				}
			}
		},
		power: {
			id: 'power',
			elementId: 'power-stat',
			name: "Power",
			description: "--",
			level: 0,
			maxLevel: 1,
			unlockedConditionsMet: function(){ return monster.stats.bond.level > 0},
			upgrade: {
				elementId: 'power-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.power.level },
				specialCostType: 'monsterSpirit',
				specialCost: function(){ return 0 },
				description: function(){
					if(monster.stats.power.level == monster.stats.power.maxLevel){ return "At Max Level" };
					return "Cost is "+monster.stats.power.upgrade.spiritCost()+" Spirit";
				}
			}
		}
	}
}

var actions = {
	huntWisp: {
		id: 'hunt-wisp',
		family: 'monster',
		description: "Hunt for wild wisps to gain Spirit.",
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 100,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Monster starts hunting Wisps");
		},
		finish: function(){
			changeResource('monsterSpirit', 2);
			addLog('green', "Monster caught a Wisp.");
		}
	},
	fakeAction: {
		id: 'fake-action',
		family: 'monster',
		description: "--",
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 1000,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Fake Action started");
		},
		finish: function(){
			addLog('green', "Fake Action finished.");
		}
	},
	explore: {
		id: 'explore',
		family: 'character',
		description: "--",
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 100,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Fake Action started");
		},
		finish: function(){
			addLog('green', "Fake Action finished.");
		}
	},
	care: {
		id: 'care',
		family: 'character',
		description: "--",
		visible: true,
		shouldStart: false,
		running: 0,
		runTime: 100,
		progressBarElement: $("#templates .progress-bar").clone(),
		start: function(){
			addLog('green', "Fake Action started");
		},
		finish: function(){
			addLog('green', "Fake Action finished.");
		}
	}
};

var actionFamilies = {
	monster: {
		id: 'monster-family',
		visible: true,
		busy: false,
		actions: ['huntWisp', 'fakeAction']
	},
	character: {
		id: 'character-family',
		visible: false,
		actions: ['explore', 'care']
	}
};