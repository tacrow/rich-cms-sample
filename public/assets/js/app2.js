'use strict';

angular.module('App', [])
.service('todos', ['$rootScope', '$filter', function($scope, $filter) {
	// ToDoリスト
	var list = [];

	// リストの変更を監視し全$scopeに対してchange:listイベントを発行する
	$scope.$watch(function() {
		return list;
	}, function(value) {
		$scope.$broadcast('change:list', value);
	}, true);

	var where = $filter('filter');

	var done = { done: true };
	var remaining = { done: false };

	// リストが扱えるフィルタリング条件
	this.filter = {
		done: done,
		remaining: remaining
	};

	// 完了状態のToDoのみ抽出
	this.getDone = function() {
		return where(list, done);
	};

	// 要件を受け取り新しいToDoをリストに加える
	this.add = function(title) {
		list.push({
			title: title,
			done: false
		});
	};

	// 引数のToDoからリストを削除
	this.remove = function(currentTodo) {
		list = where(list, function(todo) {
			return currentTodo !== todo;
		});
	};

	// 完了状態のToDoをリストから削除
	this.removeDone = function() {
		list = where(list, remaining);
	};

	// リスト内のToDo全ての状態を引数に合わせる
	this.changeState = function(state) {
		angular.forEach(list, function(todo) {
			todo.done = state;
		});
	};
}])
.controller('RegisterController', ['$scope', 'todos', function($scope, todos) {
	$scope.newTitle = '';

	$scope.addTodo = function() {
		todos.add($scope.newTitle);
		$scope.newTitle = '';
	};
}])
.controller('ToolbarController', ['$scope', 'todos', function($scope, todos) {
	$scope.filter = todos.filter;

	$scope.$on('change:list', function(evt, list) {
		var length = list.length;
		var doneCount = todos.getDone().length;

		$scope.allCount = length; //総件数モデル
		$scope.doneCount = doneCount; //完了件数モデル
		$scope.remainingCount = length - doneCount; //未完了件数モデル
	});

	$scope.checkAll = function() {
		todos.changeState(!!$scope.remainingCount);
	};

	$scope.changeFilter = function(filter) {
		$scope.$emit('change:filter', filter);
	};

	$scope.removeDoneTodo = function() {
		todos.removeDone();
	};
}])
.controller('TodoListController', ['$scope', 'todos', function($scope, todos) {
	$scope.$on('change:list', function(evt, list) {
		$scope.todoList = list;
	});

	var originalTitle;

	$scope.editing = null;

	$scope.editTodo = function(todo) {
		originalTitle = todo.title;
		$scope.editing = todo;
	};

	$scope.doneEdit = function(todoForm) {
		if(todoForm.$invalid) {
			$scope.editing.title = originalTitle;
		}
		$scope.editing = originalTitle = null;
	};

	$scope.removeTodo = function(todo) {
		todos.remove(todo);
	};
}])
.controller('MainController', ['$scope', function($scope) {
	$scope.currentFilter = null;
	
	$scope.$on('change:filter', function(evt, filter) {
		$scope.currentFilter = filter;
	});
}])
.directive('mySelect', [function() {
	return function(scope, $el, attrs) {
		scope.$watch(attrs.mySelect, function(val) {
			if(val) {
				$el[0].select();
			}
		});
	};
}]);
