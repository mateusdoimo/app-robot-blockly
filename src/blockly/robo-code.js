Blockly.JavaScript['iniciar'] = function (block) {
  return `99,`;
};
Blockly.JavaScript['avancar'] = function (block) {
  var code = '98,';
  return code;
};
Blockly.JavaScript['parar'] = function (block) {
  var code = '90,';
  return code;
};

Blockly.JavaScript['retornar'] = function (block) {
  var code = '97,';
  return code;
};

Blockly.JavaScript['buzina'] = function (block) {
  var code = '96,';
  return code;
};

Blockly.JavaScript['repetir'] = function (block) {
  var number_num = block.getFieldValue('num');
  var code = '';
  var statements_repeticao = Blockly.JavaScript.statementToCode(block, 'repeticao');

  for (var i = 0; i < number_num; i++) {
    code = code + statements_repeticao.trim();
  }
  return code;
};

Blockly.JavaScript['virar'] = function (block) {
  var dropdown_girar_lado = block.getFieldValue('girar_lado');
  var code = dropdown_girar_lado + ',';

  var tempo = block.getFieldValue('tempo_girar');
  var tem_mili = parseInt(tempo * 100);

  const partes = [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    const parte = Math.min(tem_mili, 250);
    partes[i] = parte;
    tem_mili -= parte;

    var code = `${code}${partes[i]},`;
  }

  return code;
};

Blockly.JavaScript['condicao'] = function (block) {
  var condicional = Blockly.JavaScript.statementToCode(block, 'condicional');
  var acao_se = Blockly.JavaScript.statementToCode(block, 'acao_se');
  return `95,${condicional.trim()},${acao_se.trim()}94,`;
};

Blockly.JavaScript['operadores'] = function (block) {
  var operador_1 = Blockly.JavaScript.statementToCode(block, 'operador_1');
  var operador_2 = Blockly.JavaScript.statementToCode(block, 'operador_2');
  var operador = block.getFieldValue("tipo_operador")
  return `${operador_1.trim()},${operador.trim()},${operador_2.trim()}`;
};

Blockly.JavaScript['distancia'] = function (block) {
  return '93'
};
Blockly.JavaScript['numero'] = function (block) {
  var numero = block.getFieldValue('numero');
  return `${numero}`
};
Blockly.JavaScript['delay'] = function (block) {
  var numero = block.getFieldValue('tempo');
  var tem_mili = parseInt(numero * 100);
  console.log(tem_mili)
  var code = '89,';

  const partes = [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    const parte = Math.min(tem_mili, 250);
    partes[i] = parte;
    tem_mili -= parte;

    var code = `${code}${partes[i]},`;
  }

  return code;
};