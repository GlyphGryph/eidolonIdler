var state = {
	currentTime: null,
	lastTime: null,
	timeSinceLastUpdate: null,
	selectedTab: 'action'
};

var log = [];

var gameProgress = {
	tabsAreUnlocked: false,
	orphanIsUnlocked: false,
	regionsAreUnlocked: false
}

var resources = {
	monsterSpirit: {
		id: 'monster-spirit',
		name: "Spirit",
		value: 0,
		visible: false
	},
	affection: {
		id: 'monster-affection',
		name: "Love",
		value: 0,
		visible: false
	}
}

var currentRegion = "blackenedWasteland";
var unlockedRegions = [];
var lockedRegions = [
	'blackenedWasteland'
];
var regions = {
	blackenedWasteland: {
		id: "blackenedWasteland",
		elementId: "blackened-wasteland-region",
		name: "Blackened Wasteland",
		description: "A barren wasteland, the spirits here are sparse and weak. Something terrible must have happened here long ago.",
		size: 4,
		awareness: 0,
		unlockedConditionsMet: function(){ return (regions.blackenedWasteland.awareness > 0); },
	}
};

var character = {
	name: "Wayward Orphan",
	diminished: 3,
	actionsElementId: 'character-family',
	actionsAreBusy: false,
	unlockedActions:[],
	lockedActions:[
		'explore',
		'care'
	],
	actions: {
		explore: {
			id: 'explore',
			elementId: 'explore-action',
			name: "Explore",
			description: "--",
			unlockedConditionsMet: function(){ return character.diminished <= 0},
			visible: true,
			shouldStart: false,
			running: 0,
			runTime: 100,
			start: function(){
				addLog('red', "Exploring region...");
			},
			finish: function(){
				reg = regions[currentRegion];
				if(reg.awareness < reg.size){
					reg.awareness+=1;
				}
				addLog('red', "Explored region.");
			}
		},
		care: {
			id: 'care',
			elementId: 'care-action',
			name: "Care",
			description: "--",
			unlockedConditionsMet: function(){ return character.diminished <= 0},
			visible: true,
			shouldStart: false,
			running: 0,
			runTime: 2000,
			start: function(){
				addLog('green', "Fake Action started");
			},
			finish: function(){
				changeResource('affection', 1);
				addLog('green', "Fake Action finished.");
			}
		}
	}
}

var monster = {
	name: 'Monster',
	maxActiveAbilities: function(){ return monster.stats.intellect.level; },
	abilitiesAreUnlocked: false,
	abilitiesAreTraining: false,
	unlockedAbilities:[
	],
	lockedAbilities:[
		'sharedHealing',
		'fakeAbility',
		'assist'
	],
	activeAbilities: [],
	abilities: {
		sharedHealing: {
			id: 'sharedHealing',
			elementId: 'shared-healing-ability',
			name: 'Shared Healing',
			description: "While The Orphan is damaged, some of the spirit gained by this monster will be siphoned off to heal them.",
			locked: true,
			unlockedConditionsMet: function(){
				return monster.stats.bond.level >= 1;
			},
			trained: false,
			active: false,
			canBeTrained: function(){
				return !monster.abilities.sharedHealing.trained;
			},
			upgrade: {
				elementId: 'shared-healing-train',
				description:  function(){
					return "Cost: 0 spirit. Takes "+monster.abilities.sharedHealing.upgrade.runTime/1000+" seconds.";
				},
				cost: [],
				shouldStart: false,
				running: 0,
				runTime: 500,
				start: function(){
					addLog('green', "Started training Shared Healing.");
				},
				finish: function(){
					addLog('green', "Finished training Shared Healing.");
				}				
			}
		},
		fakeAbility: {
			id: 'fakeAbility',
			elementId: 'fake-ability',
			name: 'Jump Boost',
			description: "Does nothing.",
			locked: true,
			unlockedConditionsMet: function(){
				return monster.stats.bond.level >= 1;
			},
			trained: false,
			active: false,
			canBeTrained: function(){
				return !monster.abilities.fakeAbility.trained;
			},
			upgrade: {
				elementId: 'fake-ability-train',
				description:  function(){
					return "Cost: 0 spirit. Takes "+monster.abilities.fakeAbility.upgrade.runTime/1000+" seconds.";
				},
				cost: [],
				shouldStart: false,
				running: 0,
				runTime: 5000,
				start: function(){
					addLog('green', "Started training Fake Ability.");
				},
				finish: function(){
					addLog('green', "Finished training Fake Ability.");
				}				
			}
		},
		assist: {
			id: 'assist',
			elementId: 'assist-ability',
			name: 'Assist',
			description: "When this monster isn't doing an action of their own, they help the Orphan complete their actions faster.",
			locked: true,
			unlockedConditionsMet: function(){
				return monster.stats.intellect.level >= 2;
			},
			trained: false,
			active: false,
			canBeTrained: function(){
				return !monster.abilities.assist.trained;
			},
			upgrade: {
				elementId: 'assist-train',
				description: function(){
					return "Cost: 0 spirit. Takes "+monster.abilities.assist.upgrade.runTime/1000+" seconds.";
				},
				cost: [],
				shouldStart: false,
				running: 0,
				runTime: 500,
				start: function(){
					addLog('green', "Started training Assist.");
				},
				finish: function(){
					addLog('green', "Finished training Assist.");
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
			level: 1,
			maxLevel: 2,
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
			level: 1,
			maxLevel: 2,
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
			level: 1,
			maxLevel: 2,
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
	},
	actionsElementId: 'monster-family',
	actionsAreBusy: false,
	unlockedActions:[
		'huntWisp',
		'fakeAction'
	],
	lockedActions:[
	],
	actions: {
		huntWisp: {
			id: 'huntWisp',
			elementId: 'hunt-wisp-action',
			name: "Hunt Wisp",
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
				gainSpirit(2);
				addLog('green', "Monster caught a Wisp.");
			}
		},
		fakeAction: {
			id: 'huntWisp',
			elementId: 'fake-action',
			name: "Fake Action",
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
	}
};