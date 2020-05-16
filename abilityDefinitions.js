var abilities = {};

abilities.sharedHealing = new Ability({
	id: 'sharedHealing',
	name: 'Shared Healing',
	description: "While The Orphan is damaged, some of the spirit gained by this monster will be siphoned off to heal them.",
	unlockedConditionsMet: function(){
		return monster.stats.bond.level >= 1;
	},
	trainTime: 500
});
	
abilities.fakeAbility = new Ability({
	id: 'fakeAbility',
	name: 'Jump Boost',
	description: "Does nothing.",
	unlockedConditionsMet: function(){
		return monster.stats.bond.level >= 1;
	},
	trainTime: 5000
});

abilities.assist = new Ability({
	id: 'assist',
	name: 'Assist',
	description: "When this monster isn't doing an action of their own, they help the Orphan complete their actions faster.",
	unlockedConditionsMet: function(){
		return monster.stats.intellect.level >= 2;
	},
	trainTime: 500
});