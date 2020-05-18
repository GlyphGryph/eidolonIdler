var monsters = [];

var state = {
	currentTime: null,
	lastTime: null,
	timeSinceLastUpdate: null,
	selectedTab: 'action'
};

var log = [];

var gameProgress = {
	tabsAreUnlocked: false,
	orphanIsUnlocked: false,
	regionsAreUnlocked: false
}

var unlockedResources = [
]

var currentRegion = "blackenedWasteland";
var unlockedRegions = [];
var lockedRegions = [
	'blackenedWasteland',
	'tangledJungle',
	'forgottenVillage'
];
