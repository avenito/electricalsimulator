/*
 *  Variaveis e funcoes de simulacao
 */

var passoSimulacao;
var tipoSimulacao = 0, passoSimulacao = 0;
var simulacao = false;
var intervaloSimulacao = 5000;
var simulacaoRunning;

function pegaValoresSimulacao(){
	simulacaoRunning = setTimeout(calculaSistema, intervaloSimulacao);
	switch(tipoSimulacao){
		case "1": // Partida motor
			simulacaoPartidaMotor();
			break;
		case "2": // Inrush
			simulacaoInrush();
			break;
		case "3": // Sobretensao
			simulacaoSobretensao();
			break;
		case "4": // Subtensao
			simulacaoSubtensao();
			break;
		case "5": // Transferencia para gerador
			simulacaoTransfGer();
			break;
		case "6": // Transferencia para rede
			simulacaoTransfRede();
			break;
	}
}

/*
 * Habilita botao de inicio de simulacao
 */
function opcaoSimulacao(){
	tipoSimulacao = $("#sim_Simulacao").val();
	$("#un_labelSimulacao").html($("#sim_Simulacao option:selected" ).text() + ": ");
	if(tipoSimulacao > 0){
		$("#un_simulacao").removeAttr("disabled");
	} else {
		$("#un_simulacao").attr("disabled","disabled");
	}
}

/*
 * Inicia simulacao
 */
function startSimulacao() {
	simulacao = true;
	passoSimulacao = -1;
	$("#sim_Simulacao").attr("disabled","disabled");
	$("#un_simulacao").attr("disabled","disabled");
	calculaSistema();
}

function simulacaoPartidaMotor(){
	var tempo = parseFloat($("#co_tmpPartMot").val()) * 0.8;
	
	switch(++passoSimulacao){
		case 0:
			$("#tempoSimulacao").html("-1.000s");
			abreDJM();
			break;
		case 1:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val());
			motFP = 0.5;
			$("#tempoSimulacao").html("0.000s");
			fechaDJM();
			break;
		case 2:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.99);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.01) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 3:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.96);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.04) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 4:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.91);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.09) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 5:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.84);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.16) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 6:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.75);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.25) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 7:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.64);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.36) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 8:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.51);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.49) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 9:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.36);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.64) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		case 10:
			potAtualMotor = parseFloat($("#co_motPot").val()) * parseFloat($("#co_motIpIn").val() * 0.19);
			motFP = ((parseFloat($("#co_motFP").val()) - 0.5) * 0.81) + 0.5;
			tempo = tempo * passoSimulacao / 10 ;
			tempo = tempo.toFixed(3).toString();
			$("#tempoSimulacao").html(tempo + "s");
			break;
		default:
			paraSimulacao();
			break;
	}
}

function simulacaoInrush(){
	switch(++passoSimulacao){
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		case 7:
			break;
		case 8:
			break;
		case 9:
			break;
		case 10:
			break;
		default:
			paraSimulacao();
			break;
	}
}

function simulacaoSobretensao(){
	switch(++passoSimulacao){
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		case 7:
			break;
		case 8:
			break;
		case 9:
			break;
		case 10:
			break;
		default:
			paraSimulacao();
			break;
	}
}

function simulacaoSubtensao(){
	switch(++passoSimulacao){
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		case 7:
			break;
		case 8:
			break;
		case 9:
			break;
		case 10:
			break;
		default:
			paraSimulacao();
			break;
	}
}

function simulacaoTransfGer(){
	switch(++passoSimulacao){
		case 0:
			$("#tempoSimulacao").html("-1.000s");
			desligaGER();
			RLG_ModoOperacao = 0;
			break;
		case 1:
			$("#tempoSimulacao").html("0.000s");
			$("#un_percisoc").val(0);
			RLG_CargaIsoc = 0;
			ligaGER();
			fechaDJG();
			break;
		case 2:
			$("#tempoSimulacao").html("1.000s");
			$("#un_percisoc").val(10);
			RLG_CargaIsoc = 0.1;
			break;
		case 3:
			$("#tempoSimulacao").html("2.000s");
			$("#un_percisoc").val(20);
			RLG_CargaIsoc = 0.2;
			break;
		case 4:
			$("#tempoSimulacao").html("3.000s");
			$("#un_percisoc").val(30);
			RLG_CargaIsoc = 0.3;
			break;
		case 5:
			$("#tempoSimulacao").html("4.000s");
			$("#un_percisoc").val(40);
			RLG_CargaIsoc = 0.4;
			break;
		case 6:
			$("#tempoSimulacao").html("5.000s");
			$("#un_percisoc").val(50);
			RLG_CargaIsoc = 0.5;
			break;
		case 7:
			$("#tempoSimulacao").html("6.000s");
			$("#un_percisoc").val(60);
			RLG_CargaIsoc = 0.6;
			break;
		case 8:
			$("#tempoSimulacao").html("7.000s");
			$("#un_percisoc").val(70);
			RLG_CargaIsoc = 0.7;
			break;
		case 9:
			$("#tempoSimulacao").html("8.000s");
			$("#un_percisoc").val(80);
			RLG_CargaIsoc = 0.8;
			break;
		case 10:
			$("#tempoSimulacao").html("9.000s");
			$("#un_percisoc").val(90);
			RLG_CargaIsoc = 0.9;
			break;
		case 11:
			$("#tempoSimulacao").html("10.000s");
			$("#un_percisoc").val(100);
			RLG_CargaIsoc = 1;
			break;
		case 12:
			$("#tempoSimulacao").html("11.000s");
			abreDJI();
			break;
		default:
			paraSimulacao();
			break;
	}
}

function simulacaoTransfRede(){
	switch(++passoSimulacao){
		case 0:
			$("#tempoSimulacao").html("-1.000s");
			RLG_ModoOperacao = 0;
			break;
		case 1:
			fechaDJI();
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
			$("#tempoSimulacao").html((passoSimulacao - 1).toString() + ".000s");
			$("#un_percisoc").val(100 - (passoSimulacao * 10 - 10));
			RLG_CargaIsoc = 1 - ((passoSimulacao - 1)/10);
			break;
		case 12:
			$("#tempoSimulacao").html("11.000s");
			abreDJG();
			desligaGER();
			break;
		default:
			paraSimulacao();
			break;
	}
}
/*
 * Termina simulacao
 */
function paraSimulacao(){
	clearTimeout(simulacaoRunning);
	simulacao = false;
	passoSimulacao = 0;
	$("#sim_Simulacao").removeAttr("disabled");
	$("#un_simulacao").removeAttr("disabled");
}