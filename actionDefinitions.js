var actions = {};

// Monster Actions
actions.huntWisp = new Action({
	id: 'huntWisp',
	name: "Hunt Wisp",
	description: "Hunt for wild wisps to gain Spirit.",
	runTime: 100,
	unlockedConditionsMet: function(context){ return true; },
	start: function(context){
		addLog('green', "Monster starts hunting Wisps");
	},
	finish: function(context){
		gainSpirit(2);
		addLog('green', "Monster caught a Wisp.");
	}
});
actions.ressurect = new Action({
	id: 'ressurect',
	name: "Ressurect",
	description: "Return to life, at the cost of a human's well-being.",
	runTime: 100,
	unlockedConditionsMet: function(context){ return true; },
	start: function(context){
		addLog('green', "Monster starts hunting Wisps");
	},
	finish: function(context){
		context.destroyed = false;
		state.character.kill(context.totalLevels());
		addLog('green', "Monster caught a Wisp.");
	}
});
actions.fakeAction = new Action({
	id: 'fakeAction',
	name: "Fake Action",
	description: "--",
	runTime: 5000,
	unlockedConditionsMet: function(context){ return true; },
	start: function(context){
		addLog('green', "Fake Action started");
	},
	finish: function(context){	
		gainSpirit(2);
		addLog('green', "Fake Action finished.");
	}
})

// Character Actions
actions.explore = new Action({
	id: 'explore',
	name: "Explore",
	description: "--",
	unlockedConditionsMet: function(context){ return context.diminished <= 0},
	runTime: 100,
	start: function(context){
		addLog('red', "Exploring region...");
	},
	finish: function(context){
		exploreRegion();
		addLog('red', "Explored region.");
	}
});
actions.care = new Action({
	id: 'care',
	name: "Care",
	description: "--",
	unlockedConditionsMet: function(context){ return context.diminished <= 0},
	runTime: 2000,
	start: function(context){
		addLog('green', "Fake Action started");
	},
	finish: function(context){
		state.resources.affection.change(1);
		addLog('green', "Fake Action finished.");
	}
});