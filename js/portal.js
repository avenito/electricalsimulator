/*
 * Funcao chamada apos carregamento da pagina
 */
 
var svg;
var ws;
var serverConnected = false;

$(document).ready(function(){
	/* Carrega abas */
	$("#unifilarhtml").load("unifilar.html",
		function(){
			$("#oneline").svg({loadURL: 'images/unifilar.svg'});
			svg = $('#oneline').svg('get');
			setInterval(umSegundo, 1000);
			/*
			 * Faz conexao com o servidor
			 */
			/*if ("WebSocket" in window)
			{
			    //Abrindo conexaoz	
			    ws = new WebSocket("ws://localhost:5002");
					
			    ws.onopen = function(){
			    	$("#un_caixaUnifilar").removeClass("panel-warning");
			    	$("#un_caixaUnifilar").addClass("panel-info");
			    	$("#un_labelUnifilar").html("Connected");
			    	serverConnected = true;
					ws.send(getConf());    	
			    };
					
			    ws.onmessage = function (evt) 
			    { 
			       trataMsg(evt.data);
			    };
					
			    ws.onclose = function()
			    { 
					// websocket is closed.
					$("#un_caixaUnifilar").removeClass("panel-info");
					$("#un_caixaUnifilar").addClass("panel-warning");
					$("#un_labelUnifilar").html("Not connected");
					serverConnected = false;
					exibeJanela("Erro!", "<img src='images/serveroff.png' class='img-rounded img-responsive center-block'>"); 
			    };  
			    } else {
				  alert("Aten��o! Seu browser n�o suporta este simulador!");
			}*/
	}
	);
	$("#componenteshtml").load("componentes.html");
	$("#protecaohtml").load("protecao.html");
	$("#simulacaohtml").load("simulacao.html",
		/* Troca todas as virgulas por ponto nas caixas de texto */
		function(){
			$(":input").focusout(function(){
				var nt = $(this).val().replace(/,/g , ".");
				$(this).val(nt);
			});
			$('.nav-tabs a[href="#unifilar"]').click(function (e) {
				atualizaUnifilar();
    		});
		}
	);
	setTimeout(function(){atualizaUnifilar(); }, 1000);
});


/*
 * Exibe janela modal.
 */
function exibeJanela(titulo, corpo){
	$('#tituloModal').html("<b>" + titulo + "</b>");
	$('#corpoModal').html(corpo);
	$('#theModal').modal();
}
