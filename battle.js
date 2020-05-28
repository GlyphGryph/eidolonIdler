var Battle = function(allies, enemies){
	this.allies = allies;
	this.enemies = enemies;
}

Battle.prototype.getBattleString = function(){
	battleString = "";
	this.allies.forEach(function(ally){
		battleString += ally.name+", ";
	})
	battleString += " vs. ";
	this.enemies.forEach(function(enemy){
		battleString += enemy+", ";
	})
	return battleString;
}

Battle.prototype.update = function(){
	var battleElement = $('#battle');
	battleElement.show();
	battleElement.find('.title').html(this.getBattleString());
}

Battle.prototype.toSaveState = function(){
	var things = {}
	
	things.allies = [];
	this.allies.forEach(function(ally){
		things.allies.push(ally.id);
	});
	
	things.enemies = [];
	this.enemies.forEach(function(enemy){
		things.enemies.push(enemy);
	});
	return things;
}

Battle.prototype.win = function(){
	alert('Not yet');
}

Battle.prototype.lose = function(){
	alert('Not yet');
}

Battle.prototype.escape = function(){
	addLog('black ', 'You escaped!');
	this.end();
}

Battle.start = function(){
	if('battle' != state.mode){
		state.mode = 'battle';
		var team = [...state.monsters, state.character];
		state.currentBattle = new Battle(team, ["Enemy Boss"]);
	}
}

Battle.prototype.end = function(){
	if('battle' == state.mode){
		state.mode = 'standard';
		var battleElement = $('#battle');
		battleElement.hide();
		battleElement.find('.title').html("");
		state.currentBattle = null;
	}
}