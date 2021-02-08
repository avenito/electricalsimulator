/* ****************** */
/* JS para site geral */
/* ****************** */
/* Carrega unifilar */
$(document).ready(function(){

  inicializaUnifilar();

  //Testa compatibilidade com websocket
  if ("WebSocket" in window)
  {
      //Abrindo conexao
      var ws = new WebSocket("ws://localhost:5002");
		
      ws.onopen = function()
      {
         // Web Socket is connected, send data using send()
         alert("Conectado ...");
      };
		
      ws.onmessage = function (evt) 
      { 
         var received_msg = evt.data;
         alert("Message is received..." + received_msg);
      };
		
      ws.onclose = function()
      { 
         // websocket is closed.
         alert("Servidor não encontrado ..."); 
      };  
      } else {
	  alert("Seu browser não suporta este simulador!");
  }
  //-------------------------------------------------------
  
  $("#unifilarhtml").load("unifilar.html"); 
  
  $(':input').bind('keyup', function(){
    alert("Key");
  });

  /* Troca todas as virgulas por ponto nas caixas de texto */
  $(":input").focusout(function(){
      var nt = $(this).val().replace(/,/g , ".");
      $(this).val(nt);
  });
});


