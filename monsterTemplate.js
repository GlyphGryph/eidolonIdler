var MonsterTemplate = function(definition){
	this.id = definition.id;
	this.name = definition.name;
	this.actions = definition.actions;
	this.abilities = definition.abilities;
	this.type = definition.type;
}

var monsterTemplates = {
	genericMonster: new MonsterTemplate({
 		id: 'genericMonster',
		name: "Generic Monster",
		type: 'bond',
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
		type: 'bond',
		actions: [
			'huntWisp',
			'fakeAction',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	}),
	domesticDesire: new MonsterTemplate({
 		id: 'domesticDesire',
		name: "Domestic Desire",
		type: 'desire',
		actions: [
			'huntWisp',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	}),
	domesticFaith: new MonsterTemplate({
 		id: 'domesticFaith',
		name: "Domestic Faith",
		type: 'faith',
		actions: [
			'huntWisp',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	}),
	domesticFear: new MonsterTemplate({
 		id: 'domesticFear',
		name: "Domestic Fear",
		type: 'fear',
		actions: [
			'huntWisp',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	}),
	domesticPersistence: new MonsterTemplate({
 		id: 'domesticPersistence',
		name: "Domestic Persistence",
		type: 'persistence',
		actions: [
			'huntWisp',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	}),
	domesticStrength: new MonsterTemplate({
 		id: 'domesticStrength',
		name: "Domestic Strength",
		type: 'strength',
		actions: [
			'huntWisp',
			'ressurect'
		],
		abilities: [
			'fakeAbility'
		]
	}),
	domesticCunning: new MonsterTemplate({
 		id: 'domesticCunning',
		name: "Domestic Cunning",
		type: 'cunning',
		actions: [
			'huntWisp',
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
		monsterTemplateId: "domesticDesire"
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
		monsterTemplateId: "domesticFaith"
	}),
	faithMinion: new EnemyTemplate({
		id: 'faithMinion',
		name: 'Faith Minion',
		type: 'minion'
	}),
	fearBoss: new EnemyTemplate({
		id: 'fearBoss',
		name: 'Fear Boss',
		type: 'boss',
		monsterTemplateId: "domesticFear"
	}),
	fearMinion: new EnemyTemplate({
		id: 'fearMinion',
		name: 'Fear Minion',
		type: 'minion'
	}),
	persistBoss: new EnemyTemplate({
		id: 'persistBoss',
		name: 'Persistence Boss',
		type: 'boss',
		monsterTemplateId: "domesticPersistence"
	}),
	persistMinion: new EnemyTemplate({
		id: 'persistMinion',
		name: 'Persistence Minion',
		type: 'minion'
	}),
	strengthBoss: new EnemyTemplate({
		id: 'strengthBoss',
		name: 'Strength Boss',
		type: 'boss',
		monsterTemplateId: "domesticStrength"
	}),
	strengthMinion: new EnemyTemplate({
		id: 'strengthMinion',
		name: 'Strength Minion',
		type: 'minion'
	}),
	cunningBoss: new EnemyTemplate({
		id: 'cunningBoss',
		name: 'Cunning Boss',
		type: 'boss',
		monsterTemplateId: "domesticCunning"
	}),
	cunningMinion: new EnemyTemplate({
		id: 'cunningMinion',
		name: 'Cunning Minion',
		type: 'minion'
	}),
}