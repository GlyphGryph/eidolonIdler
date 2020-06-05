var MonsterTemplate = function(definition){
	this.id = definition.id;
	this.name = definition.name;
	this.actions = definition.actions;
	this.abilities = definition.abilities;
}

var monsterTemplates = {
	genericMonster: new MonsterTemplate({
 		id: 'genericMonster',
		name: "Generic Monster",
		actions: [
			'huntWisp',
			'fakeAction',
			'ressurect'
		],
		abilities: [
			'sharedHealing',
			'assist'
		]
	}),
	genericMonster: new MonsterTemplate({
 		id: 'genericMonster',
		name: "Generic Monster",
		actions: [
			'huntWisp',
			'fakeAction',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	})
}

var EnemyTemplate = function(definition){
	this.id = definition.id;
	this.type = definition.type;
	this.name = definition.name;
	if('boss' == this.type){
		this.monster = definition.monster;
	}
}

var enemyTemplates = {
	basicBoss: new EnemyTemplate({
		id: 'basicBoss',
		name: 'Basic Boss',
		type: 'boss',
		monster: "domesticBoss"
	}),
	basicMinion: new EnemyTemplate({
		id: 'basicMinion',
		name: 'Basic Minion',
		type: 'minion'
	})
}