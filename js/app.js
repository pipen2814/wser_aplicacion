  $(document).ready(function(){

    $("#logout").click(function(){
    	localStorage.clear();
        window.location.replace("index.html");
        return false;
    });

    window.addBackButton = function(conf){

	    $("#back-button").css("display", "block");
	    $("#back-button").click(function(){
	    	$("#back-button").css("display", "none");
	    	conf.addToNavigation = false;
	    	//genericInterfaceCall(conf);
          	window.location.replace("app.html");
	    });

    }

    window.genericInterfaceCall = function(conf){

      var config = {
        url: conf.url, 
        json: conf.json == undefined?{}:conf.json, 
        container: conf.container, 
        obtainToken: conf.obtainToken == undefined?false:conf.obtainToken, 
        emptyContainer: conf.emptyContainer == undefined?false:conf.emptyContainer, 
        addToNavigation: conf.addToNavigation == undefined?true:conf.addToNavigation 
      };

      $.ajax({
          url: config.url,
          method: 'POST',
          dataType: 'html',
          data: config.json,
	  success: function(data){
		  if(config.addToNavigation){
		  	var addPosition = true;
			var newPosition = JSON.stringify(config);
		  	var nav = localStorage.getItem("navigation");

		  	var newNav = JSON.parse(nav);
		  	$.each(newNav, function(index, value){
		  		if(JSON.parse(value).url == config.url){
					addPosition = false;
				}
		  	});
		  	if(addPosition){
		  		newNav.push(newPosition);
		  		localStorage.setItem("navigation", JSON.stringify(newNav));
			}
			addBackButton(config);
		  }
		  if(config.emptyContainer){
			  config.container.empty();
		  }
		  config.container.append(data);
	          if(config.obtainToken){
              		renovateTK();
            	  }

          },
          error: function(){
            console.log("ERROR: ",arguments);
          }
      });
    }

    window.genericJSONCall = function(url, json, callback){
      $.ajax({
          url: url,
          method: 'POST',
          dataType: 'json',
          data: json,
          success: function(data){
		if(data.status == 'OK'){
	            if(callback){
        	      callback(data);
       	 	    }
		}else{
          		window.location.replace("index.html");
		}
          },
          error: function(){
            console.log("ERROR: ",arguments);
          }
      });
    }

    function getUserInfo(){
      var url = baseURL+'users/user.getInfo';
      var json = {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") };
      var callback = function(data){
            if(data.status == 'OK'){
            	    $(".nombre-usuario").html(data.username);
            }else{
              alert("Ha habido un error durante la obtencion del token de conexion.");
            }
      }
      genericJSONCall(url, json, callback);
    }

   getUserInfo();


    function renovateTK(){
      var url = baseURL+'login.renovateToken';
      var json = {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") };
      var callback = function(data){
            if(data.status == 'OK' && data.apiTK){
              localStorage.setItem("apiTK", data.apiTK);
            }else{
              alert("Ha habido un error durante la obtencion del token de conexion.");
            }
      }
      genericJSONCall(url, json, callback);
    }

    //Menu lateral izquierdo
    function addMenuOptions(){
      
      var conf = {
        url: baseURL+'interfaz/MainComponents.getMenuOptions', 
        json: {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") }, 
        container: $("#sidebar-menu"), 
        obtainToken: false, 
        emptyContainer: false,
        addToNavigation: false
      };
      
      genericInterfaceCall(conf);
      //TODO: ejecutar el metodo que se ejecuta al hacer resize de la pagina para que el alto del div se ajuste
    }
    addMenuOptions();
    //Fin del menu lateral izquierdo

    //Menu superior
    function addMessages(){
      var conf = {
        url: baseURL+'interfaz/MainComponents.getMessages', 
        json: {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") }, 
        container: $("#messages-menu"), 
        obtainToken: false, 
        emptyContainer: false,
        addToNavigation: false
      };
      genericInterfaceCall(conf);
    }
    addMessages();

    function addNotifications(){
      var conf = {
        url: baseURL+'interfaz/MainComponents.getNotifications', 
        json: {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") }, 
        container: $("#notifications-menu"), 
        obtainToken: false, 
        emptyContainer: true,
        addToNavigation: false
      };
      genericInterfaceCall(conf);
    }
    addNotifications();

    function addTasks(){
      var conf = {
        url: baseURL+'interfaz/MainComponents.getTasks', 
        json: {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") }, 
        container: container = $("#tasks-menu"), 
        obtainToken: false, 
        emptyContainer: true,
        addToNavigation: false
      };
      genericInterfaceCall(conf);
    }
    addTasks();
    //Fin del menu superior

    //Bloque central
    function addMainContent(){
      var conf = {
        url: baseURL+'interfaz/MainComponents.getDashboardContent', 
        json: {apiTK: localStorage.getItem("apiTK"), usuario: localStorage.getItem("usuario") }, 
        container: $("#app-mainContainer"), 
        obtainToken: true, 
        emptyContainer: true,
        addToNavigation: false
      };
      genericInterfaceCall(conf);
    }
    addMainContent();
    //Fin del bloque central

  });

