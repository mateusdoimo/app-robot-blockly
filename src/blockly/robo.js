Blockly.Blocks['avancar'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("avançar")
      .appendField(new Blockly.FieldImage("img/avancar.png", 15, 15, { alt: "", flipRtl: "FALSE" }))
    this.setPreviousStatement(true, "avançar");
    this.setNextStatement(true, "avançar");
    this.setColour(120);
    this.setTooltip("Avança o robô");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['retornar'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("retornar")
      .appendField(new Blockly.FieldImage("img/retornar.png", 15, 15, { alt: "", flipRtl: "FALSE" }))
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Retorna o robô");
    this.setHelpUrl("");
  }
};
Blockly.Blocks['parar'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("parar")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("Parar o robô");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['repetir'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("repetir")
      .appendField(new Blockly.FieldNumber(2, 2, 10), "num")
      .appendField("vezes");
    this.appendStatementInput("repeticao")
      .setCheck(null)
      .appendField("faça");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['loop'] = {
  init: function () {
    this.appendValueInput("loop")
      .setCheck(null)
      .appendField("repetir até");
    this.appendStatementInput("loop_acao")
      .setCheck(null)
      .appendField("faça");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

// Blockly.Blocks['virar'] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField("virar à")
//       .appendField(new Blockly.FieldDropdown([["esquerda", "92"], ["direita", "91"]]), "girar_lado");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(290);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   }
// };


Blockly.Blocks['virar'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("virar à")
      .appendField(new Blockly.FieldDropdown([["direita", "91"], ["esquerda", "92"]]), "girar_lado")
      .appendField("por")
      .appendField(new Blockly.FieldNumber(0, 0, 10, 0.01), "tempo_girar")
      .appendField("segundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['delay'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("esperar")
      .appendField(new Blockly.FieldNumber(0, 0, 10, 0.01), "tempo")
      .appendField("segundos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['girar'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("girar à")
      .appendField(new Blockly.FieldAngle(90), "grau")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['condicao'] = {
  init: function () {
    this.appendValueInput("condicional")
      .setCheck("operadores")
      .appendField("se");
    this.appendStatementInput("acao_se")
      .setCheck(null)
      .appendField("faça");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['operadores'] = {
  init: function () {
    this.appendValueInput("operador_1")
      .setCheck(['numero', 'distancia']);
    this.appendValueInput("operador_2")
      .setCheck(['numero', 'distancia'])
      .appendField(new Blockly.FieldDropdown([["=", "1"], ["≠", "2"], ["<", "3"], ["≤", "4"], [">", "5"], ["≥", "6"]]), "tipo_operador");
    this.setInputsInline(true);
    this.setOutput(true, 'operadores');
    this.setColour(345);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['distancia'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("distância");
    this.setOutput(true, 'distancia');
    this.setColour(345);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['numero'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0, 50), "numero")
      .appendField("cm");
    this.setOutput(true, 'numero');
    this.setColour(345);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['buzina'] = {
  init: function () {
    this.appendDummyInput()

      .appendField("buzina")
      .appendField(new Blockly.FieldImage("img/buzina.png", 15, 15, { alt: "*", flipRtl: "FALSE" }))
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['iniciar'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("img/estrela.png", 15, 15, { alt: "*", flipRtl: "FALSE" }))
      .appendField("INICIAR");
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("");
    this.setHelpUrl("");
  },
  customContextMenu: function (options) {
    console.log(options);
  },
};