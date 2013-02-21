enchant();

window.onload = function() {
	var game = new Game(120, 120); // x,y make up viewport
	game.fps = 15;
	game.preload('images/map1.gif', 'images/chara0.gif', 'images/chara6.png');
	
	var SpriteLabel = enchant.Class.mixClasses(Sprite, Label, true);
    
	getImage = function(img, offsetX, offsetY) {
		var image = new Surface(96, 128); // width, height
		// Takes the image content in src starting at (imgx, imgy) with a (Width, Height),
		// scales it and draws it in this surface at (posx, posy) with a (scaledWidth, scaledHeight).
		image.draw(game.assets[img], offsetX, offsetY, 96, 128, 0, 0, 96, 128);
		return image;
	}
	
	randomMovement = function(that, map) {
		var moveRand = Math.floor((Math.random()*10));
		if (moveRand > 8) {
			var whichDir = Math.floor((Math.random()*4));
			if (whichDir == 1) { // left
				that.direction = 1;
				that.vx = -4;
			} else if (whichDir == 2) { // right
				that.direction = 2;
				that.vx = 4;
			} else if (whichDir == 3) { // up
				that.direction = 3;
				that.vy = -4;
			} else if (whichDir == 0) { // down
				that.direction = 0;
				that.vy = 4;
			}
		}
	}
	
	customMovement = function(that, map, movementArray) {
		var moveRand = Math.floor((Math.random()*10));
		if (moveRand > 8) {
			if (movementArray[that.customMoveID] == 1) { // left
				that.direction = 1;
				that.vx = -4;
			} else if (movementArray[that.customMoveID] == 2) { // right
				that.direction = 2;
				that.vx = 4;
			} else if (movementArray[that.customMoveID] == 3) { // up
				that.direction = 3;
				that.vy = -4;
			} else if (movementArray[that.customMoveID] == 0) { // down
				that.direction = 0;
				that.vy = 4;
			}
			
			that.customMoveID++;
			if (that.customMoveID == movementArray.length) {
				that.customMoveID = 0;
			}
		}
	}
		
	// addCharacter(stage, position x, position y, sprite image, offset x, offset y, movement type, custom movement array)
	// movement types = random, custom (no movement would be a movement type of 'none' or a movement array with nothing in it)
	addCharacter = function(stage, map, name, x, y, img, offsetX, offsetY, movementType, movementArray) {
		var character = new SpriteLabel(32, 32, name);
		character.color = 'white'; // Color of name
		//character.width = 128;
		//character.font = '10px Arial';
		character.font = '10px Georgia, serif';
		character.image = getImage(img, offsetX, offsetY);
		character.x = x;
		character.y = y;
		character.isMoving = false;
		character.direction = 0;
		character.walk = 1;
		character.customMoveID = 0; // Current movement in array
		
		if (movementType != undefined) {
			character.addEventListener('enterframe', function() {
				this.frame = this.direction * 3 + this.walk;
				if (this.isMoving) {
					this.moveBy(this.vx, this.vy);

					if (!(game.frame % 3)) {
						this.walk++;
						this.walk %= 3;
					}
					if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
						this.isMoving = false;
						this.walk = 1;
					}
				} else {
					this.vx = this.vy = 0;
					if (movementType == 'random') {
						randomMovement(this, map);
					} else if (movementType == 'custom') {
						customMovement(this, map, movementArray);
					} else if (movementType == 'player') {
						if (game.input.left) {
							this.direction = 1;
							this.vx = -4;
						} else if (game.input.right) {
							this.direction = 2;
							this.vx = 4;
						} else if (game.input.up) {
							this.direction = 3;
							this.vy = -4;
						} else if (game.input.down) {
							this.direction = 0;
							this.vy = 4;
						}
					}
					
					if (this.vx || this.vy) {
						var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
						var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
						if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) { // Add collision with player
							this.isMoving = true;
							//arguments.callee.call(this);
						}
					}
				}
			});
		}
		
		stage.addChild(character);
		return character;
	};
		
	game.onload = function() {
		var stage = new Group();
		
		var map = new Map(16, 16);
		map.image = game.assets['images/map1.gif'];
		map.loadData([
			[322,322,322,322,322,322,224,225,225],
			[322,45,322,322,322,322,322,322,322],
			[322,45,322,322,322,322,322,322,322],
			[322,322,322,342,342,342,342,342,342],
			[322,322,322,342,342,342,342,342,342],
			[322,322,322,342,342,342,342,342,342],
			[322,322,322,342,342,342,342,342,342],
			[322,322,322,342,342,342,342,342,342],
			[322,322,322,342,342,342,342,342,342]
		],[
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1,461,462, -1,461,462, -1,461,462],
			[ -1,481,482, -1,481,482,421,481,482],
			[ -1,421,421,321,341,341,341,341,341],
			[ -1,461,462,321,422, -1, -1,400,400],
			[ -1,481,482, -1, -1, -1, -1, -1,400],
			[ -1, -1, -1, -1, -1, -1,521,521,521],
			[ -1,461,462, -1, -1, -1, -1, -1, -1],
			[ -1,481,482, -1, -1, -1, -1, -1,400]
		]);
		map.collisionData = [
			[  0,  0,  0,  0,  0,  0,  1,  1,  1],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  1,  1,  0,  1,  1],
			[  0,  0,  0,  1,  1,  1,  1,  1,  1],
			[  0,  0,  0,  1,  0,  0,  0,  1,  1],
			[  0,  1,  1,  0,  0,  0,  0,  0,  1],
			[  0,  0,  0,  0,  0,  0,  1,  1,  1],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  1,  1,  0,  0,  0,  0,  0,  1]
		];
		
		var foregroundMap = new Map(16, 16);
		foregroundMap.image = game.assets['images/map1.gif'];
		foregroundMap.loadData([
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1,461,462, -1,461,462],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1,461,462, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1,461,462, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1]
		]);
		
		
		var stage2 = new Group();
		/*var character2 = new SpriteLabel(32, 32, 'other');
		character2.color = 'white'; // Color of name
		//character2.width = 128;
		//character2.font = '10px Arial';
		character2.font = '10px Georgia, serif';
		character2.image = getImage('images/chara0.gif', 0, 0);
		character2.x = 6 * 16 - 8;
		character2.y = 3 * 16;
		stage2.addChild(character2);*/
		
		
		
		stage.addChild(map);
		//var player = addCharacter(stage2, map, null, 6 * 16 - 8, 6 * 16, 'images/chara0.gif', 96, 0, 'player', null);
		var player = addCharacter(stage, map, null, 0, 0, 'images/chara0.gif', 96, 0, 'player', null);
		//addCharacter(stage, map, 'Allice', 4 * 16 - 8, 4 * 16, 'images/chara0.gif', 192, 0, 'random', null);
		//addCharacter(stage, map, 'Bitch', 6 * 16 - 8, 4 * 16, 'images/chara0.gif', 0, 0, 'custom', [0,1,2,3]);
		addCharacter(stage, map, 'Still', 6 * 16 - 8, 3 * 16, 'images/chara0.gif', 0, 0, null, [0,1,2,3]);
		stage.addChild(foregroundMap);
		//UI/HUD
		game.rootScene.addChild(stage);

		/*var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);*/
		
		game.rootScene.addChild(stage2);
		
		// Update viewport
		game.rootScene.addEventListener('enterframe', function(e) {
			var x = Math.min((game.width  - 16) / 2 - player.x, 0);
			var y = Math.min((game.height - 16) / 2 - player.y, 0);
			x = Math.max(game.width,  x + map.width)  - map.width;
			y = Math.max(game.height, y + map.height) - map.height;
			//stage.x = x;
			//stage.y = y;
		});
	};
	game.start();
};
