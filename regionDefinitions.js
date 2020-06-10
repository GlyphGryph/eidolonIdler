var regionDefinitions = [
	{
		id: "blackenedWasteland",
		elementId: "blackened-wasteland-region",
		name: "Blackened Wasteland",
		description: "A barren, burnt wasteland, the spirits here are sparse and weak. Something terrible must have happened here long ago.",
		bossId: null,
		minionId: null,
		size: 8,
		unlockedConditionsMet: function(){ return (state.regions.blackenedWasteland.awareness > 0); },
		discoveries: {
			1: function(){addLog('purple', "Around you is nothing but wasteland - black cliffs rising from black sand, as if the earth itself was scorched. Behind you is the mouth of an enormous cavern.");},
			2: function(){addLog('purple', "You discover a skeleton in a tattered uniform carrying an old scabbard. The sword is nowhere to be found.");},
			3: function(){addLog('purple', "You discover another skeleton in bleached rags. A broken music box is clasped in its hand.");},
			4: function(){addLog('purple', "You find a single, old tree clinging to life, the living thing you've encountered here. In the distance, you can make out vibrant green.");},
			5: function(){addLog('purple', "There are deep grooves carved into the stone cliffs here, creating intricate shapes. They are heavily weathered.");},
			6: function(){addLog('purple', "You find a dry riverbed. It doesn't look like water has flowed through here for a long time.");},
			7: function(){addLog('purple', "You discover the the bones of a child piled on the ground around a scratched glass sphere.");},
			8: function(){addLog('purple', "You discover wheel tracks worn into the ground, evidence of an ancient road. In the distance, you can make out smoke rising above the horizon.");},
		}
	},
	{
		id: "tangledJungle",
		elementId: "tangled-jungle-region",
		name: "Tangled Jungle",
		description: "A dense, dark jungle, full of clinging vines and sharp thorns. No animal or insect life can be seen or heard.",
		bossId: 'desireBoss',
		minionId: 'desireMinion',
		size: 8,
		unlockedConditionsMet: function(){ return (  state.regions.blackenedWasteland.awareness == 4); },
		discoveries: {
			1: function(){addLog('purple', "The thick foliage surrounds you and clings to you. There's nothing here but vines and trees. The thickness of the canopy lets little light in, and the air is thick and humid.");},
			2: function(){addLog('purple', "You discover the half-devoured corpse of some gigantic animal. It's too big to fit through the trees and vines, and you're not sure how it could have gotten here. You feel like you're being watched.");},
			3: function(){addLog('purple', "This part of the jungle is hard to breathe in, due to the presence of a foul smelling fog. But the trees and vines are beginning to thin out.");},
			4: function(){addLog('purple', "You stumble into an overgrown junkyard, vines working their way through windows of abandoned cars and trees lifting broken washing machines off the ground, creating a canopy of junk over your head.");},
			5: function(){addLog('purple', "The jungle here grows up and around the portion of an office building that is still standing. The parts that have collapsed to the ground must have been completely swallowed up by the vines and briars.");},
			6: function(){
				addLog('purple', "There's a peaceful clearing here, around a small pool of water. The vines that stray into the opening seem almost reverent, and a ray of sunlight filters down through a gap in the trees to illuminate the small statue of a woman that stands on a pedestal at the center of the pool. As you step into the clearing, the vines spring to life, rushing past you and pushing through the water to grab the statue, wrapping around it so tightly it shatters into three pieces, and the canopy closes, plunging the clearing into darkness.");
				Battle.startAmbush(state.character.id);
			},
			7: function(){addLog('purple', "The mass of gnarled roots here seems to form anguished faces, and the tree trunks adopt suggestive and beautiful shapes.");},
			8: function(){addLog('purple', "The mud here is thick and ruddy. Sunlight filters down through naked branches - the vines have wrapped so tightly around the trees that they are all dead, many of them seemingly snapped into multiple pieces and held up haphazardly only by the strength of the vines.");}
		}
	},
	{
		id: "noxiousRuins",
		elementId: "noxious-ruins-region",
		name: "Noxious Ruins",
		bossId: 'fearBoss',
		minionId: 'fearMinion',
		description: "A ruined city, cloaked in noxious fumes, dominated by a tall tower atop which perches a gigantic eye.",
		size: 8,
		unlockedConditionsMet: function(){ return (state.regions.tangledJungle.awareness == 3); },
		discoveries: {
			1: function(){addLog('purple', "A thick yellow fog envelops a ruined city city street, with half standing buildings and an old abandoned car standing with its door ajar in the road. Your lungs burn, and you swear there are terrible creatures lurking just out of sight in the swirling mist.");},
			2: function(){addLog('purple', "You discover a fountain, and the liquid pooled in its basin has the color and consistancy of vomit. Billows of thick yellow fog come from the fountain's pipes, out the mouths of the frogs that stand along the central column.");},
			3: function(){addLog('purple', "The diner here has a cracked window, and inside it looks like someone has punched several holes in the wall. The lights are still on, somehow, but they cast long shadows that seem to twist in the street.");},
			4: function(){addLog('purple', "You've found an abandoned, fog-shrouded school, with a clock spire in front. At first, you think faces are staring at you from the windows, but after more careful examination they only seem to be cobwebs.");},
			5: function(){addLog('purple', "This plaza seems to have the contents of a house spread across it - a child's bathtub, a dinner table, a wooden toyhorse, a refrigerator, a bed, a sofa, and more. All of them seem to be stained with splashes of dark red.");},
			6: function(){addLog('purple', "You see a street clear of fog, lit by a simple street lamp. A police officer is whispering something you can't make out to a woman standing under the light, and you can feel an almost palpable sense of relief in the scene... until he reaches out and grabs her by the arm, at which point the fog comes rushing in and a terrible scream fills the air before fading out. The street is empty, as if no one was ever on it.");},
			7: function(){addLog('purple', "As you walk down the fog shrouded streets, you hear crying in the distance. It begins to rain, lazily, large drops of viscous fluid ocassionally dripping onto your body from somewhere above. Distracted by the crying and the rain, your vision limited by the haze, you nearly walk off the edge of the cliff without noticing. The city seems to sheer and drop away a hundred feet before continuing far below. You turn back and try to find another way.");},
			8: function(){addLog('purple', "You've found the base of a tall, crumbling stone tower. The door is ajar, and inside a stairway twists up and away into the darkness. Something is waiting up there. Waiting for you.");},
			
		}
	},
	{
		id: "rumblingTunnels",
		elementId: "rumbling-tunnels-region",
		name: "Rumbling Tunnels",
		bossId: 'persistBoss',
		minionId: 'persistMinion',
		description: "An immense complex of underground tunnels and caverns. Earthquakes are common.",
		size: 8,
		unlockedConditionsMet: function(){ return (state.regions.tangledJungle.awareness == 3); },
		discoveries: {
		}
	},
	{
		id: "forgottenVillage",
		elementId: "forgotten-village-region",
		name: "Forgotten Village",
		bossId: 'faithBoss',
		minionId: 'faithMinion',
		description: "A small burned out and abandoned village, dominated by a large central chapel.",
		size: 8,
		unlockedConditionsMet: function(){ return (state.regions.blackenedWasteland.awareness == 8); },
		discoveries: {
		}
	}
];