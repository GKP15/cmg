var World = function() {
  var worldEntities = [];
  return {
    addEntity: function(entity) { worldEntities.push(entity); } 
  };
}();
