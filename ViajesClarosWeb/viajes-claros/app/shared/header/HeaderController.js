
/**
 * Controlador para el encabezado
 */
myApp.controller('HeaderController', ['$scope', '$rootScope', '$location', '$route', '$filter', 'HeaderService', function($scope, $rootScope, $location, $route, $filter, HeaderService) {

    $scope.changeAnio = function(anio) {
        $rootScope.anioConsulta = anio;
        $route.reload();
        
        HeaderService.getFuncionarios().then(function(d) {
	        $rootScope.funcionarios = d;
	        
	    }).finally(function(){
		replaceFuncionariosComparador();    
	});
	//$rootScope.funcionariosCompara = [];
	
    };

    $scope.isCollapsed = true;

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
    
    $scope.changeDependencia = function(dep) {
        $rootScope.slcDependencia = dep;
        $route.reload();
    };
    
    HeaderService.getDependencias().then(function(d) {
        $scope.listDependencias = d;
    }). finally(function() {
        $rootScope.slcDependencia = $scope.listDependencias[0];
    });
    
    
    /* Reemplazar el(los) funcionario(s) seleccionado(s) en el comparador */
    function replaceFuncionariosComparador() {
    	
    	for (var i=0;i<$rootScope.funcionariosCompara.length;i++) {
    		var item = removeFuncionarioByNombre($rootScope.funcionariosCompara[i]);
    		$rootScope.funcionariosCompara.splice(i,1,item);
		(function(i,item) {
			HeaderService.getPorcentajeDiasComisionFuncionario(item).then(function(d) {
		            /* CONSULTAR EL PORCENTAJE DE D�AS DE COMISI�N Y D�AS EN LA INSTITUCI�N */
		           var porcentajes = d;
		            
		           item.chartPorc = {data: [], labels: [], options:{ showTooltips: false}};
		           item.chartPorc.data = [$filter('number')(porcentajes.porcentajeViaje, 2), $filter('number')(porcentajes.porcentajeInstitucion, 2)];
		           item.chartPorc.labels = [$filter('number')(porcentajes.porcentajeViaje, 2) + ' % de d�as de comisi�n del total de d�as laborales', 'Tiempo en la instituci�n'];
		           item.totalDiasViaje = porcentajes.totalDiasViaje;
		           item.totalDiasInstitucion = porcentajes.totalDiasInstitucion;
		           $rootScope.funcionariosCompara.splice(i,1,item);	            
		        });
	    })(i,item); 
	}
    }
    
    function removeFuncionarioByNombre(func) {
    	var returnFuncionario;
        for (var i=0; i < $rootScope.funcionarios.length; i++) {
            if ($rootScope.funcionarios[i].nombres === func.nombres
                    && $rootScope.funcionarios[i].apellido1 === func.apellido1
                    && $rootScope.funcionarios[i].apellido2 === func.apellido2) {
                returnFuncionario = $rootScope.funcionarios[i];
                $rootScope.funcionarios.splice(i, 1);
        	return returnFuncionario;
            }
        }
        
        // Si el funcionario no esta en la lista del a�o correspondiente, se deja e 0's su informaci�n
        func.totalViajes = 0;
        func.totalGasto = 0;
        func.viajeMasCostoso = 0;
        func.idViajeMasCostoso = 0;
        return func;
    }
    
}]);