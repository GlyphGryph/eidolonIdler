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
	'blackenedWasteland',
	'tangledJungle',
	'forgottenVillage'
];
var regions = {
	blackenedWasteland: {
		id: "blackenedWasteland",
		elementId: "blackened-wasteland-region",
		name: "Blackened Wasteland",
		description: "A barren, burnt wasteland, the spirits here are sparse and weak. Something terrible must have happened here long ago.",
		size: 8,
		awareness: 0,
		unlockedConditionsMet: function(){ return (regions.blackenedWasteland.awareness > 0); },
		discoveries: {
			2: function(){addLog('purple', "You discover a skeleton in a tattered uniformcarrying an old scabbard. The sword is nowhere to be found.");},
			3: function(){addLog('purple', "You discover another skeleton in bleached rags. A broken music box is clasped in its hand.");},
			4: function(){addLog('purple', "You discover an exit that leads to the Tangled Jungle!");},
			8: function(){addLog('purple', "You discover an exit that leads to the Forgotten Village!");},
		},
		travel: {
			shouldStart: false,
			traveling: 0,
			travelTime: 1000,
			description: function(){
				that = regions.blackenedWasteland;
				var txt="<div>Time to Travel to this location: "+that.travel.travelTime/1000+" seconds.</div>";
				if(monster.actionsAreBusy || character.actionsAreBusy){
					txt+="<div>You or one of your monsters are too busy to travel. Wait until all actions have been completed.</div>";
				}
				return txt;
			}
		}
	},
	tangledJungle: {
		id: "tangledJungle",
		elementId: "tangled-jungle-region",
		name: "Tangled Jungle",
		description: "A dense, dark jungle, full of clinging vines and sharp thorns. No animal or insect life can be seen or heard.",
		size: 1,
		awareness: 0,
		unlockedConditionsMet: function(){ return (regions.blackenedWasteland.awareness == 4); },
		discoveries: {
		},
		travel: {
			shouldStart: false,
			traveling: 0,
			travelTime: 1000,
			description: function(){
				that = regions.blackenedWasteland;
				var txt="<div>Time to Travel to this location: "+that.travel.travelTime/1000+" seconds.</div>";
				if(monster.actionsAreBusy || character.actionsAreBusy){
					txt+="<div>You or one of your monsters are too busy to travel. Wait until all actions have been completed.</div>";
				}
				return txt;
			}
		}
	},
	forgottenVillage: {
		id: "forgottenVillage",
		elementId: "forgotten-village-region",
		name: "Forgotten Village",
		description: "A small burned out and abandoned village, dominated by a large central chapel.",
		size: 1,
		awareness: 0,
		unlockedConditionsMet: function(){ return (regions.blackenedWasteland.awareness == 8); },
		discoveries: {
		},
		travel: {
			shouldStart: false,
			traveling: 0,
			travelTime: 1000,
			description: function(){
				that = regions.blackenedWasteland;
				var txt="<div>Time to Travel to this location: "+that.travel.travelTime/1000+" seconds.</div>";
				if(monster.actionsAreBusy || character.actionsAreBusy){
					txt+="<div>You or one of your monsters are too busy to travel. Wait until all actions have been completed.</div>";
				}
				return txt;
			}
		}
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
				exploreRegion();
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
			maxLevel: 3,
			unlockedConditionsMet: function(){true},
			upgrade: {
				elementId: 'bond-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.bond.level },
				affectionCost: function(){ return monster.stats.bond.level },
				description: function(){
					if(monster.stats.bond.level == monster.stats.bond.maxLevel){ return "At Max Level" };
					var txt = "Cost is "+monster.stats.bond.upgrade.spiritCost()+" Spirit";
					if(monster.stats.bond.upgrade.affectionCost() > 0){
						txt += " and "+monster.stats.bond.upgrade.affectionCost()+" Love";
					}
					return txt;
				}
			}
		},
		will: {
			id: 'will',
			elementId: 'will-stat',
			name: "Will",
			description: "--",
			level: 1,
			maxLevel: 3,
			unlockedConditionsMet: function(){ return monster.stats.bond.level > 0},
			upgrade: {
				elementId: 'will-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.will.level },
				affectionCost: function(){ return monster.stats.will.level },
				description: function(){
					if(monster.stats.will.level == monster.stats.will.maxLevel){ return "At Max Level" };
					var txt = "Cost is "+monster.stats.will.upgrade.spiritCost()+" Spirit";
					if(monster.stats.will.upgrade.affectionCost() > 0){
						txt += " and "+monster.stats.will.upgrade.affectionCost()+" Love";
					}
					return txt;
				}
			}
		},
		intellect: {
			id: 'intellect',
			elementId: 'intellect-stat',
			name: "Intellect",
			description: "--",
			level: 1,
			maxLevel: 3,
			unlockedConditionsMet: function(){ return monster.stats.bond.level > 0},
			upgrade: {
				elementId: 'intellect-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.intellect.level },
				affectionCost: function(){ return monster.stats.intellect.level },
				description: function(){
					if(monster.stats.intellect.level == monster.stats.intellect.maxLevel){ return "At Max Level" };
					var txt = "Cost is "+monster.stats.intellect.upgrade.spiritCost()+" Spirit";
					if(monster.stats.intellect.upgrade.affectionCost() > 0){
						txt += " and "+monster.stats.intellect.upgrade.affectionCost()+" Love";
					}
					return txt;
				}
			}
		},
		power: {
			id: 'power',
			elementId: 'power-stat',
			name: "Power",
			description: "--",
			level: 1,
			maxLevel: 3,
			unlockedConditionsMet: function(){ return monster.stats.bond.level > 0},
			upgrade: {
				elementId: 'power-upgrade',
				spiritCost: function(){ return 4+4*upgradeMultiplier()+2*monster.stats.power.level },
				affectionCost: function(){ return monster.stats.power.level },
				description: function(){
					if(monster.stats.power.level == monster.stats.power.maxLevel){ return "At Max Level" };
					var txt = "Cost is "+monster.stats.power.upgrade.spiritCost()+" Spirit";
					if(monster.stats.power.upgrade.affectionCost() > 0){
						txt += " and "+monster.stats.power.upgrade.affectionCost()+" Love";
					}
					return txt;
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