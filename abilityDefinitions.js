var abilities = {};

abilities.sharedHealing = new Ability({
	id: 'sharedHealing',
	name: 'Shared Healing',
	description: "While The Orphan is damaged, some of the spirit gained by this monster will be siphoned off to heal them.",
	unlockedConditionsMet: function(context){
		return context.stats.bond.level >= 1;
	},
	trainTime: 500
});
	
abilities.fakeAbility = new Ability({
	id: 'fakeAbility',
	name: 'Test Ability #1',
	description: "Does nothing.",
	unlockedConditionsMet: function(context){
		return context.stats.bond.level >= 1;
	},
	trainTime: 5000
});

abilities.fakeAbility2 = new Ability({
	id: 'fakeAbility2',
	name: 'Test Ability #2',
	description: "Does nothing.",
	unlockedConditionsMet: function(context){
		return context.stats.bond.level >= 1;
	},
	trainTime: 5000
});

abilities.assist = new Ability({
	id: 'assist',
	name: 'Assist',
	description: "When this monster isn't doing an action of their own, they help the Orphan complete their actions faster.",
	unlockedConditionsMet: function(context){
		return context.stats.intellect.level >= 2;
	},
	trainTime: 500
});