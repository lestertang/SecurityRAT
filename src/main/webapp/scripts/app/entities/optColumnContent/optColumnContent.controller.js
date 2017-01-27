'use strict';

angular.module('sdlctoolApp')
    .controller('OptColumnContentController', function ($scope, OptColumnContent, OptColumnContentSearch, RequirementSkeleton, OptColumn, sharedProperties, $filter) {
        $scope.optColumnContents = [];
        $scope.requirementSkeletons = [];
        $scope.optColumns = [];
        $scope.selectedOptColumns = [];
	$scope.searchString = '';
	$scope.length = 1000;
        $scope.numberToDisplay = 100;
//        $scope.selectedReqSkeletons = [];
        
//        $scope.reqLabelText = {buttonDefaultText: 'Requirement Skeleton'};
        $scope.optColumnLabelText = {buttonDefaultText: 'Option Column'};
//        $scope.selectedReqSettings = {
//  			  smartButtonMaxItems: 2,
//  			  showCheckAll: false, showUncheckAll: false,
//  			  displayProp: 'shortName', idProp: 'id', externalIdProp: '',
//  			  scrollableHeight: '300px',scrollable: true, enableSearch: true
//  	    };
        $scope.selectedOptSettings = {
    			  smartButtonMaxItems: 2,
    			  showCheckAll: false, showUncheckAll: false,
    			  displayProp: 'name', idProp: 'id', externalIdProp: ''
    	    };
        $scope.loadAll = function() {
            OptColumnContent.query(function(result) {
               $scope.optColumnContents = result;
               angular.forEach($scope.optColumnContents, function(content) {
            	   angular.extend(content, {selected: false});
               });
	       $scope.length = $scope.optColumnContents.length;
            });
            OptColumn.query(function(result) {
            	$scope.optColumns = result;
            	$scope.optColumns = $filter('orderBy')($scope.optColumns, ['showOrder']);
            });
            RequirementSkeleton.query(function(result) {
            	$scope.requirementSkeletons = result;
            	$scope.requirementSkeletons = $filter('orderBy')($scope.requirementSkeletons, ['reqCategory.showOrder', 'showOrder']);
            });
        };
        $scope.loadAll();

	$scope.loadMore = function() {
           if ($scope.numberToDisplay + 100 < $scope.length) {
                $scope.numberToDisplay += 100;
           } else {
                $scope.numberToDisplay = $scope.length;
           }
       };

        $scope.delete = function (id) {
            OptColumnContent.get({id: id}, function(result) {
                $scope.optColumnContent = result;
                $('#deleteOptColumnContentConfirmation').appendTo("body").modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            OptColumnContent.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteOptColumnContentConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            OptColumnContentSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.optColumnContents = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };
        $scope.selectAllContents = function() {
        	var contents = $filter('filterCategoryForEntities')($scope.optColumnContents, $scope.selectedOptColumns, 'optColumn');
        	contents = $filter('orderBy')(contents, ['requirementSkeleton.reqCategory.showOrder', 'requirementSkeleton.showOrder', 'optColumn.showOrder']);
        	
  		  angular.forEach(contents, function(content) {
  			  content.selected = true;
  		  });
	  	}
	  	
	  	$scope.deselectAllContents = function() {
	  		  angular.forEach($scope.optColumnContents, function(content) {
	  			  content.selected = false;
	  		  });
	  	}
	  	
        $scope.selectAllTypes = function() {
//        	var contents = $filter('filterCategoryForEntities')($scope.optColumnContents, $scope.selectedReqSkeletons, 'requirementSkeleton');
        	var contents = $filter('filterCategoryForEntities')(contents, $scope.selectedOptColumns, 'OptColumn');
//        	instances = $filter('filterCategoryForEntities')(instances, $scope.selectedAlternativeSets, 'alternativeSet')
    		  angular.forEach(contents, function(content) {
    			  content.selected = true;
    		  });
  	  	}
        $scope.deselectAllTypes = function() {
        	angular.forEach($scope.optColumnContents, function(content) {
        		content.selected = false;
          	});
        }
        
        $scope.bulkChange = function() {
          	sharedProperties.setProperty($filter('orderBy')($filter('filter')($scope.optColumnContents, {selected: true}), ['requirementSkeleton.reqCategory.showOrder', 'requirementSkeleton.showOrder', 'optColumn.showOrder']));
        }

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.optColumnContent = {content: null, id: null};
        };
    });
