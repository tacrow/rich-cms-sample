'use strict';

angular.module('App', [])
.controller('MainController', ['$scope', '$filter', function($scope, $filter) {

	$scope.todos = [];

	$scope.newTitle = '';

	$scope.addTodo = function() {
		$scope.todos.push({
			title: $scope.newTitle,
			done: false
		});
		$scope.newTitle = '';
	};


	$scope.filter = {
		done: { done: true },
		remaining: { done: false }
	};

	$scope.currentFilter = '';

	$scope.changeFilter = function(filter) {
		$scope.currentFilter = filter;
	};


	var where = $filter('filter'); //filter フィルタ関数の取得

	$scope.$watch('todos', function(todos) {
		var length = todos.length;
		$scope.allCount = length; //総件数モデル
		$scope.doneCount = where(todos, $scope.filter.done).length; //完了件数モデル
		$scope.remainingCount = length - $scope.doneCount; //未完了件数モデル
	}, true);


	var originalTitle;
	$scope.editting = null;

	$scope.editTodo = function(todo) {
		originalTitle = todo.title;
		$scope.editing = todo;
	};

	$scope.doneEdit = function (todoForm) {
		if(todoForm.$invalid) {
			$scope.editing.title = originalTitle;
		}
		$scope.editing = originalTitle = null;
	};

	//全て完了/未完了
	$scope.checkAll = function() {
		var state = !!$scope.remainingCount;
		angular.forEach($scope.todos, function(todo) {
			todo.done = state;
		});
	};

	//完了ToDo 全て削除
	$scope.removeDoneTodo = function() {
		$scope.todos = where($scope.todos, $scope.filter.remaining);
	};

	//任意のToDoを削除
	$scope.removeTodo = function(currentTodo) {
		$scope.todos = where($scope.todos, function(todo) {
			return currentTodo !== todo;
		});
	};
}])
.directive('mySelect', [function() {
	// scope - 現在の $scope オブジェクト
	// $el   - jqLite オブジェクト(jQuery ライクオブジェクト)
	//         jQuery 使用時なら jQuery オブジェクト
	// attrs - DOM 属性のハッシュ(属性名は正規化されている)
	return function(scope, $el, attrs) {
		scope.$watch(attrs.mySelect, function(val) {
			if(val) {
				$el[0].select();
			}
		});
	};

}]);
