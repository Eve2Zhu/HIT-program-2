'use strict';

Game.MAX_LEVEL = 1;
var AI = {};

/**
 * Width and height of canvas.
 */
AI.WIDTH = 500;
AI.HEIGHT = 500;

/**
 * Block type each level need.
 */
AI.blocks = [
	['brush_move_north', 'brush_move_east', 'brush_move_south', 'brush_move_west'],
	['brush_moveforward', 'brush_turnright', 'controls_repeat'],
	['brush_moveforward', 'brush_turnright', 'controls_repeat'],
	['brush_moveforward', 'brush_turnright', 'brush_set_color', 'controls_repeat'],
	['brush_moveforward', 'brush_turnright', 'brush_turnleft', 'controls_repeat'],
	['brush_moveforward', 'brush_turnright', 'brush_turnleft', 'controls_repeat'],
	['brush_moveforward', 'brush_turnright', 'brush_turnleft', 'controls_repeat'],
	['brush_moveforward', 'brush_moveback', 'brush_turnright', 'controls_repeat', 
	'brush_set_color'],
	['brush_moveforward', 'brush_turnright', 'brush_turnleft', 'controls_repeat', 
	'brush_pen_up', 'brush_pen_down'],
	['brush_moveforward', 'brush_turnright', 'brush_turnleft', 'controls_repeat', 
	'brush_set_color', 'brush_pen_up', 'brush_pen_down']
];

/**
 * Positions of stars.
 */
AI.stars = [];

/**
 * Default pen constants.
 */
AI.DEFAULT_LINEWIDTH = 5;
AI.DEFAULT_COLOR = 'white';
AI.DEFAULT_DIS = 100;

/**
 * Max number of milliseconds that execution should delay.
 */
AI.MAXPAUSE = 160;

/**
 * Min number of milliseconds that execution should delay.
 */
AI.MINPAUSE = 40;

/**
*	If game is playing.
*/
AI.isPlay = false;

/**
* The x and y position of lighted stars.
*/
AI.lightStar = [];

AI.init = function() {
	var visilization = document.getElementById('visilazation');
	var canvasScratch = document.createElement('canvas');
	canvasScratch.id = 'canvas-scratch';
	canvasScratch.className = 'canvas';
	visilization.appendChild(canvasScratch);
	AI.ctxScratch = canvasScratch.getContext('2d');

	var canvasAnswer = document.createElement('canvas');
	canvasAnswer.id = 'canvas-answer';
	canvasAnswer.className = 'canvas';
	visilization.appendChild(canvasAnswer);
	AI.ctxAnswer = canvasAnswer.getContext('2d');

	var canvasDisplay = document.createElement('canvas');
	canvasDisplay.id = 'canvas-display';
	canvasDisplay.className = 'canvas';
	visilization.appendChild(canvasDisplay);
	AI.ctxDisplay = canvasDisplay.getContext('2d');

	// Background image.
	var img = document.createElement('img');
	img.src = 'img/bg.gif';
	img.width = AI.WIDTH;
	img.height = AI.HEIGHT;
	visilization.appendChild(img);

	// Set width and height of canvas.
	canvasScratch.width = AI.WIDTH;
	canvasScratch.height = AI.HEIGHT;
	canvasAnswer.width = AI.WIDTH;
	canvasAnswer.height = AI.HEIGHT;
	canvasDisplay.width = AI.WIDTH;
	canvasDisplay.height = AI.HEIGHT;

	Game.initToolbox(AI);
	Game.initWorkspace();
	AI.initSlider();
	AI.initDialog();

	if (Game.LEVEL == 1) {
		AI.beginDialog();
	}else {
		AI.popover(DIALOG.painting[Game.LEVEL - 1].begin);
	}

	// Load images.
	var src = ['img/flower.png', 'img/arrow.png'];
	Game.loadImages(src, function(){
		AI.drawAnswer();
		AI.reset();
	});

	Game.bindClick(document.getElementById('playBtn'), AI.run);
	Game.bindClick(document.getElementById('resetBtn'), AI.reset);
};

/**
* Speed slider.
*/
AI.initSlider = function() {
	// display slider bar.
	document.querySelector('.slider').style.display = 'block';
	document.querySelector('.slow').style.display = 'inline-block';
	document.querySelector('.fast').style.display = 'inline-block';

	AI.sliderHandle = document.getElementById('sliderHandle');
	AI.sliderHandle.value = 0.5;

	var onDrag = function(e) {
		// calculate offset and assign it to left style attribute.
		var offset = e.clientX - this.startX;
		this.percent = (this.currentLeft !== undefined ? this.currentLeft : 50) + offset / 2;
		if (this.percent < 0) {
			this.percent = 0;
		}
		if (this.percent > 100) {
			this.percent = 100;
		}
		this.style.left = this.percent + '%';
	};

	var onDragend = function(e) {
		this.currentLeft = this.percent;
		this.value = this.percent / 100;
		this.removeEventListener('mousemove', onDrag);
	};

	sliderHandle.addEventListener('mousedown', function(e){
		this.startX = e.clientX;
		sliderHandle.addEventListener('mousemove', onDrag);
	});
	sliderHandle.addEventListener('mouseup', onDragend);
	sliderHandle.addEventListener('mouseleave', onDragend);
};

/**
* Set dialog image.
*/
AI.initDialog = function() {
	var dialogCodeImg = document.querySelector('#dialogCode img');
	var dialogTipImg = document.querySelector('#dialogTip img');
	var dialogWinImg = document.querySelector('#dialogWin img');
	var popoverImg = document.querySelector('#popover img');
	//console.log(dialogCodeImg);
	dialogCodeImg.src = 'img/dialog3.jpg';
	dialogTipImg.src = 'img/dialog4.jpg';
	dialogWinImg.src = 'img/dialog4.jpg';
	popoverImg.src = 'img/flower.png';
};

AI.beginDialog = function() {
	var dialogHeader = document.querySelector('#dialogTip h6');
	var dialogContent = '';
	dialogContent = DIALOG.painting[0].begin;
	if (Game.LEVEL == 10) {
		dialogContent = DIALOG.painting[9].win;
	}
	dialogHeader.textContent = dialogContent;
	Game.showDialog('dialogTip');
};

AI.successDialog = function() {
	var dialogP = document.querySelector('#dialogWin .dialog-p');
	var dialogContent = '';
	dialogContent = DIALOG.painting[Game.LEVEL - 1].win;
	dialogP.textContent = dialogContent;
	Game.showDialog('dialogWin');
};

AI.popover = function(content) {
	var popover = document.getElementById('popover');
	var popoverP = document.querySelector('#popover p');
	var popoverBtn = document.querySelector('#popover button');
	var isDisplay = false;
	popoverP.textContent = content;
	popover.style.display = 'block';
	popover.addEventListener('mouseenter', function(){
		isDisplay = true;
	});
	popover.addEventListener('mouseleave', function(){
		popover.style.display = 'none';
	});
	setTimeout(function() {
		if (!isDisplay) {
			popover.style.display = 'none';
		}
	}, 4000);
};

AI.initAnswer = function() {
  var star = function() {
  	for (var i = 0; i < 5; i++) {
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			AI.turnright(144);
		}
  };

	var diamond = function() {
			for (var i = 1; i <= 4; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				if (i != 4) {
					AI.turnleft(60 * (i % 2 == 0 ? 2 : 1));
				}else {
					AI.turnright(120);
				}
			}
	};

	switch(Game.LEVEL) {
		case 1:
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			for(var i = 0; i < 3; i++) {
				AI.heading += 90;
				AI.move();
				AI.stars.push([AI.x, AI.y]);
			}
			break;
		case 2:
			for(var i = 0; i < 4; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(90);
			}
			break;
		case 3:
			for(var i = 0; i < 6; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(60);
			}
			break;
		case 4:
			AI.setColor('#ffff33');
			AI.turnright(30);
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			AI.turnright(120);
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			AI.turnright(60);
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			AI.turnright(120);
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			break;
		case 5:
			AI.turnleft(90);
			for (var i = 0; i < 3; i++) {
				diamond();
			}
			break;
		case 6:
			AI.turnleft(90);
			for (var i = 0; i < 6; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnleft(60);
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnleft(120);
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnleft(60);
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(180);
			}
			break;
		case 7:
			AI.turnright(18);
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			AI.turnright(144);
			AI.move();
			AI.stars.push([AI.x, AI.y]);
			break;
		case 8:
			AI.turnright(18);
			for (var i = 0; i < 5; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(144);
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnleft(72);
			}
			break;
		case 9:
			AI.penUp();
			AI.turnleft(90);
			AI.move();
			AI.turnright(90);
			AI.penDown();
		  AI.turnleft(30);
			for (var i = 0; i < 6; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(120);
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnleft(60);
			}
			break;
		case 10:
			AI.penUp();
			AI.turnleft(90);
			AI.move();
			AI.turnright(90);
			AI.penDown();
			AI.turnleft(30);
			for (var i = 0; i < 6; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(120);
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnleft(60);
			}
			AI.turnright(60);
			for (i = 0; i < 6; i++) {
				AI.move();
				AI.stars.push([AI.x, AI.y]);
				AI.turnright(60);
			}
			break;
		default:
			console.error('Level is undifined!');
	}
};

/**
 * On startup draw the expected answer and save it to the answer canvas.
 */
AI.drawAnswer = function() {
	AI.reset();
	AI.initAnswer();
	AI.ctxAnswer.globalCompositeOperation = 'copy';
	AI.ctxAnswer.drawImage(AI.ctxScratch.canvas, 0, 0);
	AI.ctxAnswer.globalCompositeOperation = 'source-over';
};

AI.drawStar = function() {
	// Draw stars.
	AI.ctxDisplay.globalCompositeOperation = 'source-over';

	for (var i = 0; i < AI.stars.length; i++) {
		AI.ctxDisplay.globalAlpha = 0.3;
		AI.ctxDisplay.drawImage(Game.imgs[0], AI.stars[i][0] - 32.5, AI.stars[i][1] - 32.5, 65, 65);
	}
};

AI.display = function() {
	// Clear canvas.
	AI.ctxDisplay.canvas.width = AI.ctxDisplay.canvas.width;

	// Draw the answer layer.
	AI.ctxDisplay.globalCompositeOperation = 'source-over';
	AI.ctxDisplay.globalAlpha = 0.2;
	AI.ctxDisplay.drawImage(AI.ctxAnswer.canvas, 0, 0);

	// Draw the answer star layer.
	AI.drawStar();

	// Draw the user layer.
	AI.ctxDisplay.globalAlpha = 1;
	AI.ctxDisplay.drawImage(AI.ctxScratch.canvas, 0, 0);

	// Draw the pen.
	for (var i = 0; i < AI.lightStar.length; i++) {
		//AI.lightStar[i]
		AI.ctxDisplay.drawImage(Game.imgs[0], AI.lightStar[i][0] - 32.5, AI.lightStar[i][1] - 32.5, 65, 65);
	}
	AI.ctxDisplay.drawImage(Game.imgs[0], AI.x - 32.5, AI.y - 32.5, 65, 65);
	// Draw the arrow.
	AI.ctxDisplay.translate(AI.x, AI.y);
	AI.ctxDisplay.rotate((Math.PI / 180) * AI.heading);
	AI.ctxDisplay.translate(-AI.x, -AI.y);
	AI.ctxDisplay.drawImage(Game.imgs[1], AI.x - 17.5, AI.y - 60, 35, 40);
};

AI.animate = function(id) {
	AI.display();
	if(id) {
		Game.highlight(id);
	}
};

/**
 *
 */
AI.move = function(id) {
	if(AI.penDownValue) {
		AI.ctxScratch.beginPath();
		AI.ctxScratch.moveTo(AI.x, AI.y);
	}

	AI.x += AI.DEFAULT_DIS * Math.sin(2 * Math.PI * AI.heading / 360);
	AI.y -= AI.DEFAULT_DIS * Math.cos(2 * Math.PI * AI.heading / 360);

	if (AI.isPlay) {
		AI.lightStar.push([AI.x, AI.y]);
	}

	if(AI.penDownValue) {
		AI.ctxScratch.lineTo(AI.x, AI.y);
		AI.ctxScratch.stroke();
	}
	AI.animate(id);
};

AI.turnright = function(angle, id) {
	AI.heading += angle;
	AI.animate(id);
};

AI.turnleft = function(angle, id) {
	AI.heading -= angle;
	AI.animate(id);
};

AI.setColor = function(color, id) {
	AI.ctxScratch.strokeStyle = color;
	AI.animate(id);
};

AI.penUp = function(id) {
	AI.penDownValue = false;
	AI.animate(id);
};

AI.penDown = function(id) {
	AI.penDownValue = true;
	AI.animate(id);
};

/**
 * API added to interpreter.
 * @param {Interpreter} JS interpreter.
 * @param {Object} scope.
 */
AI.initApi = function(interpreter, scope) {
	var wrapper = function(id) {
		id = id ? id.toString() : '';
		AI.heading = 0;
		console.log(id)
		return interpreter.createPrimitive(AI.move(id));
	};
	interpreter.setProperty(scope, 'movenorth',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(id) {
		id = id ? id.toString() : '';
		AI.heading = 90;
		return interpreter.createPrimitive(AI.move(id));
	};
	interpreter.setProperty(scope, 'moveeast',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(id) {
		id = id ? id.toString() : '';
		AI.heading = 180;
		return interpreter.createPrimitive(AI.move(id));
	};
	interpreter.setProperty(scope, 'movesouth',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(id) {
		id = id ? id.toString(): '';
		AI.heading = 270;
		return interpreter.createPrimitive(AI.move(id));
	};
	interpreter.setProperty(scope, 'movewest',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(id) {
		id = id ? id.toString(): '';
		AI.DEFAULT_DIS = Math.abs(AI.DEFAULT_DIS);
		return interpreter.createPrimitive(AI.move(id));
	};
	interpreter.setProperty(scope, 'moveforward',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(id) {
		id = id ? id.toString(): '';
		AI.DEFAULT_DIS = -AI.DEFAULT_DIS;
		AI.move(id);
	};
	interpreter.setProperty(scope, 'moveback',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(angle, id) {
		id = id ? id.toString(): '';
		angle = angle.data;
		return interpreter.createPrimitive(AI.turnright(angle, id));
	};
	interpreter.setProperty(scope, 'turnright',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(angle, id) {
		id = id ? id.toString(): '';
		angle = angle.data;
		return interpreter.createPrimitive(AI.turnleft(angle, id));
	};
	interpreter.setProperty(scope, 'turnleft',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(color, id) {
		id = id ? id.toString() : '';
		color = color.data;
		console.log(color)
		return interpreter.createPrimitive(AI.setColor(color, id));
	};
	interpreter.setProperty(scope, 'setcolor',
		interpreter.createNativeFunction(wrapper));

	wrapper = function(id) {
		id = id ? id.toString() : '';
		return interpreter.createPrimitive(AI.penUp(id));
	};
	interpreter.setProperty(scope, 'penUp',
		interpreter.createNativeFunction(wrapper));

		wrapper = function(id) {
			id = id ? id.toString() : '';
			return interpreter.createPrimitive(AI.penDown(id));
		};
		interpreter.setProperty(scope, 'penDown',
			interpreter.createNativeFunction(wrapper));
};

AI.excute = function(interpreter) {
	var go = interpreter.step();
	if(!go){
		clearInterval(AI.pid);

		AI.checkAnswer();
	}
};

AI.run = function() {
	var code = Blockly.JavaScript.workspaceToCode(Game.workspace);
	Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
	var interpreter = new Interpreter(code, AI.initApi);
	var pause = Game.clamp(AI.MINPAUSE, (AI.MAXPAUSE - AI.MINPAUSE) * AI.sliderHandle.value + AI.MINPAUSE, AI.MAXPAUSE)
	try {
		AI.isPlay = true;

		AI.pid = setInterval(function(){
			AI.excute(interpreter);
		}, pause);
	} catch(e) {
		alert(MSG['badCode'].replace('%1', e));
	}
};

AI.reset = function() {
	// Stop interval.
	clearInterval(AI.pid);

	AI.isPlay = false;
	AI.lightStar = [];

	// Starting location and heading of the pen.
	AI.x = AI.HEIGHT / 2;
	AI.y = AI.WIDTH / 2;
	AI.heading = 0;
	AI.penDownValue = true;

	// Clear the canvas.
	AI.ctxScratch.canvas.width = AI.ctxScratch.canvas.width;
	AI.ctxScratch.strokeStyle = AI.DEFAULT_COLOR;
	AI.ctxScratch.lineWidth = AI.DEFAULT_LINEWIDTH;
	AI.ctxScratch.lineCap = 'round';
	AI.display();
};

/**
 * Verify if the answer is correct.
 * If so, move on to next level.
 */
AI.checkAnswer = function() {
  // Compare the Alpha (opacity) byte of each pixel in the user's image and
  // the sample answer image.
  var userImage =
      AI.ctxScratch.getImageData(0, 0, AI.WIDTH, AI.HEIGHT);
  var answerImage =
      AI.ctxAnswer.getImageData(0, 0, AI.WIDTH, AI.HEIGHT);
  var len = Math.min(userImage.data.length, answerImage.data.length);
  var delta = 0;
  // Pixels are in RGBA format.  Only check the Alpha bytes.
  for (var i = 3; i < len; i += 4) {
    // Check the Alpha byte.
    if (Math.abs(userImage.data[i] - answerImage.data[i]) > 64) {
      delta++;
    }
  }
  if (AI.isCorrect(delta)) {
    //BlocklyInterface.saveToLocalStorage();
    if (Game.LEVEL < Game.MAX_LEVEL) {
      // No congrats for last level, it is open ended.
      //BlocklyGames.workspace.playAudio('win', 0.5);
      //BlocklyDialogs.congratulations();
      //alert('Complete!')
			AI.successDialog();
    }else {
			AI.beginDialog();
		}
  } else {
    //AI.penColour('#ff0000');
    //alert('error')
		var content = DIALOG.painting[Game.LEVEL - 1].lose;
		AI.popover(content);
		console.log('answer error');
  }
};

/**
 * Validate whether the user's answer is correct.
 * @param {number} pixelErrors Number of pixels that are wrong.
 * @return {boolean} True if the level is solved, false otherwise.
 */
AI.isCorrect = function(pixelErrors) {
  if (Game.LEVEL == Game.MAX_LEVEL) {
    // Any non-null answer is correct.
    return Game.workspace.getAllBlocks().length > 1;
  }
  console.log('Pixel errors: ' + pixelErrors);
  if (pixelErrors > 100) {
    // Too many errors.
    return false;
  }
//if ((Game.LEVEL <= 2 &&
//     Game.workspace.getAllBlocks().length > 3) ||
//    (Game.LEVEL == 3 &&
//     Game.workspace.getAllBlocks().length > 4)) {
//  // Use a loop, dummy.
//  //var content = document.getElementById('helpUseLoop');
////  var style = {
////    'width': '30%',
////    'left': '35%',
////    'top': '12em'
////  };
////  BlocklyDialogs.showDialog(content, null, false, true, style,
////      BlocklyDialogs.stopDialogKeyDown);
////  BlocklyDialogs.startDialogKeyDown();
//  return false;
//}
  return true;
};

window.addEventListener('load', AI.init);
