var actions = {};

// Monster Actions
actions.huntWisp = new Action({
	id: 'huntWisp',
	name: "Hunt Wisp",
	description: "Hunt for wild wisps to gain Spirit.",
	runTime: 100,
	unlockedConditionsMet: function(){ return true; },
	start: function(){
		addLog('green', "Monster starts hunting Wisps");
	},
	finish: function(){
		gainSpirit(2);
		addLog('green', "Monster caught a Wisp.");
	}
});
actions.fakeAction = new Action({
	id: 'fakeAction',
	name: "Fake Action",
	description: "--",
	runTime: 1000,
	unlockedConditionsMet: function(){ return true; },
	start: function(){
		addLog('green', "Fake Action started");
	},
	finish: function(){
		addLog('green', "Fake Action finished.");
	}
})

// Character Actions
actions.explore = new Action({
	id: 'explore',
	name: "Explore",
	description: "--",
	unlockedConditionsMet: function(){ return character.diminished <= 0},
	runTime: 100,
	start: function(){
		addLog('red', "Exploring region...");
	},
	finish: function(){
		exploreRegion();
		addLog('red', "Explored region.");
	}
});
actions.care = new Action({
	id: 'care',
	name: "Care",
	description: "--",
	unlockedConditionsMet: function(){ return character.diminished <= 0},
	runTime: 2000,
	start: function(){
		addLog('green', "Fake Action started");
	},
	finish: function(){
		resources.affection.change(1);
		addLog('green', "Fake Action finished.");
	}
});