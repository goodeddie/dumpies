enchant();

window.onload = function() {
    var game = new Game(120, 120); // x,y make up viewport
    game.fps = 15;
    game.preload('images/map1.gif', 'images/chara0.gif');
    
		getImage = function(img, offsetX, offsetY) {
			var image = new Surface(96, 128); // width, height
			// Takes the image content in src starting at (imgx, imgy) with a (Width, Height),
			// scales it and draws it in this surface at (posx, posy) with a (scaledWidth, scaledHeight).
			image.draw(game.assets[img], offsetX, offsetY, 96, 128, 0, 0, 96, 128);
			//image.draw(game.assets[img], 0, 0, 96, 128, 0, 0, 96, 128);
			return image;
		}
		
		// addNPC(stage, position x, position y, sprite image, offset x, offset y, movement type, custom movement array)
		// movement types = random, custom (no movement would be a movement type of 'none' or a movement array with nothing in it)
		addNPC = function(stage, map, x, y, img, offsetX, offsetY, movementType, movementArray) {
			var NPC = new Sprite(32, 32);
			NPC.x = x;
			NPC.y = y;
			
			NPC.image = getImage(img, offsetX, offsetY);
			
			NPC.isMoving = false;
			NPC.direction = 0;
			NPC.walk = 1;
			NPC.customMoveID = 0; // Current movement in array
			
			if (movementType == 'random') {
				NPC.addEventListener('enterframe', function() {
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
						var moveRand = Math.floor((Math.random()*10));
						if (moveRand > 8) {
							var whichDir = Math.floor((Math.random()*4));
							if (whichDir == 1) { // left
								this.direction = 1;
								this.vx = -4;
							} else if (whichDir == 2) { // right
								this.direction = 2;
								this.vx = 4;
							} else if (whichDir == 3) { // up
								this.direction = 3;
								this.vy = -4;
							} else if (whichDir == 0) { // down
								this.direction = 0;
								this.vy = 4;
							}
							if (this.vx || this.vy) {
								var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
								var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
								if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
									this.isMoving = true;
									arguments.callee.call(this);
								}
							}
						}
					}
				});
			} else if (movementType == 'custom') {
				NPC.addEventListener('enterframe', function() {
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
						var moveRand = Math.floor((Math.random()*10));
						if (moveRand > 8) {
							if (movementArray[this.customMoveID] == 1) { // left
								this.direction = 1;
								this.vx = -4;
							} else if (movementArray[this.customMoveID] == 2) { // right
								this.direction = 2;
								this.vx = 4;
							} else if (movementArray[this.customMoveID] == 3) { // up
								this.direction = 3;
								this.vy = -4;
							} else if (movementArray[this.customMoveID] == 0) { // down
								this.direction = 0;
								this.vy = 4;
							}
							if (this.vx || this.vy) {
								var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
								var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
								if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
									this.isMoving = true;
									arguments.callee.call(this);
								}
							}
							
							this.customMoveID++;
							if (this.customMoveID == movementArray.length) {
								this.customMoveID = 0;
							}
						}
					}
				});
			}
			
			stage.addChild(NPC);
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
			[ -1,481,482,321, -1, -1, -1, -1,400],
			[ -1, -1, -1,321,521,521,521,521,521],
			[ -1,461,462,321, -1, -1, -1, -1, -1],
			[ -1,481,482,321, -1, -1, -1, -1,400]
        ]);
        map.collisionData = [
			[  0,  0,  0,  0,  0,  0,  1,  1,  1],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  1,  1,  0,  1,  1,  0,  1,  1],
			[  0,  0,  0,  1,  1,  1,  1,  1,  1],
			[  0,  0,  0,  1,  0,  0,  0,  1,  1],
			[  0,  1,  1,  1,  0,  0,  0,  0,  1],
			[  0,  0,  0,  1,  1,  1,  1,  1,  1],
			[  0,  0,  0,  1,  0,  0,  0,  0,  0],
			[  0,  1,  1,  1,  0,  0,  0,  0,  1]
        ];

        var foregroundMap = new Map(16, 16);
        foregroundMap.image = game.assets['images/map1.gif'];
        foregroundMap.loadData([
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1,461,462, -1,461,462, -1,461,462],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1,461,462, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[ -1,461,462, -1, -1, -1, -1, -1, -1],
			[ -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ]);

        var player = new Sprite(32, 32);
        player.x = 6 * 16 - 8;
        player.y = 6 * 16;
        player.image = getimage('images/chara0.gif', 96, 128);

        player.isMoving = false;
        player.direction = 0;
        player.walk = 1;
        player.addEventListener('enterframe', function() {
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
				if (this.vx || this.vy) {
					var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
					var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
					if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
						this.isMoving = true;
						arguments.callee.call(this);
					}
				}
			}
        });

		stage.addChild(map);
        stage.addChild(player);
		addNPC(stage, map, 4 * 16 - 8, 4 * 16, 'images/chara0.gif', 192, 0, 'random', null);
		addNPC(stage, map, 6 * 16 - 8, 4 * 16, 'images/chara0.gif', 0, 0, 'custom', [0,1,2,3]);
        stage.addChild(foregroundMap);
		//UI/HUD
        game.rootScene.addChild(stage);

        /*var pad = new Pad();
        pad.x = 0;
        pad.y = 220;
        game.rootScene.addChild(pad);*/

        // Update viewport
		game.rootScene.addEventListener('enterframe', function(e) {
			var x = Math.min((game.width  - 16) / 2 - player.x, 0);
			var y = Math.min((game.height - 16) / 2 - player.y, 0);
			x = Math.max(game.width,  x + map.width)  - map.width;
			y = Math.max(game.height, y + map.height) - map.height;
			stage.x = x;
			stage.y = y;
        });
    };
    game.start();
};
