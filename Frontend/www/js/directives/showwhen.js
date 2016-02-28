angular.module('starter.controllers')

.directive('showWhen', ['$window', function($window) {


 return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

  function checkExpose() {
    var lg = $attr.showWhen == 'large' ? '(min-width:1024px)' : $attr.showWhen;
    var sm = $attr.showWhen == 'small' ? '(max-width:1024px)' : $attr.showWhen;
    if($window.matchMedia(lg).matches){
    $element.removeClass('ng-hide');
  } 
    else if($window.matchMedia(sm).matches){
    $element.removeClass('ng-hide');
  }

  else {
    $element.addClass('ng-hide');   
  }
  }

  function onResize() {
    debouncedCheck();
  }

  var debouncedCheck = ionic.debounce(function() {
    $scope.$apply(function(){
      checkExpose();
    });
  }, 300, false);

  checkExpose();

  ionic.on('resize', onResize, $window);

  $scope.$on('$destroy', function(){
    ionic.off('resize', onResize, $window);
  });

}
  };
}])