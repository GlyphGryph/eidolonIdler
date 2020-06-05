var Enemy = function(id){
	this.template = enemyTemplates[id];
	this.id = this.template.id;
	this.type = this.template.type;
	this.name = this.template.name;
	if('boss' == this.type){
		this.monster = this.template.monster;
	}
}