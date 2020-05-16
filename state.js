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

var unlockedResources = [
]

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