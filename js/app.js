$(document).ready(function() {

	var tiles = [];
	var idx;
	var tileOne = null;

	$('#rulesbutton').click(function() {
		$('#game-stuff-modal').modal();
	});

	$('startgamebutton').click(function() {
		resetGame(tiles);
		startTime;
	});
	//start at tile 1 because we dont have a tile yet
	for (idx = 1; idx <= 32; ++idx) {
		//push adds new element to array
		tiles.push({

			//new properties of our new object (keys and values)
			tileNum: idx, 
			src: 'img/tile' + idx + '.jpg',
			flipped: false
		});
	}
	console.log(tiles);
	var gameBoard = $('#game-board');
	resetGame(tiles);

	//anonymous function call
	$('#startgamebutton').click(function() {
		resetGame(tiles);
		beginTiming();
	});

	function beginTiming() {
		var startTime = _.now();
		var timer = window.setInterval(function() {

		//floor rounds it down to nearest integer
			var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
			$('#elapsed-seconds').text("Elapsed Time: " + elapsedSeconds + " seconds");
		}, 1000);
	}

	function resetGame(tiles) {
		gameBoard.empty();
		var shuffledTiles =_.shuffle(tiles);
		console.log(shuffledTiles);

		//eight not seven because the last element is non-inclusive
		var selectedTiles = shuffledTiles.slice(0, 8);
		console.log(selectedTiles);

		var tilePairs = [];
		_.forEach(selectedTiles, function(tile) {
			tilePairs.push(_.clone(tile));
			tilePairs.push(_.clone(tile));
		});

		tilePairs = _.shuffle(tilePairs);

		console.log(tilePairs);

		gameBoard = $('#game-board');
		var row = $(document.createElement('div'));
		var img;

		//array element and numeric parameters (second parameter is optional)
		_.forEach(tilePairs, function(tile, elemIndex) {
			
			//put the static value on the left so you don't make mistake
			if (elemIndex > 0 && 0 == elemIndex % 4) {
				gameBoard.append(row);
				row = $(document.createElement('div'));
			}

			img = $(document.createElement('img'));
			img.attr({
				src: 'img/tile-back.png',
				alt: 'image of tile ' + tile.tileNum
			});
			img.data('tile', tile);
			row.append(img);
		});
		gameBoard.append(row);
		//adds event listener
		$('#game-board img').click(newTurn);//on click of gameboard images
	}

	function flippingTiles(img) {
		var tile = img.data('tile');

		img.fadeOut(100, function() {
			if (tile.flipped) {
				img.attr('src', 'img/tile-back.png');
			}
			else {
				img.attr('src', tile.src);
			}
			tile.flipped = !tile.flipped;
		});//after fadeOut
		img.fadeIn(100);
	}

	var firstImage = null;
	var matches = 0;
	var remaining = 8;
	var missed = 0;

	function newTurn() {
		if($(this).data('tile').flipped) {
			return;
		}
		else if (firstImage == null) {
			firstImage = $(this);
			console.log(firstImage);
			flippingTiles(firstImage);
		}
		else {
			var secondImage = $(this);
			console.log(secondImage);
			flippingTiles(secondImage);

			var match = comparePics(firstImage, secondImage);
			//compare first and second images
			if (match) {
				++matches;
				--remaining;
				$('#matches').text(matches);
				$('#remaining').text(remaining);
				firstImage = null;
			}
			else {
				++missed;
				var currFirst = firstImage;
				$('#missed').text(missed);
				window.setTimeout(function() {
					flippingTiles(currFirst);
					flippingTiles(secondImage);
					firstImage = null;
				}, 1000);
			}
		}
	}

	function comparePics(image1, image2) {
		return image1.data('tile').tileNum == image2.data('tile').tileNum;
	}
})

//change repeating elements to one var and 3D flipping stuff
//start game button & game instructions button --bootstrap modal 

//if (matches == 0) {
	//$
//}