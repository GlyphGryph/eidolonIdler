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
	domesticBoss: new MonsterTemplate({
 		id: 'domesticBoss',
		name: "Domestic Boss",
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
		this.monsterTemplateId = definition.monsterTemplateId;
	}
}

var enemyTemplates = {
	basicBoss: new EnemyTemplate({
		id: 'basicBoss',
		name: 'Basic Boss',
		type: 'boss',
		monsterTemplateId: "domesticBoss"
	}),
	basicMinion: new EnemyTemplate({
		id: 'basicMinion',
		name: 'Basic Minion',
		type: 'minion'
	})
}