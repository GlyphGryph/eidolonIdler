// Mandatory:
// allies - list of string ids
// enemies - list of string ids
// Optional:
// mode - 'fight' or 'resolution'


var Battle = function(saveState){
	var that = this;
	this.allyIds = saveState.allyIds;
	this.enemyId = saveState.enemyId;
	this.enemy = new Enemy(this.enemyId);
	this.mode = eqOr(saveState.mode, 'fight'); // Modes are 'fight' and 'resolution'
};

Battle.prototype.toSaveState = function(){
	var things = {
		mode: this.mode,
		enemyId: this.enemyId
	}
	
	things.allyIds = this.allyIds;

	return things;
};

Battle.prototype.allies = function(){
	var things = [];
	this.allyIds.forEach(function(allyId){
		things.push(state.getTeammate(allyId));
	});
	return things;
};

Battle.prototype.getBattleString = function(){
	battleString = "";
	this.allies().forEach(function(ally){
		battleString += ally.name+", ";
	})
	battleString += " vs. "+this.enemy.name;
	return battleString;
};

Battle.prototype.setupFight = function(){
	var that = this;
	var battleView = $('#battle .battle-view');
	var battleControlsElement = $("#battle-controls-template").clone();
	battleControlsElement.attr('id', 'battle-controls');
	battleView.append(battleControlsElement);

	// Battle controls
	battleControlsElement.find('.win-battle').click(function(){that.win()});
	battleControlsElement.find('.lose-battle').click(function(){that.lose()});
	battleControlsElement.find('.escape-battle').click(function(){that.escape()});
};

Battle.prototype.setupResolution = function(){
	var that=this;
	var battleView = $('#battle .battle-view');
	battleView.html('Victory!');
	
	this.allies().forEach(function(ally){
		if('character' == ally.id){
			var playerRow = $('#resolution-player-row-template').clone();
			playerRow.find('.orphan-name').text(ally.name);
			if('boss' == that.enemy.type){
				playerRow.find('.bind-resolution').click(function(){that.resolveBind(ally)});
			}else{
				playerRow.find('.bind-resolution').hide();
			}
			battleView.append(playerRow);
		}else{
			var monsterRow = $('#resolution-monster-row-template').clone();
			monsterRow.find('.monster-name').text(ally.name);
			monsterRow.find('.consume-resolution').click(function(){that.resolveConsume(ally)});
			battleView.append(monsterRow);
		}
	});
	var globalRow = $('#resolution-global-row-template').clone();
	battleView.append(globalRow); 
	globalRow.find('.leave-resolution').click(function(){that.escape()});
}

Battle.prototype.setup = function(){
	var battleElement = $('#battle');
	battleElement.find('.battle-title').html(this.getBattleString());
	var battleView = battleElement.find('.battle-view');
	battleView.html('');
	
	if('fight' == this.mode){
		this.setupFight();
	}else{
		this.setupResolution();
	}
	
	battleElement.show();
};

Battle.prototype.teardown = function(){
	var battleElement = $('#battle');
	battleElement.find('.title').html(this.getBattleString());
	var battleView = battleElement.find('.battle-view');
	battleView.html('');
	battleElement.hide();
}

Battle.prototype.update = function(){
}

Battle.prototype.resolveBind = function(character){
	character.bind(this.enemy)
	this.end();
}

Battle.prototype.resolveConsume = function(monster){
	monster.consume(this.enemy)
	this.end();
}

Battle.prototype.win = function(){
	this.mode = 'resolution';
	this.setupResolution();
}

Battle.prototype.lose = function(){
	addLog('black ', 'You lost the fight!');
	this.allies().forEach(function(ally){
		ally.kill();
	});
	this.end();
}

Battle.prototype.escape = function(){
	addLog('black ', 'You escaped!');
	this.end();
}

Battle.start = function(allyIds, enemyId){
	if('battle' != state.mode){
		state.mode = 'battle';
		state.battle = new Battle({allyIds: allyIds, enemyId: enemyId});
		state.battle.setup();
	}
}

Battle.startBossFight = function(){
	var team = ['character'];
	state.monsters.forEach(function(monster){
		team.push(monster.id);
	});
	Battle.start(team, 'basicBoss');
}

Battle.startAmbush = function(id){
	Battle.start([id], 'basicMinion');
}

Battle.prototype.end = function(){
	if('battle' == state.mode){
		state.mode = 'standard';
		state.battle.teardown();
		state.battle = null;
	}
}