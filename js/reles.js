/*
 *  Funcoes relacionadas aos reles
 */

var aux;

//var RLE, RLI, RLG, RLC1, RLC2, RLM;
var RLs = ["0","0","0","0","0","0"];

/* Coils */
var RLE_RstTrip = 0, RLE_LigDisj = 0, RLE_DesDisj = 0, RLE_Out01 = 0;
var RLI_RstTrip = 0, RLI_LigDisj = 0, RLI_DesDisj = 0, RLI_Out01 = 0;
var RLC1_RstTrip = 0, RLC1_LigDisj = 0, RLC1_DesDisj = 0, RLC1_Out01 = 0;
var RLC2_RstTrip = 0, RLC2_LigDisj = 0, RLC2_DesDisj = 0, RLC2_Out01 = 0;
var RLM_RstTrip = 0, RLM_LigDisj = 0, RLM_DesDisj = 0, RLM_Out01 = 0;
var RLG_RstTrip = 0, RLG_LigDisj = 0, RLG_DesDisj = 0, RLG_Out01 = 0, RLG_LigaGer = 0, RLG_DesligaGer = 0;

/* Input status */
var RLE_50 = 0, RLE_51 = 0;
var RLI_27 = 0, RLI_32 = 0, RLI_67 = 0;
var RLC1_50 = 0, RLC1_51 = 0;
var RLC2_50 = 0, RLC2_51 = 0;
var RLM_50 = 0, RLM_51 = 0, RLM_49 = 0;
var RLG_27 = 0, RLG_32 = 0, RLG_67 = 0, RLG_51 = 0; //  RLG_DJG + RLG_GER --> estado do gerador

/* Holding register */
var RLG_ModoOperacao = 0, RLG_CargaIsoc = 0, RLG_CargaDrup = 0;

function setIDsReles(ids){
	RLs[0] = ids[1];
	RLs[1] = ids[2];
	RLs[2] = ids[3];
	RLs[3] = ids[4];
	RLs[4] = ids[5];
	RLs[5] = ids[6];
}

function getConf(){
	var conf = '';
	/* ID1(identif.), AI1(input register), DI1(input status), AO1(holding register), DO1(coil);IDn, AIIn, DIn, AOn, DOn */
	conf += "1;"; 			//Tipo de mensagem 1 - B->S - Primeiro acesso informando mapa de memória
	conf += "1,2,3,0,4;"; 	//RLE
	conf += "2,3,4,0,4;"; 	//RLI
	conf += "3,5,6,3,6;"; 	//RLG
	conf += "4,2,3,0,4;"; 	//RLC1
	conf += "5,2,3,0,4;"; 	//RLC2
	conf += "6,3,4,0,4"; 	//RLM
	return conf;
}

/* Monta string de atualizacao do servidor */
function atualizaServidor() {
	
	if (!serverConectado) return false;
	
	var atualiza = "3;"
	
	atualiza += RLs[0] + "," + rVrede.toString();
	atualiza += "," + rIrede.toString();
	aux = "0";
	if(DJE) aux = "1";
	atualiza += "," + RLE_50.toString() + "," + RLE_51.toString() + "," + aux;
	atualiza += ",0,0,0,0;";
	
	atualiza += RLs[1] + "," + rV2trafo.toString();
	atualiza += "," + rI2trafo.toString();
	atualiza += "," + rP32trafo.toString();
	aux = "0";
	if(DJI) aux = "1";
	atualiza += "," + RLI_27.toString() + "," + RLI_32.toString() + "," + RLI_67.toString() + "," + aux;
	//atualiza += "," + "1" + "," + "1" + "," + "1" + "," + "0";
	atualiza += ",0,0,0,0";
	
	ws.send(atualiza);

	atualiza = "3;"
	atualiza += RLs[2] + "," + rVger.toString();
	atualiza += "," + rIger.toString();
	atualiza += "," + $("#co_gerPot").val();
	atualiza += "," + rPger.toString();
	atualiza += "," + rFPger.toString();
	aux = "0";
	if(DJG) aux = "1";
	if(GER) {
		aux += ",1";
	} else {
		aux += ",0";
	}
	atualiza += "," + RLG_27.toString() + "," + RLG_67.toString() + "," + RLG_32.toString() + "," + RLG_51.toString() + "," + aux;
	atualiza += "," + RLG_ModoOperacao.toString() + "," + (RLG_CargaIsoc*100).toString() + "," + (RLG_CargaDrup*100).toString();
	atualiza += ",0,0,0,0,0,0;";

	atualiza += RLs[3] + "," + rVc1.toString();
	atualiza += "," + rIc1.toString();
	aux = "0";
	if(DJC1) aux = "1";
	atualiza += "," + RLC1_50.toString() + "," + RLC1_51.toString() + "," + aux;
	atualiza += ",0,0,0,0";

	ws.send(atualiza);

	atualiza = "3;"
	atualiza += RLs[4] + "," + rVc2.toString();
	atualiza += "," + rIc2.toString();
	aux = "0";
	if(DJC2) aux = "1";
	atualiza += "," + RLC2_50.toString() + "," + RLC2_51.toString() + "," + aux;
	atualiza += ",0,0,0,0;";

	atualiza += RLs[5] + "," + rVmotor.toString();
	atualiza += "," + rImotor.toString();
	atualiza += "," + rFPmotor.toString();
	aux = "0";
	if(DJM) aux = "1";
	atualiza += "," + RLM_50.toString() + "," + RLM_51.toString() + "," + RLM_49.toString() + "," + aux;
	atualiza += ",0,0,0,0";

	ws.send(atualiza);
	
}

/* Seta registros nos reles */
function setRegistersRele(msg){
	//alert(msg);
	partes = msg.split(";");
    switch(partes[1]){
	    case RLs[0]: //RLE
	    	break;
	    
	    case RLs[1]: //RLI
	    	break;
	    
	    case RLs[2]: //RLG
	    	/* Modo de operacao */
	    	RLG_ModoOperacao = parseInt(partes[2]);
	    	if(RLG_ModoOperacao < 0) RLG_ModoOperacao = 0;
	    	if(RLG_ModoOperacao > 2) RLG_ModoOperacao = 2;
	    	/* Carga isocrona */
	    	RLG_CargaIsoc = parseInt(partes[3])/100;
	    	if(RLG_CargaIsoc < 0) RLG_CargaIsoc = 0;
	    	if(RLG_CargaIsoc > 1) RLG_CargaIsoc = 1;
	    	$("#un_percisoc").val(RLG_CargaIsoc * 100);
    		/* Carga droop */
	    	RLG_CargaDrup = parseInt(partes[4])/100;
	    	if(RLG_CargaDrup < 0) RLG_CargaDrup = 0;
	    	if(RLG_CargaDrup > 1) RLG_CargaDrup = 1;
	    	$("#un_percdroop").val(RLG_CargaDrup * 100);
	    	break;
	    
	    case RLs[3]: //RLC1
	    	break;
	    
	    case RLs[4]: //RLC2
	    	break;
	    
	    case RLs[5]: //RLM
	    	break;
    }
	calculaSistema();
	setInterval(atualizaServidor, 1000);
}

/* Seta saidas no rele */
function setOutputsRele(msg){
	//alert(msg);
	partes = msg.split(";");
    switch(partes[1]){
	    case RLs[0]: //RLE
	    	if(partes[2] == "1") cr_resetRLE();
	    	if(partes[3] == "1") cr_ligaDJE();
	    	if(partes[4] == "1") cr_desligaDJE();
	    	if(partes[5] == "1") cr_outDJE();
	    	break;
	    
	    case RLs[1]: //RLI
	    	if(partes[2] == "1") cr_resetRLI();
	    	if(partes[3] == "1") cr_ligaDJI();
	    	if(partes[4] == "1") cr_desligaDJI();
	    	if(partes[5] == "1") cr_outDJI();
	    	break;
	    
	    case RLs[2]: //RLG
	    	if(partes[2] == "1") cr_resetRLG();
    		if(partes[3] == "1") cr_ligaDJG();
	    	if(partes[4] == "1") cr_desligaDJG();
	    	if(partes[5] == "1") cr_outDJG();
	    	if(partes[6] == "1") cr_ligaGER();
	    	if(partes[7] == "1") cr_desligaGER();
	    	break;
	    
	    case RLs[3]: //RLC1
	    	if(partes[2] == "1") cr_resetRLC1();
    		if(partes[3] == "1") cr_ligaDJC1();
	    	if(partes[4] == "1") cr_desligaDJC1();
	    	if(partes[5] == "1") cr_outDJC1();
	    	break;
	    
	    case RLs[4]: //RLC2
	    	if(partes[2] == "1") cr_resetRLC2();
    		if(partes[3] == "1") cr_ligaDJC2();
	    	if(partes[4] == "1") cr_desligaDJC2();
	    	if(partes[5] == "1") cr_outDJC2();
	    	break;
	    
	    case RLs[5]: //RLM
	    	if(partes[2] == "1") cr_resetRLM();
    		if(partes[3] == "1") cr_ligaDJM();
	    	if(partes[4] == "1") cr_desligaDJM();
	    	if(partes[5] == "1") cr_outDJM();
	    	break;
    }
	setInterval(atualizaServidor, 1000);
}

/* Funcoes RLE */
function cr_resetRLE(){
	
}
function cr_ligaDJE(){
	if(!DJE) manobra_DJE();
}
function cr_desligaDJE(){
	if(DJE)	manobra_DJE();	
}
function cr_outDJE(){
	
}
/* Funcoes RLI */
function cr_resetRLI(){
	
}
function cr_ligaDJI(){
	if(!DJI) manobra_DJI();
}
function cr_desligaDJI(){
	if(DJI)	manobra_DJI();	
}
function cr_outDJI(){
	
}
/* Funcoes RLG */
function cr_resetRLG(){
	
}
function cr_ligaDJG(){
	if(!DJG) manobra_DJG();
}
function cr_desligaDJG(){
	if(DJG)	manobra_DJG();	
}
function cr_outDJG(){
	
}
function cr_ligaGER(){
	if(!GER) manobra_GER();
}
function cr_desligaGER(){
	if(GER) manobra_GER();
}
/* Funcoes RLC1 */
function cr_resetRLC1(){
	
}
function cr_ligaDJC1(){
	if(!DJC1) manobra_DJC1();
}
function cr_desligaDJC1(){
	if(DJC1) manobra_DJC1();	
}
function cr_outDJC1(){
	
}
/* Funcoes RLC2 */
function cr_resetRLC2(){
	
}
function cr_ligaDJC2(){
	if(!DJC2) manobra_DJC2();
}
function cr_desligaDJC2(){
	if(DJC2) manobra_DJC2();	
}
function cr_outDJC2(){
	
}
/* Funcoes RLM */
function cr_resetRLM(){
	
}
function cr_ligaDJM(){
	if(!DJM) manobra_DJM();
}
function cr_desligaDJM(){
	if(DJM)	manobra_DJM();	
}
function cr_outDJM(){
	
}

/* Verifica limites ajustados e correntes */

function atualiza_iReles(){
	
}