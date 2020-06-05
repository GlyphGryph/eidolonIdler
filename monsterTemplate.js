var monsterTemplate = function(definition){
	this.id = definition.id;
	this.name = definition.name;
	this.actions = definition.actions;
	this.abilities = definition.abilities;
}

var monsterTemplates = {
	genericMonster: new monsterTemplate({
 		id: 'genericMonster',
		name: "Generic Monster",
		actions: [
			'huntWisp',
			'fakeAction',
			'ressurect'
		],
		abilities: [
			'sharedHealing',
			'fakeAbility',
			'assist'
		]
	})
}