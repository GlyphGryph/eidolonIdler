var Resource = function(id, name){
	this.id = id;
	this.elementId = this.id+'-resource';
	this.name = name;
	this.value = 0;
}

Resource.prototype.change = function(amount){
	this.value += amount;
	this.unlock();
	addLog('black', "Gained "+amount+" "+this.name+".");
};

Resource.prototype.update = function(){
	var resourceValueElement = $("#"+this.elementId+" .value");
	if(resourceValueElement.text() != ""+this.value){
		resourceValueElement.text(this.value);
	}
};

Resource.prototype.unlockedConditionsMet = function(){
	return this.value > 0
};

Resource.prototype.unlock = function(){
	if(!state.unlockedResources.includes(this.id)){
		state.unlockedResources.push(this.id);
		this.setup();
	}
}

Resource.prototype.setup = function(){
	var resourceElement = $("#resource-template").clone();
	resourceElement.attr('id', this.elementId);
	resourceElement.show();
	resourceElement.find('.name').text(this.name+":");
	$("#resources").append(resourceElement);
}