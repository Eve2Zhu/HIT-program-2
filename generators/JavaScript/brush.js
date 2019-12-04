'use strict';

/**
 * @fileoverview Generating JavaScript for brush blocks.
 */

goog.provide('Blockly.JavaScript.brush');

goog.require('Blockly.JavaScript');

Blockly.JavaScript['brush_move_north'] = function(block) {
	return 'movenorth(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_move_east'] = function(block) {
	return 'moveeast(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_move_south'] = function(block) {
	return 'movesouth(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_move_west'] = function(block) {
	return 'movewest(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_moveforward'] = function(block) {
	return 'moveforward(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_moveback'] = function(block) {
	return 'moveback(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_turnright'] = function(block) {
	var angle = block.getFieldValue('ANGLE');
	return 'turnright(' + angle + ', \'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_turnleft'] = function(block) {
	var angle = block.getFieldValue('ANGLE');
	return 'turnleft(' + angle + ', \'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_set_color'] = function(block) {
	var color = '\'' + block.getFieldValue('COLOUR') + '\'';
	return 'setcolor(' + color + ', \'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_pen_up'] = function(block) {
  return 'penUp(\'block_id_' + block.id + '\');\n';
};

Blockly.JavaScript['brush_pen_down'] = function(block) {
  return 'penDown(\'block_id_' + block.id + '\');\n';
};


Blockly.JavaScript['poetry'] = function(block) {
	var value_poetry_title = Blockly.JavaScript.valueToCode(block, 'poetry_title', Blockly.JavaScript.ORDER_ATOMIC);
	var dropdown_name = block.getFieldValue('NAME');
	var statements_poetry_content = Blockly.JavaScript.statementToCode(block, 'poetry_content');
	// TODO: Assemble JavaScript into code variable.
	switch(dropdown_name) {
	  case '4':
		dropdown_name = '四言绝句';
		break;
	  case '5':
		dropdown_name = '五言绝句';
		break;
	  case '7':
		dropdown_name = '七言绝句';
		break;
	}
  
	var code = value_poetry_title + '\n' + dropdown_name + '\n' + statements_poetry_content;
	
	return code;
  };
  
  Blockly.JavaScript['answer_title_jys'] = function(block) {
	// TODO: Assemble JavaScript into code variable.
	var code = '静夜思-李白';
	// TODO: Change ORDER_NONE to the correct strength.
	return [code, Blockly.JavaScript.ORDER_NONE];
  };
  
  Blockly.JavaScript['answer_content_jys_01'] = function(block) {
	// TODO: Assemble JavaScript into code variable.
	var code = '床前明月光,\n';
	return code;
  };
  
  Blockly.JavaScript['answer_content_jys_02'] = function(block) {
	// TODO: Assemble JavaScript into code variable.
	var code = '疑是地上霜。\n';
	return code;
  };
  
  Blockly.JavaScript['answer_content_jys_03'] = function(block) {
	// TODO: Assemble JavaScript into code variable.
	var code = '举头望明月,\n';
	return code;
  };
  
  Blockly.JavaScript['answer_content_jys_04'] = function(block) {
	// TODO: Assemble JavaScript into code variable.
	var code = '低头思故乡。\n';
	return code;
  };