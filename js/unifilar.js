/*
 *  Variaveis
 */
var DJE = true; /* disjuntor de entrada */
var DJI = true; /* disjuntor de interliga??o BT */
var DJG = false; /* disjuntor do gerador */
var DJC1 = true; /* disjuntor da carga 01 */
var DJC2 = false; /* disjuntor da carga 02 */
var DJM = true; /* disjuntor do motor */
var GER = false; /* gerador ligado = true */

var Pbase, V1base, V2base, I1base, I2base, Z1base, Z2base, Icc;
var Ac1, Ac2, Amotor;
var Irede, Isectrafo, Ic1, Ic2, Imotor, Iger;
var angIrede, angIsectrafo, angIc1, angIc2, angImotor, angIger;
var Vbbt, Vbbtpu, Vger;
var PotAtualTrafo, PotAtualGer, PotAtualC1, PotAtualC2, PotAtualMotor;
var FPAtualRede, FPAtualGer;
var Zger;
var Zeq, Aeq, Ztotal, Vthv, Zthv;
var Vredepu, Zrede, Arede, Ztrafo, Atrafo, Ager, FPMotor, RdMotor;

var angcc, Acc;

var concTensaoAtual, trafoTapPrim, potAtualC01, c1FP, potAtualC02, c2FP, motFP, motRend, potAtualMotor;

var rFPrede, rVrede, rIrede, rV2trafo, rI2trafo, rP32trafo, rVc1, rIc1, rVc2, rIc2, rVmotor, rImotor, rVger, rIger, rP32ger, rFPger, rPger;

var moduloVger = 1, anguloVger = 0;

var $cor; /* auxiliar */

/* Liga/Desliga Gerador */
function manobra_GER() {
  GER = !GER;
  if(GER == true) {
	  ligaGER();
  } else {
	  desligaGER();
	  DJG = true;
	  manobra_DJG();
  }
  atualizaServidor();
}
function ligaGER(){
	GER = true;
	$("#un_LigaGer").attr('value', 'Off');
    $cor = "#ff0000"; /* vermelho */
    $("#un_DJG").removeAttr("disabled");
    $("#un_gerAVRmenos").removeAttr("disabled");
    $("#un_gerAVRmais").removeAttr("disabled");
    $("#un_gerAcionadormenos").removeAttr("disabled");
    $("#un_gerAcionadormais").removeAttr("disabled");
    $("#Iger").html("-- A"); /* corrente do gerador */
    if (Vbbtpu == 0){
    	Vger = math.complex(parseFloat($("#co_gerTensao").val())/V2base, 0);
    } else {
    	Vger = Vbbtpu;
    }
    moduloVger =  1;
    anguloVger = 0;
    corGer();
}
function desligaGER(){
	GER = false;
	$("#un_LigaGer").attr('value', 'On');
    $cor = "#00ff00"; /* verde */
    $("#un_DJG").attr("disabled", "disabled");
    $("#un_gerAVRmenos").attr("disabled", "disabled");
    $("#un_gerAVRmais").attr("disabled", "disabled");
    $("#un_gerAcionadormenos").attr("disabled", "disabled");
    $("#un_gerAcionadormais").attr("disabled", "disabled");
    Vger = math.complex(0,0);
    corGer();
}
function corGer(){
	$("#letraG").css({ fill: $cor, stroke: $cor });
	$("#gerador").css({ stroke: $cor });
	$("#caboGer").css({ stroke: $cor });
	$("#polo1DJG").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJG */
function manobra_DJG() {
  DJG = !DJG;
  if(DJG == true) {
    fechaDJG();
  } else {
	abreDJG();
  }
 //$("#manoplaDJG").css({ stroke: $cor });
  calculaSistema();
}
function fechaDJG(){
	DJG = true;
	$("#un_DJG").attr('value', 'Open');
    $("#Iger").html("-- A"); /* corrente do gerador */
    $("#manoplaDJG").css({ stroke: "#ff0000" });
}
function abreDJG(){
	DJG = false;
    $("#un_DJG").attr('value', 'Close');
    $("#Iger").html("0 A"); /* corrente do gerador */
    $("#manoplaDJG").css({ stroke: "#00ff00" });	
}

/* Manobra DJM */
function manobra_DJM() {
  DJM = !DJM;
  if(DJM == true) {
	fechaDJM();
  } else {
	abreDJM();
  };
  $("#manoplaDJM").css({ stroke: $cor });
  calculaSistema();
}
function abreDJM(){
	DJM = false;
	$("#un_DJM").attr('value', 'Close');
    $cor = "#00ff00"; /* verde */
    $("#Imotor").html("0 A"); /* corrente do motor */
    motor($cor);
}
function fechaDJM(){
	DJM = true;
	$("#un_DJM").attr('value', 'Open');
    $cor = "#ff0000"; /* vermelho */
    $("#Imotor").html("--A"); /* corrente do motor */
    motor($cor);
}
function motor($cor) {
  if(Vbbt = 0 || !DJM) { $cor = "#00ff00"; };
  $("#polo2DJM").css({ fill: $cor, stroke: $cor });
  $("#caboMotor").css({ stroke: $cor });
  $("#motor").css({ stroke: $cor });
  $("#tspan4735-6").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJC1 */
function manobra_DJC1() {
  DJC1 = !DJC1;
  if(DJC1 == true) {
    $("#un_DJC1").attr('value', 'Open');
    $cor = "#ff0000"; /* vermelho */
    $("#Ic1").html("--A"); /* corrente da carga 01 */
  } else {
    $("#un_DJC1").attr('value', 'Close');
    $cor = "#00ff00"; /* verde */
    $("#Ic1").html("0 A"); /* corrente da carga 01 */
  };
  $("#manoplaDJC1").css({ stroke: $cor });
  carga01($cor);
  calculaSistema();
}
function carga01($cor) {
  if(Vbbt = 0 || !DJC1) { $cor = "#00ff00"; };
  $("#polo2DJC1").css({ fill: $cor, stroke: $cor });
  $("#caboC1").css({ stroke: $cor });
  $("#cargaC1").css({ stroke: $cor });
  $("#path5000").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJC2 */
function manobra_DJC2() {
  DJC2 = !DJC2;
  if(DJC2 == true) {
    $("#un_DJC2").attr('value', 'Open');
    $cor = "#ff0000"; /* vermelho */
    $("#Ic2").html("--A"); /* corrente da carga 02 */
  } else {
    $("#un_DJC2").attr('value', 'Close');
    $cor = "#00ff00"; /* verde */
    $("#Ic2").html("0 A"); /* corrente da carga 02 */
  };
  $("#manoplaDJC2").css({ stroke: $cor });
  carga02($cor);
  calculaSistema();
}
function carga02($cor) {
  if(Vbbt = 0 || !DJC2) { $cor = "#00ff00"; };
  $("#polo2DJC2").css({ fill: $cor, stroke: $cor });
  $("#caboC2").css({ stroke: $cor });
  $("#rect4988-5").css({ stroke: $cor });
  $("#cargaC2").css({ fill: $cor, stroke: $cor });
}

/* Manobra DJE */
function manobra_DJE() {
  DJE = !DJE;
  if(DJE == true) {
    $("#un_DJE").attr('value', 'Open');
    $cor = "#ff0000"; /* vermelho */
    $("#Irede").html("--A"); /* corrente de entrada */
  } else {
    $("#un_DJE").attr('value', 'Close');
    $cor = "#00ff00"; /* verde */
    $("#Irede").html("0 A"); /* corrente de entrada */
  };
  $("#rect4142").css({ fill: $cor });
  $("#caboPrimTrafo").css({ stroke: $cor });
  $("#primTrafo").css({ stroke: $cor });
  $("#secTrafo").css({ stroke: $cor });
  $("#caboSecTrafo").css({ stroke: $cor });
  $("#polo1DJI").css({ fill: $cor });
  /* Abre disjuntor do secund?rio */
  DJI = true;
  manobra_DJI();
}

/* Manobra DJI */
function manobra_DJI() {
  if(!DJE && !DJI) return false;
  DJI = !DJI;
  if(DJI == true) {
    fechaDJI();
  } else {
	abreDJI();
  }
  calculaSistema();
}
function fechaDJI(){
	DJI = true;
	$("#un_DJI").attr('value', 'Open');
	$("#Isectrafo").html("--A"); /* corrente do secund?rio do transformador */
	$("#manoplaDJI").css({ stroke: "#ff0000" });
}
function abreDJI(){
	DJI = false;
    $("#un_DJI").attr('value', 'Close');
    $("#Isectrafo").html("0 A"); /* corrente do secund?rio do transformador */
	$("#manoplaDJI").css({ stroke: "#00ff00" });
}

/* Barra */
function atualiza_Barra() {

	if(DJI || DJG) {
      $cor = "#ff0000"; /* vermelho */
      } else {
      $cor = "#00ff00"; /* verde */
      $("#Ic1").html("0 A"); /* corrente da carga 01 */
      $("#Ic2").html("0 A"); /* corrente da carga 02 */
      $("#Imotor").html("0 A"); /* corrente do motor */
      $("#Isectrafo").html("0 A"); /* corrente do secund?rio do transformador */
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
    carga01($cor);
    carga02($cor);
    motor($cor);
    $("#labelVrede").html($("#un_concTensaoAtual").val() + "kV"); /* tens?o nominal da rede */

}

/* Atualiza valores nominais para unifilar */
function atualizaUnifilar() {
    var max, min, passo;

    /* Concessionaria */
    $("#un_concTensao").val($("#co_concTensao").val()); /* tens?o nominal da rede */
    $("#un_concTensaoAtual").val($("#co_concTensao").val()); /* tens?o atual da rede */
    $("#labelVrede").html($("#co_concTensao").val() + "kV"); /* tens?o nominal da rede */
    max = (parseFloat($("#co_concTensao").val()) * (1 + (parseFloat($("#co_limSupconcTensao").val())/100))).toFixed(1);
    min = (parseFloat($("#co_concTensao").val()) * (1 - (parseFloat($("#co_limInfconcTensao").val())/100))).toFixed(1);
    $("#un_concTensaoAtual").attr('min', min);
    $("#un_concTensaoAtual").attr('max', max);

    /* Transformador */
    $("#labelV1Trafo").html($("#co_concTensao").val() + "kV"); /* tens?o nominal prim?rio do transformador */
    $("#un_trafoPotNominal").val($("#co_trafoPot").val()); /* pot?ncia nominal do transformador */
    $("#labelPotNominalTrafo").html($("#co_trafoPot").val() + "kVA"); /* pot?ncia nominal do transformador */
    $("#labelZTrafo").html($("#co_trafoZ").val() + "%"); /* imped?ncia do transformador */
    $("#labelV2Trafo").html($("#co_trafoTensaoSec").val() + "V"); /* tens?o nominal do secund?rio do transformador */

    /* Gerador */
    $("#labelVGer").html($("#co_trafoTensaoSec").val() + "V"); /* tens?o nominal do gerador */
    $("#un_gerTensao").val($("#co_trafoTensaoSec").val()); /* tens?o nominal do gerador */
    $("#un_gerPotNominal").val($("#co_gerPot").val()); /* pot?ncia nominal do gerador */
    $("#labelPotNominalGer").html($("#co_gerPot").val() + "kVA"); /* pot?ncia nominal do gerador */
    $("#labelZGer").html($("#co_gerZ").val() + "%"); /* imped?ncia do gerador */
    max = (parseFloat($("#co_gerPot").val()) * (1 + (parseFloat($("#co_sobregerPot").val())/100)));
    min = parseFloat($("#co_gerPot").val()) * (-0.5);
    passo = parseFloat($("#co_gerPot").val()) * (0.1);
    $("#un_gerPotAtual").val(0);
    $("#un_gerPotAtual").attr('min', min);
    $("#un_gerPotAtual").attr('max', max);
    $("#un_gerPotAtual").attr('step', passo);
    if (!GER) Vger = math.complex(0,0);
    
    /* Barra */
    $("#tspan4158-0").html($("#co_trafoTensaoSec").val() + "V"); /* tens?o nominal do gerador (barra) */

    /* Carga 01 */
    $("#un_potNomC01").val($("#co_c1Pot").val()); /* pot?ncia nominal da carga 01 */
    $("#labelPotNominalC1").html($("#co_c1Pot").val() + "kVA"); /* pot?ncia nominal da carga 01 */
    $("#un_potAtualC01").val($("#co_c1Pot").val()); /* pot?ncia atual da carga 01 */
    $("#labelFPC1").html("FP " + $("#co_c1FP").val()); /* fator de pot?ncia da carga 01 */
    max = (parseFloat($("#co_c1Pot").val()) * (1 + (parseFloat($("#co_sobrec1Pot").val())/100)));
    min = 0;
    passo = parseFloat($("#co_c1Pot").val()) * (0.1);
    $("#un_potAtualC01").attr('min', min);
    $("#un_potAtualC01").attr('max', max);
    $("#un_potAtualC01").attr('step', passo);

    /* Carga 02 */
    $("#un_potNomC02").val($("#co_c2Pot").val()); /* pot?ncia nominal da carga 02 */
    $("#labelPotNominalC2").html($("#co_c2Pot").val() + "kVA"); /* pot?ncia nominal da carga 02 */
    $("#un_potAtualC02").val($("#co_c2Pot").val()); /* pot?ncia atual da carga 02 */
    $("#labelFPC2").html("FP " + $("#co_c2FP").val()); /* fator de pot?ncia da carga 02 */
    max = (parseFloat($("#co_c2Pot").val()) * (1 + (parseFloat($("#co_sobrec2Pot").val())/100)));
    min = 0;
    passo = parseFloat($("#co_c2Pot").val()) * (0.1);
    $("#un_potAtualC02").attr('min', min);
    $("#un_potAtualC02").attr('max', max);
    $("#un_potAtualC02").attr('step', passo);

    /* Motor */
    $("#un_potNomMotor").val($("#co_motPot").val()); /* pot?ncia nominal do motor */
    $("#un_potAtualMotor").val($("#co_motPot").val()); /* pot?ncia atual do motor */
    $("#labelPotNominalMotor").html($("#co_motPot").val() + "HP"); /* pot?ncia nominal do motor */
    $("#labelIpIn").html("Ip/In " + $("#co_motIpIn").val()); /* Ip/In */
    max = (parseFloat($("#co_motPot").val()) * (1 + (parseFloat($("#co_sobremotPot").val())/100)));
    min = 0;
    passo = parseFloat($("#co_motPot").val()) * (0.1);
    $("#un_potAtualMotor").attr('min', min);
    $("#un_potAtualMotor").attr('max', max);
    $("#un_potAtualMotor").attr('step', passo);
    
    /* Curto-circuito */
    $("#un_pontoCurto").removeAttr("disabled");
    
    calculaSistema();
}

/* Calculo do sistema */
function calculaSistema(){
	
	var aux, inom, ipu, ang, xr;
	
	pegaValores();
	/* Tensao do sistema */
	Vredepu = concTensaoAtual/trafoTapPrim;
	/* Carga 01 */
	inom = potAtualC01 * 1000/(V2base * math.sqrt(3));
	ipu = inom/I2base;
	ang = math.acos(c1FP);
	Ac1 = math.complex(((1/ipu) * math.cos(ang)), ((1/ipu) * math.sin(ang)));
	if (DJC1){
		Ac1 = math.inv(Ac1);
	} else {
		Ac1 = math.complex(0, 0);
	};
	/* Carga 02 */
	inom = potAtualC02 * 1000/(V2base * math.sqrt(3));
	ipu = inom/I2base;
	ang = math.acos(c2FP);
	Ac2 = math.complex(((1/ipu) * math.cos(ang)), ((1/ipu) * math.sin(ang)));
	if (DJC2){
		Ac2 = math.inv(Ac2);
	} else {
		Ac2 = math.complex(0, 0);
	};
	/* Motor */
	FPMotor = motFP;
	RdMotor = motRend;
	inom = potAtualMotor * 746/(V2base * math.sqrt(3) * FPMotor * RdMotor * 0.01);
	ipu = inom/I2base;
	ang = math.acos(FPMotor);
	Amotor = math.complex(((1/ipu) * math.cos(ang)), ((1/ipu) * math.sin(ang)));
	$("#Imot_direta").show();
	$("#Imot_reversa").hide();
	if (DJM){
		Amotor = math.inv(Amotor);
	} else {
		Amotor = math.complex(0, 0);
	};
	/* Rede */
	ang = math.atan(parseFloat($("#co_concXR").val()));
	Zrede = math.complex(math.cos(ang), math.sin(ang));
	/* Transformador */
	Zeq = (parseFloat($("#co_trafoZ").val())/100) * (Pbase/(parseFloat($("#co_trafoPot").val())*0.001)) * (math.pow(trafoTapPrim, 2)/math.pow(V1base, 2));
	xr = parseFloat($("#co_trafoXR").val());
	aux = Zeq/math.sqrt(1+math.pow(xr, 2));
	Ztrafo = math.complex(aux, aux * xr);
	Atrafo = math.inv(Ztrafo);
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
	if(DJE && DJI && (DJC1 || DJC2 || DJM)) {
		ipu = math.multiply(Vredepu, math.inv(Ztotal));
	} else {
		ipu = math.complex(0, 0);
	}
	/* Thevenan da rede */
	if (DJE && DJI) {
		Vbbtpu = math.add(Vredepu, math.multiply(math.multiply(ipu, Zrede), -1));
	} else {
		Vbbtpu = math.complex(0,0);
	}
	
	Athv = math.add(Arede, Aeq);
	Zthv = math.inv(Athv);
	if (DJG) {
		/* Verifica se tem tensao de rede, se nao, calcula somente Vger */
		if(Vbbtpu.toPolar().r > 0){
			if(RLG_ModoOperacao == 2){
				// 2 - manual
				Vger = math.multiply(Vbbtpu, moduloVger);
				Vger = math.multiply(Vger, math.complex(math.cos(0.0174532925*anguloVger), math.sin(0.0174532925*anguloVger)));
			}
			if(RLG_ModoOperacao == 1){
				// 1 - droop
			}
			if(RLG_ModoOperacao == 0){
				// 0 - isocrono
				Vger = math.add(Vbbtpu, (math.multiply(math.multiply(ipu, RLG_CargaIsoc), math.add(Zger, Zthv))));
			}
		} else {
			Vger = math.complex(parseFloat($("#co_gerTensao").val())/V2base, 0);
		}
		if(Athv.toPolar().r > 0){
			Iger = math.multiply(math.add(math.multiply(Vbbtpu, -1), Vger), math.inv(math.add(Zthv, Zger)));
		} else {
			Iger = math.complex(0, 0);
		}
		Vbbtpu = math.add(Vger, math.multiply(math.multiply(Iger, Zger), -1));
		ipu = math.multiply(math.add(Vredepu, math.multiply(Vbbtpu, -1)), Arede);
	} else {
		Iger = math.complex(0, 0);
	}
	/* Recalcula */
	Irede = math.multiply(ipu, I1base);
	angIrede = Irede.toPolar().phi;
	//angIrede.toFixed(1);
	// Gerador
	Iger = math.multiply(Iger, I2base);
	angIger = Iger.toPolar().phi;
	angIger.toFixed(1);
	// Trafo
	angIsectrafo = 0;
	Isectrafo = math.multiply(ipu, I2base);
	if (Isectrafo != 0){
		angIsectrafo = Isectrafo.toPolar().phi;
		if(math.cos(angIsectrafo) < 0){
			$("#Isec_direta").hide();
			$("#Isec_reversa").show();
		} else {
			$("#Isec_direta").show();
			$("#Isec_reversa").hide();
		}
		angIsectrafo *= 57.295779513;
	}
	angIsectrafo.toFixed(1);
	// Tensao na barra
	Vbbt = math.multiply(Vbbtpu, V2base);
	// Carga 01
	Ic1 = math.multiply(Vbbtpu, Ac1);
	Ic1 = math.multiply(Ic1, I2base);
	angIc1 = (Ic1.toPolar().phi * 57.295779513).toFixed(1);
	// Carga 02
	Ic2 = math.multiply(Vbbtpu, Ac2);
	Ic2 = math.multiply(Ic2, I2base);
	angIc2 = (Ic2.toPolar().phi * 57.295779513).toFixed(1);
	// Motor
	Imotor = math.multiply(Vbbtpu, Amotor);
	Imotor = math.multiply(Imotor, I2base);
	angImotor = Imotor.toPolar().phi;
	//angImotor = (Imotor.toPolar().phi * 57.295779513).toFixed(1);
	// Potencias absolutas
	PotAtualTrafo = math.multiply(Vbbt, Isectrafo);
	PotAtualTrafo = math.multiply(PotAtualTrafo, math.sqrt(3)/1000);
	FPAtualRede = math.cos(Irede.toPolar().phi).toFixed(2);
	if(FPAtualRede < 0){
		$("#Ient_direta").hide();
		$("#Ient_reversa").show();
	} else {
		$("#Ient_direta").show();
		$("#Ient_reversa").hide();
	}
	PotAtualGer = math.multiply(Vbbt, Iger);
	PotAtualGer = math.multiply(PotAtualGer, math.sqrt(3)/1000);
	FPAtualGer = math.cos(Iger.toPolar().phi).toFixed(2);
	if(FPAtualGer < 0){
		$("#Iger_direta").hide();
		$("#Iger_reversa").show();
	} else {
		$("#Iger_direta").show();
		$("#Iger_reversa").hide();
	}
	PotAtualC1 = math.multiply(Vbbt, Ic1);
	PotAtualC1 = math.multiply(PotAtualC1, math.sqrt(3)/1000);
	PotAtualC2 = math.multiply(Vbbt, Ic2);
	PotAtualC2 = math.multiply(PotAtualC2, math.sqrt(3)/1000);
	PotAtualMotor = math.multiply(Vbbt, Imotor);
	PotAtualMotor = math.multiply(PotAtualMotor, math.sqrt(3) * FPMotor * RdMotor/74600);

	rVrede =concTensaoAtual * 100;
	rIrede = Irede.toPolar().r.toFixed(1) * 10;
	$("#Irede").html( Irede.toPolar().r.toFixed(1).toString() + " A"); /* corrente da rede */
	rFPrede = math.cos(angIrede).toFixed(2);
	$("#FPRede").html("FP " + rFPrede.toString());
	rFPrede *= 100;
	rV2trafo = Vbbt.toPolar().r.toFixed(1) * 10;
	rVc1 = 0;
	rVc2 = 0;
	rVmotor = 0;
	if(DJC1){rVc1 = rV2trafo};
	if(DJC2){rVc2 = rV2trafo};
	if(DJM){rVmotor = rV2trafo};
	$("#tspan4158-0").html(Vbbt.toPolar().r.toFixed(1).toString() + " V"); /* tens?o da barra = 380 V */
    //$("#angIrede").html(angIrede.toString() + " o"); /* angulo da corrente da rede */
	rVger = (Vger.toPolar().r * V2base).toFixed(1) * 10;
	rIger = Iger.toPolar().r.toFixed(1) * 10;
	$("#Iger").html(Iger.toPolar().r.toFixed(1).toString() + " A"); /* corrente do gerador */
	rFPger = math.cos(angIger).toFixed(2);
	$("#FPGer").html("FP " + rFPger.toString());
	rFPger *= 100;
	angIger *= 57.295779513;
	$("#angIger").html(angIger.toFixed(1).toString() + " o"); /* corrente do secund?rio do gerador */
	rIc1 = Ic1.toPolar().r.toFixed(1) * 10;
	$("#Ic1").html(Ic1.toPolar().r.toFixed(1).toString() + " A"); /* corrente da carga 01 */
	$("#angIc1").html(angIc1.toString() + " o"); /* angulo da corrente da carga 01 */
	rIc2 = Ic2.toPolar().r.toFixed(1) * 10;
	$("#Ic2").html(Ic2.toPolar().r.toFixed(1).toString() + " A"); /* corrente da carga 02 */
	$("#angIc2").html(angIc2.toString() + " o"); /* angulo da corrente da carga 02 */
	rImotor = Imotor.toPolar().r.toFixed(1) * 10;
	rFPmotor = math.cos(angImotor).toFixed(2);
	$("#FPMotor").html("FP " + rFPmotor.toString());
	rFPmotor *= 100; 
	$("#Imotor").html(Imotor.toPolar().r.toFixed(1).toString() + " A"); /* corrente do motor */
	$("#angImotor").html(angImotor.toString() + " o"); /* angulo da corrente do motor */
	rI2trafo = Isectrafo.toPolar().r.toFixed(1) * 10;
	rP32trafo = PotAtualTrafo.toPolar().r.toFixed(1) * 10;
	$("#Isectrafo").html(Isectrafo.toPolar().r.toFixed(1).toString() + " A"); /* corrente do secund?rio do transformador */
	$("#angIsectrafo").html(angIsectrafo.toFixed(1).toString() + " o"); /* corrente do secund?rio do transformador */
	$("#labelPotAtualTrafo").html(PotAtualTrafo.toPolar().r.toFixed(1).toString() + " kVA"); /* potência do transformador */
	$("#un_concFPAtual").val(FPAtualRede);
	$("#un_gerFPAtual").val(FPAtualGer);
	rPger = PotAtualGer.toPolar().r.toFixed(1);
	$("#labelPotAtualGerReativo").html(PotAtualGer.im.toFixed(1).toString() + " kVAr"); /* potência do gerador */
	$("#labelPotAtualGerAtivo").html(PotAtualGer.re.toFixed(1).toString() + " kW"); /* potência do gerador */
	rPger *= 10;
	$("#labelPotAtualC1").html(PotAtualC1.toPolar().r.toFixed(1).toString() + " kVA"); /* potência da carga01 */
	$("#labelPotAtualC2").html(PotAtualC2.toPolar().r.toFixed(1).toString() + " kVA"); /* potência da carga02 */
	$("#labelPotAtualMotor").html(PotAtualMotor.toPolar().r.toFixed(1).toString() + " HP"); /* potência do transformador */
	
	atualiza_iReles();
	
	atualiza_Barra();
	
	atualizaServidor();
}

/* Seleciona X/R do Trafo */

function selecionaXRTrafo(){
	var pot = $("#co_trafoPot").val();
}

/* Trata msgs do servidor */
function trataMsg(msg){
    //alert("Message is received..." + msg);
    ids = msg.split(";");
    switch(ids[0]){
    case "1":
	    setIDsReles(ids);	
	    $("#ID_RLE").html("(" + zeroPad(ids[1], 3) + ")");
	    $("#ID_RLI").html("(" + zeroPad(ids[2], 3) + ")");
	    $("#ID_RLG").html("(" + zeroPad(ids[3], 3) + ")");
	    $("#ID_RLC1").html("(" + zeroPad(ids[4], 3) + ")");
	    $("#ID_RLC2").html("(" + zeroPad(ids[5], 3) + ")");
	    $("#ID_RLM").html("(" + zeroPad(ids[6], 3) + ")");
	    break;

    case "2":
    	exibeJanela("Mensagem!", "<div class='center-block'><h1>" + ids[1] + "</H1></div>");
    	break;
    	
    case "5":
    	setOutputsRele(msg);
    	break;

    case "6":
    	setRegistersRele(msg);
    	break;
    }
}

/* Coloca zeros na frente do múnero */
function zeroPad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
}

/* Pega valores para o c�lculo */
function pegaValores(){
	/* Valores base */
	Pbase = parseFloat($("#co_concPotCC3f").val());
	V1base = parseFloat($("#co_concTensao").val());
	V2base = parseFloat($("#co_trafoTensaoSec").val());
	I1base = (Pbase * 1000/(V1base * math.sqrt(3)));
	I2base = (Pbase * 1000000/(V2base * math.sqrt(3)));
	Z1base = math.pow(V1base, 2)/Pbase;
	Z2base = math.pow((V2base/1000), 2)/Pbase;
	
	concTensaoAtual = parseFloat($("#un_concTensaoAtual").val());
	trafoTapPrim = parseFloat($("#co_trafoTapPrim").val());
	potAtualC01 = parseFloat($("#un_potAtualC01").val());
	c1FP = parseFloat($("#co_c1FP").val());
	potAtualC02 = parseFloat($("#un_potAtualC02").val());
	c2FP = parseFloat($("#co_c2FP").val());
	
	motFP = parseFloat($("#co_motFP").val());
	motRend = parseFloat($("#co_motRend").val());
	potAtualMotor = parseFloat($("#un_potAtualMotor").val());
	
	if(simulacao) pegaValoresSimulacao();
	
}

/*
* Executado a cada um segundo
*/
function umSegundo(){
	today=new Date();
	h=zeroPad(today.getHours(), 2);
	m=zeroPad(today.getMinutes(), 2);
	s=zeroPad(today.getSeconds(), 2);
	$("#relogio").html(h+":"+m+":"+s);
}

/*
 * Funcoes de ajuste de avr e motor
 */
function avr(x){
	if (RLG_ModoOperacao != 2) return false;
	if(x){
		moduloVger += 0.0025;
	} else {
		moduloVger -= 0.0025;		
	}
	calculaSistema();
}

function acionador(x){
	if (RLG_ModoOperacao != 2) return false;
	if(x){
		anguloVger += 0.025;
	} else {
		anguloVger -= 0.025;		
	}
	if (anguloVger > 90) anguloVger = 90;
	if (anguloVger < -90) anguloVger = -90;
	calculaSistema();	
}

/*
 * Modos de operacao do motogerador
 */
function modoIsocrono(){
	if($("#un_gerisocrono").is(':checked')){
		$("#un_gerdroop").attr('checked', false);
		RLG_ModoOperacao = 0;
		RLG_CargaIsoc = parseInt($("#un_percisoc").val())/100;
	} else {
		if(!($("#un_gerdroop").is(':checked'))) RLG_ModoOperacao = 2;
	}
	calculaSistema();
}
function modoDroop(){
	if($("#un_gerdroop").is(':checked')){
		$("#un_gerisocrono").attr('checked', false);
		RLG_ModoOperacao = 1;
		RLG_CargaDrup = parseInt($("#un_percdroop").val())/100;
	} else {
		if(!($("#un_gerdroop").is(':checked'))) RLG_ModoOperacao = 2;
	}
	calculaSistema();
}
function atualizaPerIsoc(){
	RLG_CargaIsoc = parseInt($("#un_percisoc").val())/100;
	calculaSistema();
}

/*
 * Calculo de curto-circuito
 */
function calculoCurto(){
	
	calculaSistema();

	if(DJM){
		Imotor = math.multiply(Imotor, parseInt($("#co_motIpIn").val())); // contribuicao do motor
	} else {
		Imotor = math.complex(0,0);
	}
	
	switch ($("#un_pontoCurto").val()){
	case "0": // nenhum
		hideTodosCurtos();
		calculaSistema();
		break;
		
	case "1": // Entrada
		hideTodosCurtos();	
		$("#un_curtoEntrada").show();
		if(DJM && DJI){
			$("#Imot_reversa").show();
			$("#Imot_direta").hide();
		}
		if((DJM || DJG) && DJI){
			$("#Isec_reversa").show();
			$("#Isec_direta").hide();	
		}
		/* Calculos */
		
		angIrede = math.atan(parseFloat($("#co_concXR").val()));
		Arede = math.inv(math.complex(math.cos(angIrede), math.sin(angIrede)));
		Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
		if(!DJI) Imotor = math.complex(0,0);
		if(DJG && DJI){
			Iger = math.multiply(math.multiply(Vger, math.add(Ager, math.inv(Ztrafo))), I2base);
		} else {
			Iger = math.complex(0,0);
		}
		Isectrafo = math.add(Iger, Imotor);
		Vbbtpu = math.multiply(math.multiply(Iger, Ztrafo), V2base);
		Ic1 = math.complex(0, 0);
		Ic2 = math.complex(0, 0);
		if(DJC1) Ic1 = math.multiply(math.multiply(Vbbtpu, Ac1), I2base);
		if(DJC2) Ic2 = math.multiply(math.multiply(Vbbtpu, Ac2), I2base);
		atualizaDiagramaCurto();
		break;
						
	case "2": // Sec. T1
		hideTodosCurtos();	
		$("#un_curtoIsec").show();
		if(DJM && DJI){
			$("#Imot_reversa").show();
			$("#Imot_direta").hide();
		}
		if((DJM || DJG) && DJI){
			$("#Isec_reversa").show();
			$("#Isec_direta").hide();	
		}
		/* Calculos */
		
		angIrede = math.atan(parseFloat($("#co_concXR").val()));
		Zrede = math.complex(math.cos(angIrede), math.sin(angIrede));
		Zrede = math.add(Zrede, Ztrafo);
		Arede = math.inv(Zrede);
		Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
		if(!DJI) Imotor = math.complex(0,0);
		if(DJG && DJI){
			Iger = math.multiply(math.multiply(Vger, Ager), I2base);
		} else {
			Iger = math.complex(0,0);
		}
		Isectrafo = math.add(Iger, Imotor);
		Vbbtpu = math.complex(0, 0);
		Ic1 = math.complex(0, 0);
		Ic2 = math.complex(0, 0);
		atualizaDiagramaCurto();
		break;
		
	case "3": // Gerador
		hideTodosCurtos();
		$("#un_curtoGer").show();
		if(DJM && DJG){
			$("#Imot_reversa").show();
			$("#Imot_direta").hide();
		}
		/* Calculos */
		if(GER){
			Iger = math.multiply(math.multiply(Vger, Ager), I2base);
			$("#Iger").html((Iger.toPolar().r).toFixed(1).toString() + " A"); /* corrente do gerador */
		} else {
			Iger = math.complex(0,0);
		}
		if(DJG){
			angIrede = math.atan(parseFloat($("#co_concXR").val()));
			Zrede = math.complex(math.cos(angIrede), math.sin(angIrede));
			Zrede = math.add(Zrede, Ztrafo);
			Arede = math.inv(Zrede);
			Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
			Isectrafo = math.multiply(math.multiply(Vredepu, Arede), I2base);
			if(!DJI) Imotor = math.complex(0,0);
			Vbbtpu = math.complex(0, 0);
			Ic1 = math.complex(0, 0);
			Ic2 = math.complex(0, 0);
			atualizaDiagramaCurto();
		}
		break;
		
	case "4": // Barra
		hideTodosCurtos();
		$("#un_curtoBarra").show();
		if(DJM){
			$("#Imot_reversa").show();
			$("#Imot_direta").hide();
		}
		/* Calculos */
		if(DJE && DJI){
			angIrede = math.atan(parseFloat($("#co_concXR").val()));
			Zrede = math.complex(math.cos(angIrede), math.sin(angIrede));
			Zrede = math.add(Zrede, Ztrafo);
			Arede = math.inv(Zrede);
			Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
			Isectrafo = math.multiply(math.multiply(Vredepu, Arede), I2base);
		}
		if(DJG){
			Iger = math.multiply(math.multiply(Vger, Ager), I2base);
		} else {
			Iger = math.complex(0,0);
		}
		Vbbtpu = math.complex(0, 0);
		Ic1 = math.complex(0, 0);
		Ic2 = math.complex(0, 0);
		atualizaDiagramaCurto();
	 	break;
		
	case "5": // Carga 01
		hideTodosCurtos();
		$("#un_curtoIc1").show();
		if(DJM){
			$("#Imot_reversa").show();
			$("#Imot_direta").hide();
		}
		/* Calculos */
		if(DJC1 && DJI){
			angIrede = math.atan(parseFloat($("#co_concXR").val()));
			Zrede = math.complex(math.cos(angIrede), math.sin(angIrede));
			Zrede = math.add(Zrede, Ztrafo);
			Arede = math.inv(Zrede);
			Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
			Isectrafo = math.multiply(math.multiply(Vredepu, Arede), I2base);
		}
		if(DJG && DJC1){
			Iger = math.multiply(math.multiply(Vger, Ager), I2base);
		} else {
			Iger = math.complex(0,0);
		}
		Vbbtpu = math.complex(0, 0);
		Ic1 = math.add(math.add(Isectrafo, Imotor), Iger);
		Ic2 = math.complex(0, 0);
		atualizaDiagramaCurto();
	 	break;
		
	case "6": // Carga 02
		hideTodosCurtos();
		$("#un_curtoIc2").show();
		if(DJM){
			$("#Imot_reversa").show();
			$("#Imot_direta").hide();
		}
		/* Calculos */
		if(DJC2 && DJI){
			angIrede = math.atan(parseFloat($("#co_concXR").val()));
			Zrede = math.complex(math.cos(angIrede), math.sin(angIrede));
			Zrede = math.add(Zrede, Ztrafo);
			Arede = math.inv(Zrede);
			Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
			Isectrafo = math.multiply(math.multiply(Vredepu, Arede), I2base);
		}
		if(DJG && DJC2){
			Iger = math.multiply(math.multiply(Vger, Ager), I2base);
		} else {
			Iger = math.complex(0,0);
		}
		Vbbtpu = math.complex(0, 0);
		Ic1 = math.complex(0, 0);
		Ic2 = math.add(math.add(Isectrafo, Imotor), Iger)
		atualizaDiagramaCurto();
	 	break;	
	
	case "7": // Motor
		hideTodosCurtos();
		$("#un_curtoMotor").show();
		/* Calculos */
		if(DJM && DJI){
			angIrede = math.atan(parseFloat($("#co_concXR").val()));
			Zrede = math.complex(math.cos(angIrede), math.sin(angIrede));
			Zrede = math.add(Zrede, Ztrafo);
			Arede = math.inv(Zrede);
			Irede = math.multiply(math.multiply(Vredepu, Arede), I1base); 
			Isectrafo = math.multiply(math.multiply(Vredepu, Arede), I2base);
		}
		if(DJG && DJM){
			Iger = math.multiply(math.multiply(Vger, Ager), I2base);
		} else {
			Iger = math.complex(0,0);
		}
		Vbbtpu = math.complex(0, 0);
		Ic1 = math.complex(0, 0);
		Ic2 = math.complex(0, 0);
		Imotor = math.add(Isectrafo, Iger);
		atualizaDiagramaCurto();
	 	break;	
	}
}
function hideTodosCurtos(){
	$("#un_curtoEntrada").hide();
	$("#un_curtoIsec").hide();
	$("#un_curtoGer").hide();
	$("#un_curtoBarra").hide();
	$("#un_curtoIc1").hide();
	$("#un_curtoIc2").hide();
	$("#un_curtoMotor").hide();
	$("#Ient_reversa").hide();
	$("#Isec_reversa").hide();
	$("#Iger_reversa").hide();
	$("#Imot_reversa").hide();
}
function atualizaDiagramaCurto(){
	/* Atualiza diagrama */
	$("#tspan4158-0").html((Vbbtpu.toPolar().r).toFixed(1).toString() + " V"); /* tens?o da barra = 380 V */
	$("#Isectrafo").html(Isectrafo.toPolar().r.toFixed(1).toString() + " A"); /* corrente do secund?rio do transformador */
	$("#Irede").html( Irede.toPolar().r.toFixed(1).toString() + " A"); /* corrente da rede */
	$("#Iger").html((Iger.toPolar().r).toFixed(1).toString() + " A"); /* corrente do gerador */
	$("#Imotor").html(Imotor.toPolar().r.toFixed(1).toString() + " A"); /* corrente do motor */
	$("#Ic1").html((Ic1.toPolar().r).toFixed(1).toString() + " A"); /* corrente da carga 01 */
	$("#Ic2").html((Ic2.toPolar().r).toFixed(1).toString() + " A"); /* corrente da carga 02 */
}