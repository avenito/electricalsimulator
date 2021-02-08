/* **************************** */
/* JS para diagrama unifilar 01 */
/* **************************** */

/* Vari�veis globais */

var DJE = true; /* disjuntor de entrada */
var DJI = true; /* disjuntor de interliga��o BT */
var DJG = false; /* disjuntor do gerador */
var DJC1 = true; /* disjuntor da carga 01 */
var DJC2 = false; /* disjuntor da carga 02 */
var DJM = true; /* disjuntor do motor */
var GER = false; /* gerador ligado = true */

var Pbase, V1base, V2base, I1base, I2base, Z1base, Z2base;
var Ac1, Ac2, Amotor;
var Irede, Isectrafo, angIsectrafo, Ic1, Ic2, Imotor, Iger, angIger;
var Vbbt, Vbbtpu, Vger;
var PotAtualTrafo, PotAtualGer, PotAtualC1, PotAtualC2, PotAtualMotor;
var FPAtualRede, FPAtualGer;
var Zger;

var svg; /* unifilar */
var $cor; /* auxiliar */

/* Vari�veis do sistema */

var $Vrede, $PCCrede, $XRrede;
var $Vbarra;

/* Carrega unifilar */
function inicializaUnifilar (){
  $("#oneline").svg({loadURL: 'images/oneline.svg'});
  svg = $('#oneline').svg('get');
  /* Inicializa variáveis */
}

/* Altera avr e acionamento do gerador */
function avr(passo){
	Vger = math.multiply(Vbbtpu, passo);
	calculaSistema();
}
function acionador(direcao){
	var passo =  math.complex(0.9998477, 0.0174524);
	if(direcao == '-') {passo = math.complex(0.9998477, -0.0174524);};
	Vger = math.multiply(Vbbtpu, passo);
	calculaSistema();
}

/* Calculo do sistema */
function calculaSistema(){
	var ang, inom, ipu, xr, Zeq, Aeq, Ztotal, Zthv, aux;
	var Vredepu, Zrede, Arede, Ztrafo, Atrafo, Ager, FPMotor;
	
	/* Valores base */
	Pbase = parseFloat($("#co_concPotCC3f").val());
	V1base = parseFloat($("#co_concTensao").val());
	V2base = parseFloat($("#co_trafoTensaoSec").val());
	I1base = (Pbase * 1000/(V1base * math.sqrt(3)));
	I2base = (Pbase * 1000000/(V2base * math.sqrt(3)));
	Z1base = math.pow(V1base, 2)/Pbase;
	Z2base = math.pow((V2base/1000), 2)/Pbase;
	Vredepu = parseFloat($("#un_concTensaoAtual").val())/V1base;
	/* Carga 01 */
	inom = (parseFloat($("#un_potAtualC01").val())) * 1000/(V2base * math.sqrt(3));
	ipu = inom/I2base;
	ang = math.acos(parseFloat($("#co_c1FP").val()));
	Ac1 = math.complex(((1/ipu) * math.cos(ang)), ((1/ipu) * math.sin(ang)));
	if (DJC1){
		Ac1 = math.inv(Ac1);
	} else {
		Ac1 = math.complex(0, 0);
	};
	/* Carga 02 */
	inom = (parseFloat($("#un_potAtualC02").val())) * 1000/(V2base * math.sqrt(3));
	ipu = inom/I2base;
	ang = math.acos(parseFloat($("#co_c2FP").val()));
	Ac2 = math.complex(((1/ipu) * math.cos(ang)), ((1/ipu) * math.sin(ang)));
	if (DJC2){
		Ac2 = math.inv(Ac2);
	} else {
		Ac2 = math.complex(0, 0);
	};
	/* Motor */
	FPMotor = parseFloat($("#co_motFP").val());
	RdMotor = parseFloat($("#co_motRend").val());
	inom = (parseFloat($("#un_potAtualMotor").val()) * 746)/(V2base * math.sqrt(3) * FPMotor * RdMotor * 0.01);
	/*
	inom = math.pow(parseFloat($("#co_motorTensao").val())/V2base, 2) * (parseFloat($("#un_potAtualMotor").val()) * 746)/(parseFloat($("#co_motorTensao").val()) * math.sqrt(3) * FPMotor * RdMotor * 0.01);
	*/
	ipu = inom/I2base;
	ang = math.acos(FPMotor);
	Amotor = math.complex(((1/ipu) * math.cos(ang)), ((1/ipu) * math.sin(ang)));
	if (DJM){
		Amotor = math.inv(Amotor);
	} else {
		Amotor = math.complex(0, 0);
	};
	/* Rede */
	ang = math.atan(parseFloat($("#co_concXR").val()));
	Zrede = math.complex(math.cos(ang), math.sin(ang));
	/* Trafo */
	Zeq = (parseFloat($("#co_trafoZ").val())/100) * (Pbase/(parseFloat($("#co_trafoPot").val())*0.001));
	xr = parseFloat($("#co_trafoXR").val());
	aux = Zeq/math.sqrt(1+math.pow(xr, 2));
	Ztrafo = math.complex(aux, aux * xr);
	Zrede = math.add(Zrede, Ztrafo);
	if (DJE && DJI){
		Arede = math.inv(Zrede);
	} else {
		Arede = math.complex(0, 0);
	};
	/* Gerador */
	aux = parseFloat($("#co_gerZ").val()) * 1000/parseFloat($("#co_gerPot").val());
	Zger = math.complex((aux/parseFloat($("#co_gerXR").val())), aux);
	Ager = math.inv(Zger);
	/* Equivalente */
	Aeq = math.add(Ac1, Ac2);
	Aeq = math.add(Aeq, Amotor);
	Zeq = math.inv(Aeq);
	Ztotal = math.add(Zeq, Zrede);
	if(DJE && DJI) {
		ipu = math.multiply(Vredepu, math.inv(Ztotal));
	} else {
		ipu = 0;
	}
	/* Thevenan da rede */
	Vbbtpu = math.multiply(ipu, Zeq);
	Athv = math.add(Arede, Aeq);
	Zthv = math.inv(Athv);
	if(!Vger){Vger = Vbbtpu};
	/* alert("Vger  : " + Vger.toPolar().r + " ang " + Vger.toPolar().phi * 57.295779513 + "\nVbarra: " + Vbbtpu.toPolar().r + " ang " + Vbbtpu.toPolar().phi * 57.295779513); */
	if (DJG) {
		Iger = math.multiply(math.add(math.multiply(Vbbtpu, -1), Vger), math.inv(math.add(Zthv, Zger)));
		Vbbtpu = math.add(Vger, math.multiply(math.multiply(Iger, Zger), -1));
		ipu = math.multiply(math.add(Vredepu, math.multiply(Vbbtpu, -1)), Arede);
	} else {
		Iger = math.complex(0, 0);
	}
	/* Recalcula */
	Irede = math.multiply(ipu, I1base);
	Iger = math.multiply(Iger, I2base);
	angIger = Iger.toPolar().phi * 57.295779513;
	angIger.toFixed(1);
	Isectrafo = math.multiply(ipu, I2base);
	angIsectrafo = Isectrafo.toPolar().phi * 57.295779513;
	angIsectrafo.toFixed(1);
	Vbbt = math.multiply(Vbbtpu, V2base);
	Ic1 = math.multiply(Vbbtpu, Ac1);
	Ic1 = math.multiply(Ic1, I2base);
	Ic2 = math.multiply(Vbbtpu, Ac2);
	Ic2 = math.multiply(Ic2, I2base);
	Imotor = math.multiply(Vbbtpu, Amotor);
	Imotor = math.multiply(Imotor, I2base);
	PotAtualTrafo = math.multiply(Vbbt, Isectrafo);
	PotAtualTrafo = math.multiply(PotAtualTrafo, math.sqrt(3)/1000);
	FPAtualRede = math.cos(Irede.toPolar().phi).toFixed(2);
	PotAtualGer = math.multiply(Vbbt, Iger);
	PotAtualGer = math.multiply(PotAtualGer, math.sqrt(3)/1000);
	FPAtualGer = math.cos(Iger.toPolar().phi).toFixed(2);
	PotAtualC1 = math.multiply(Vbbt, Ic1);
	PotAtualC1 = math.multiply(PotAtualC1, math.sqrt(3)/1000);
	PotAtualC2 = math.multiply(Vbbt, Ic2);
	PotAtualC2 = math.multiply(PotAtualC2, math.sqrt(3)/1000);
	PotAtualMotor = math.multiply(Vbbt, Imotor);
	PotAtualMotor = math.multiply(PotAtualMotor, math.sqrt(3) * FPMotor * RdMotor/74600);
	/*
	alert("Irede: " + Irede.toPolar().r + " " + Irede.toPolar().phi * 57.295779513 + "\nIger: " + Iger + "\nIsectrafo: " + Isectrafo + "\nVbbt: " + Vbbt + "\nIc1: " + Ic1 + "\nIc2: " + Ic2 + "\nImotor: " + Imotor);
	*/
	atualiza_Barra();
}

/* Manobra Gerador */
function manobra_GER() {
  GER = !GER;
  if(GER == true) {
    $("#un_LigaGer").attr('value', 'Desligar');
    $cor = "#ff0000"; /* vermelho */
    $("#un_DJG").removeAttr("disabled");
    $("#Iger").html("-- A"); /* corrente do gerador */
  } else {
    $("#un_LigaGer").attr('value', 'Ligar');
    DJG = true;
    manobra_DJG();
    $cor = "#00ff00"; /* verde */
    $("#un_DJG").attr("disabled", "disabled");
  };
  $("#letraG").css({ fill: $cor, stroke: $cor });
  $("#gerador").css({ stroke: $cor });
  $("#caboGer").css({ stroke: $cor });
  $("#polo1DJG").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJG */
function manobra_DJG() {
  DJG = !DJG;
  if(DJG == true) {
    $("#un_DJG").attr('value', 'Abrir');
    $cor = "#ff0000"; /* vermelho */
    $("#Iger").html("-- A"); /* corrente do gerador */
  } else {
    $("#un_DJG").attr('value', 'Fechar');
    $cor = "#00ff00"; /* verde */
    $("#Iger").html("0 A"); /* corrente do gerador */
  };
  $("#manoplaDJG").css({ stroke: $cor });
  calculaSistema();
}

/* Manobra DJM */
function manobra_DJM() {
  DJM = !DJM;
  if(DJM == true) {
    $("#un_DJM").attr('value', 'Abrir');
    $cor = "#ff0000"; /* vermelho */
    $("#Imotor").html("--A"); /* corrente do motor */
  } else {
    $("#un_DJM").attr('value', 'Fechar');
    $cor = "#00ff00"; /* verde */
    $("#Imotor").html("0 A"); /* corrente do motor */
  };
  $("#manoplaDJM").css({ stroke: $cor });
  motor($cor);
}
function motor($cor) {
  if($Vbarra == "0 V" || !DJM) { $cor = "#00ff00"; };
  $("#polo2DJM").css({ fill: $cor, stroke: $cor });
  $("#caboMotor").css({ stroke: $cor });
  $("#motor").css({ stroke: $cor });
  $("#tspan4735-6").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJC1 */
function manobra_DJC1() {
  DJC1 = !DJC1;
  if(DJC1 == true) {
    $("#un_DJC1").attr('value', 'Abrir');
    $cor = "#ff0000"; /* vermelho */
    $("#Ic1").html("--A"); /* corrente da carga 01 */
  } else {
    $("#un_DJC1").attr('value', 'Fechar');
    $cor = "#00ff00"; /* verde */
    $("#Ic1").html("0 A"); /* corrente da carga 01 */
  };
  $("#manoplaDJC1").css({ stroke: $cor });
  carga01($cor);
}
function carga01($cor) {
  if($Vbarra == "0 V" || !DJC1) { $cor = "#00ff00"; };
  $("#polo2DJC1").css({ fill: $cor, stroke: $cor });
  $("#caboC1").css({ stroke: $cor });
  $("#cargaC1").css({ stroke: $cor });
  $("#path5000").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJC2 */
function manobra_DJC2() {
  DJC2 = !DJC2;
  if(DJC2 == true) {
    $("#un_DJC2").attr('value', 'Abrir');
    $cor = "#ff0000"; /* vermelho */
    $("#Ic2").html("--A"); /* corrente da carga 02 */
  } else {
    $("#un_DJC2").attr('value', 'Fechar');
    $cor = "#00ff00"; /* verde */
    $("#Ic2").html("0 A"); /* corrente da carga 02 */
  };
  $("#manoplaDJC2").css({ stroke: $cor });
  carga02($cor);
}
function carga02($cor) {
  if($Vbarra == "0 V" || !DJC2) { $cor = "#00ff00"; };
  $("#polo2DJC2").css({ fill: $cor, stroke: $cor });
  $("#caboC2").css({ stroke: $cor });
  $("#rect4988-5").css({ stroke: $cor });
  $("#cargaC2").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJE */
function manobra_DJE() {
  DJE = !DJE;
  if(DJE == true) {
    $("#un_DJE").attr('value', 'Abrir');
    $cor = "#ff0000"; /* vermelho */
    $("#Irede").html("--A"); /* corrente de entrada */
  } else {
    $("#un_DJE").attr('value', 'Fechar');
    $cor = "#00ff00"; /* verde */
    $("#Irede").html("0 A"); /* corrente de entrada */
  };
  $("#rect4142").css({ fill: $cor });
  $("#caboPrimTrafo").css({ stroke: $cor });
  $("#primTrafo").css({ stroke: $cor });
  $("#secTrafo").css({ stroke: $cor });
  $("#caboSecTrafo").css({ stroke: $cor });
  $("#polo1DJI").css({ fill: $cor });
  /* Abre disjuntor do secund�rio */
  DJI = true;
  manobra_DJI();
}

/* Manobra DJI */
function manobra_DJI() {
  if(!DJE && !DJI){exit;};
  DJI = !DJI;
  if(DJI == true) {
    $("#un_DJI").attr('value', 'Abrir');
    $cor = "#ff0000"; /* vermelho */
    $("#Isectrafo").html("--A"); /* corrente do secund�rio do transformador */
  } else {
    $("#un_DJI").attr('value', 'Fechar');
    $cor = "#00ff00"; /* verde */
    $("#Isectrafo").html("0 A"); /* corrente do secund�rio do transformador */
  };
  $("#manoplaDJI").css({ stroke: $cor });
  atualiza_Barra();
}

/* Barra */
function atualiza_Barra() {
    if(DJI || DJG) {
      $cor = "#ff0000"; /* vermelho */
      $Vbarra = Vbbt.toPolar().r.toFixed(1).toString() + " V";
      $("#Irede").html(Irede.toPolar().r.toFixed(1).toString() + " A"); /* corrente da rede */
      $("#Iger").html(Iger.toPolar().r.toFixed(1).toString() + " A"); /* corrente do gerador */
      $("#angIger").html(angIger.toFixed(1).toString() + " o"); /* corrente do secund�rio do gerador */
      $("#Ic1").html(Ic1.toPolar().r.toFixed(1).toString() + " A"); /* corrente da carga 01 */
      $("#Ic2").html(Ic2.toPolar().r.toFixed(1).toString() + " A"); /* corrente da carga 02 */
      $("#Imotor").html(Imotor.toPolar().r.toFixed(1).toString() + " A"); /* corrente do motor */
      $("#Isectrafo").html(Isectrafo.toPolar().r.toFixed(1).toString() + " A"); /* corrente do secund�rio do transformador */
      $("#angIsectrafo").html(angIsectrafo.toFixed(1).toString() + " o"); /* corrente do secund�rio do transformador */
      $("#un_trafoPotAtual").val(PotAtualTrafo.toPolar().r.toFixed(1).toString());
      $("#un_concFPAtual").val(FPAtualRede);
      $("#un_gerFPAtual").val(FPAtualGer);
      $("#labelPotAtualTrafo").html($("#un_trafoPotAtual").val() + " kVA"); /* potência do transformador */
      $("#labelPotAtualGer").html(PotAtualGer.toPolar().r.toFixed(1).toString() + " kVA"); /* potência do gerador */
      $("#labelPotAtualC1").html(PotAtualC1.toPolar().r.toFixed(1).toString() + " kVA"); /* potência da carga01 */
      $("#labelPotAtualC2").html(PotAtualC2.toPolar().r.toFixed(1).toString() + " kVA"); /* potência da carga02 */
      $("#labelPotAtualMotor").html(PotAtualMotor.toPolar().r.toFixed(1).toString() + " HP"); /* potência do transformador */
    } else {
      $cor = "#00ff00"; /* verde */
      $Vbarra = "0 V";
      $("#Ic1").html("0 A"); /* corrente da carga 01 */
      $("#Ic2").html("0 A"); /* corrente da carga 02 */
      $("#Imotor").html("0 A"); /* corrente do motor */
      $("#Isectrafo").html("0 A"); /* corrente do secund�rio do transformador */
      $("#Iger").html("0 A"); /* corrente do gerador */
    };
    $("#polo2DJI").css({ fill: $cor });
    $("#barra").css({ fill: $cor, stroke: $cor });
    $("#caboTrafoBarra").css({ stroke: $cor });
    $("#caboBarraDJC1").css({ stroke: $cor });
    $("#polo1DJC1").css({ fill: $cor });
    $("#caboBarraDJC2").css({ stroke: $cor });
    $("#polo1DJC2").css({ fill: $cor });
    $("#caboBarraDJM").css({ stroke: $cor });
    $("#polo1DJM").css({ fill: $cor });
    $("#caboBarraDJG").css({ stroke: $cor });
    $("#polo2DJG").css({ fill: $cor });
    $("#tspan4158-0").css({ stroke: $cor, fill: $cor });
    $("#tspan4158-0").html($Vbarra); /* tens�o da barra = 380 V */
    carga01($cor);
    carga02($cor);
    motor($cor);

}

/* Atualiza valores nominais para unifilar */
function atualizaUnifilar() {
    var max, min, passo;

    /* Concessionaria */
    $("#un_concTensao").val($("#co_concTensao").val()); /* tens�o nominal da rede */
    $("#un_concTensaoAtual").val($("#co_concTensao").val()); /* tens�o atual da rede */
    $("#labelVrede").html($("#co_concTensao").val() + "kV"); /* tens�o nominal da rede */
    max = (parseFloat($("#co_concTensao").val()) * (1 + (parseFloat($("#co_limSupconcTensao").val())/100))).toFixed(1);
    min = (parseFloat($("#co_concTensao").val()) * (1 - (parseFloat($("#co_limInfconcTensao").val())/100))).toFixed(1);
    $("#un_concTensaoAtual").attr('min', min);
    $("#un_concTensaoAtual").attr('max', max);

    /* Transformador */
    $("#labelV1Trafo").html($("#co_concTensao").val() + "kV"); /* tens�o nominal prim�rio do transformador */
    $("#un_trafoPotNominal").val($("#co_trafoPot").val()); /* pot�ncia nominal do transformador */
    $("#labelPotNominalTrafo").html($("#co_trafoPot").val() + "kVA"); /* pot�ncia nominal do transformador */
    $("#labelZTrafo").html($("#co_trafoZ").val() + "%"); /* imped�ncia do transformador */
    $("#labelV2Trafo").html($("#co_trafoTensaoSec").val() + "V"); /* tens�o nominal do secund�rio do transformador */

    /* Gerador */
    $("#labelVGer").html($("#co_trafoTensaoSec").val() + "V"); /* tens�o nominal do gerador */
    $("#un_gerTensao").val($("#co_trafoTensaoSec").val()); /* tens�o nominal do gerador */
    $("#un_gerPotNominal").val($("#co_gerPot").val()); /* pot�ncia nominal do gerador */
    $("#labelPotNominalGer").html($("#co_gerPot").val() + "kVA"); /* pot�ncia nominal do gerador */
    $("#labelZGer").html($("#co_gerZ").val() + "%"); /* imped�ncia do gerador */
    max = (parseFloat($("#co_gerPot").val()) * (1 + (parseFloat($("#co_sobregerPot").val())/100)));
    min = parseFloat($("#co_gerPot").val()) * (-0.5);
    passo = parseFloat($("#co_gerPot").val()) * (0.1);
    $("#un_gerPotAtual").val(0);
    $("#un_gerPotAtual").attr('min', min);
    $("#un_gerPotAtual").attr('max', max);
    $("#un_gerPotAtual").attr('step', passo);

    /* Barra */
    $("#tspan4158-0").html($("#co_trafoTensaoSec").val() + "V"); /* tens�o nominal do gerador (barra) */

    /* Carga 01 */
    $("#un_potNomC01").val($("#co_c1Pot").val()); /* pot�ncia nominal da carga 01 */
    $("#labelPotNominalC1").html($("#co_c1Pot").val() + "kVA"); /* pot�ncia nominal da carga 01 */
    $("#un_potAtualC01").val($("#co_c1Pot").val()); /* pot�ncia atual da carga 01 */
    $("#labelFPC1").html("FP " + $("#co_c1FP").val()); /* fator de pot�ncia da carga 01 */
    max = (parseFloat($("#co_c1Pot").val()) * (1 + (parseFloat($("#co_sobrec1Pot").val())/100)));
    min = 0;
    passo = parseFloat($("#co_c1Pot").val()) * (0.1);
    $("#un_potAtualC01").attr('min', min);
    $("#un_potAtualC01").attr('max', max);
    $("#un_potAtualC01").attr('step', passo);

    /* Carga 02 */
    $("#un_potNomC02").val($("#co_c2Pot").val()); /* pot�ncia nominal da carga 02 */
    $("#labelPotNominalC2").html($("#co_c2Pot").val() + "kVA"); /* pot�ncia nominal da carga 02 */
    $("#un_potAtualC02").val($("#co_c2Pot").val()); /* pot�ncia atual da carga 02 */
    $("#labelFPC2").html("FP " + $("#co_c2FP").val()); /* fator de pot�ncia da carga 02 */
    max = (parseFloat($("#co_c2Pot").val()) * (1 + (parseFloat($("#co_sobrec2Pot").val())/100)));
    min = 0;
    passo = parseFloat($("#co_c2Pot").val()) * (0.1);
    $("#un_potAtualC02").attr('min', min);
    $("#un_potAtualC02").attr('max', max);
    $("#un_potAtualC02").attr('step', passo);

    /* Motor */
    $("#un_potNomMotor").val($("#co_motPot").val()); /* pot�ncia nominal do motor */
    $("#un_potAtualMotor").val($("#co_motPot").val()); /* pot�ncia atual do motor */
    $("#labelPotNominalMotor").html($("#co_motPot").val() + "HP"); /* pot�ncia nominal do motor */
    $("#labelIpIn").html("Ip/In " + $("#co_motIpIn").val()); /* Ip/In */
    max = (parseFloat($("#co_motPot").val()) * (1 + (parseFloat($("#co_sobremotPot").val())/100)));
    min = 0;
    passo = parseFloat($("#co_motPot").val()) * (0.1);
    $("#un_potAtualMotor").attr('min', min);
    $("#un_potAtualMotor").attr('max', max);
    $("#un_potAtualMotor").attr('step', passo);
    
    calculaSistema();
}

/* Seleciona X/R do Trafo */

function selecionaXRTrafo(){
	var pot = $("#co_trafoPot").val();
}