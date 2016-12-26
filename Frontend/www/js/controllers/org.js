angular.module('starter.controllers')
.controller('OrgCtrl', function($scope, $document,  $ionicModal, $timeout, $state,$http,$window) {
  $scope.goto=function(toState,params){ 
   $state.go(toState,params);
 }

 $scope.users = [];
 var userIdList = [];
$scope.confirm = function(){
  console.log(userIdList);
  if(userIdList.length == 0){
    alert('Please select an approver');
  }
  else{
    ApproverListFactory.addApproverList($stateParams.docId, userIdList).then(function(resp){
        if(resp.status == 200){
          console.log(resp.data)
          DocumentFactory.changeApprover($stateParams.docId, resp.data.approverIdList[0]).then(function(resp){
            if(resp.status == 200){
              console.log(resp.data)
              console.log("submitting current document : "+versionType)
              DocumentService.submit($stateParams.docId,versionType);
              $window.location.href=('#/app/doc');
            }
            else {
              console.log('cannot determine firstApprover')
            }
          })
        }
        else {
          console.log('cannot add approverlist')
        }
      })
  }
}
$scope.deleteApprover = function(index){
  userIdList.splice(index, 1);
  $scope.users.splice(index, 1);
  userArray = $scope.users;
  console.log('deleted '+index)
  console.log(userIdList);
}
 var userArray = $scope.users;
 var d3 = $window.d3;
 var width = 850,
 height = 500,
 radius = 6;

 var fill = d3.scale.category20();

 var force = d3.layout.force()
 .charge(-500)
 .linkDistance(90)
 .size([width, height]);
 var rawSvg = $document[0].getElementById('chart');
 var svg = d3.select(rawSvg)
 .style("width", width)
 .style("height", height);
 var div = d3.select("ion-content").append("div")
 .attr("class", "tooltip")
 .style("opacity", 0)
 .style("position", "absolute")
 .style("text-align", "left")
 .style("width", "270px")
 .style("height", "115px")
 .style("padding", "2px")
 .style("font-size", "15px")
 .style("font-family", "sans-serif")
 .style("font-color", "black")
 .style("background", "lightsteelblue")
 .style("border", "0px")
 .style("border-radius", "8px")
 .style("pointer-events", "none");


 d3.json("http://localhost:5001/nodeAndLink", function (error, json) {
              if (error)
                throw error;
              var link = svg.selectAll("line")
              .data(json.links)
              .enter().append("line")
              .style("stroke", "#777");
              var node = svg.selectAll(".node")
              .data(json.nodes)
              .enter().append("g");
            //  .attr("class", "node")
            //  .call(force.drag);
            var circle = node.append("circle")
            .attr("class", "node")
            .attr("r", radius)
            .style("fill", function (d) { return fill(d.group); })
            .style("stroke", "#777")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", click);
            // .call(force.drag);
            var text = node.append("text")
            .text(function (d) { return d.firstname; })
            .attr("font-family", "Arial")
            .attr("font-size", "12px")
            .attr("fill", "black");
            // node.call(force.drag);
            // node.append("text")
            //    .attr("dx", 10)
            //    .attr("dy", ".35em")
            //    .text(function(d: any) { return d.name });
            // var node = svg.selectAll("rect")
            //     .data(json.nodes)
            //   .enter().append("rect")
            //     .attr("width", 10)
            //     .attr("height", 10)
            //     .style("fill", function(d: any) { return fill(d.group); })
            //     .style("stroke", "#777")
            //     .call(force.drag);
            force
            .nodes(json.nodes)
            .links(json.links)
            .on("tick", tick)
            .start();
            function mouseover(d) {
              d3.select(this).attr("r", 10);
                // d3.select(this).append("text")
                //     .attr("class", "hover")
                //     .attr('transform', function(d){ 
                //         return 'translate(5, -10)';
                //     })
                //     .text(d.name + ": " + d.id);
                div.transition()
                .duration(200)
                .style("fill", "black")
                .style("opacity", .9);
                div.html("<font color=\"black\">" +
                  "Firstname: " + d.firstname + "</br>" +
                  "Lastname: " + d.lastname + "</br>" +
                  "UserId: " + d.userId + "</br>" +
                  "Email: " + d.email + "</font>")
                .style("left", (d.x + 50) + "px")
                .style("top", (d.y + 140) + "px")
                .style("padding-left", (10) + "px")
                .style("padding-top", (15) + "px");
              }
            // Toggle children on click.
            function mouseout(d) {
              d3.select(this).attr("r", radius);
                //  d3.select("body").select("text.hover").remove();
                div.transition()
                .duration(500)
                .style("opacity", 0);
              }
              function click(d) {
                d3.select(this).attr("r", radius);
                if(userArray.length == 0){
                    userArray.push(d);
                    userIdList.push(d.userId);
                    $scope.users = userArray;
                }
                else{
                  for (var i = 0; i < userArray.length; i++) {
                    if(userArray[i] == d) break;
                    if(i == userArray.length-1) {
                      userArray.push(d);
                      userIdList.push(d.userId);
                      $scope.users = userArray;
                    }
                  };
                }

                console.log($scope.users);
              }

              function tick(e) {
                var k = 6 * e.alpha;
                // Push sources up and targets down to form a weak tree.
                link
                .each(function (d) { d.source.y -= k, d.target.y += k; })
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
                circle
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
                // .attr("x", function(d: any) { return d.x - 5; })
                // .attr("y", function(d: any) { return d.y - 5; });
                text
                .attr("x", function (d) { return d.x - (11 + d.firstname.length); })
                .attr("y", function (d) { return d.y - 10; });
              }



            });


$scope.showSelectedApprover = function(){
}







})