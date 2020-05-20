var regionDefinitions = [
	{
		id: "blackenedWasteland",
		elementId: "blackened-wasteland-region",
		name: "Blackened Wasteland",
		description: "A barren, burnt wasteland, the spirits here are sparse and weak. Something terrible must have happened here long ago.",
		size: 8,
		unlockedConditionsMet: function(){ return (state.regions.blackenedWasteland.awareness > 0); },
		discoveries: {
			2: function(){addLog('purple', "You discover a skeleton in a tattered uniformcarrying an old scabbard. The sword is nowhere to be found.");},
			3: function(){addLog('purple', "You discover another skeleton in bleached rags. A broken music box is clasped in its hand.");},
			4: function(){addLog('purple', "You discover an exit that leads to the Tangled Jungle!");},
			8: function(){addLog('purple', "You discover an exit that leads to the Forgotten Village!");},
		}
	},
	{
		id: "tangledJungle",
		elementId: "tangled-jungle-region",
		name: "Tangled Jungle",
		description: "A dense, dark jungle, full of clinging vines and sharp thorns. No animal or insect life can be seen or heard.",
		size: 1,
		unlockedConditionsMet: function(){ return (state.regions.blackenedWasteland.awareness == 4); },
		discoveries: {
		}
	},
	{
		id: "forgottenVillage",
		elementId: "forgotten-village-region",
		name: "Forgotten Village",
		description: "A small burned out and abandoned village, dominated by a large central chapel.",
		size: 1,
		unlockedConditionsMet: function(){ return (state.regions.blackenedWasteland.awareness == 8); },
		discoveries: {
		}
	}
];