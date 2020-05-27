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
	battleElement.html(this.getBattleString())
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