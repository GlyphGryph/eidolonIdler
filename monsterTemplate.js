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
	desireBoss: new EnemyTemplate({
		id: 'desireBoss',
		name: 'Desire Boss',
		type: 'boss',
		monsterTemplateId: "domesticBoss"
	}),
	desireMinion: new EnemyTemplate({
		id: 'desireMinion',
		name: 'Desire Minion',
		type: 'minion'
	}),
	faithBoss: new EnemyTemplate({
		id: 'faithBoss',
		name: 'Faith Boss',
		type: 'boss',
		monsterTemplateId: "domesticBoss"
	}),
	faithMinion: new EnemyTemplate({
		id: 'faithMinion',
		name: 'Faith Minion',
		type: 'minion'
	})
}