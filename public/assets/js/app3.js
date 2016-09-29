angular.module('App', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'index-tmpl',
		controller: 'SheetListController'
	})
	.when('/new', {
		templateUrl: 'new-tmpl',
		controller: 'CreationtController'
	})
	.when('/sheet/:id', {
		templateUrl: 'sheet-tmpl',
		controller: 'SheetController'
	})
	.otherwise({
		redirectTo: '/'
	});
}])
.service('sheets', [function() {
	//帳票リスト
	this.list = [];

	//明細行リストを受取り新しい帳票を作成してリストに加える
	this.add = function(lines) {
		this.list.push({
			id: String(this.list.length + 1),
			createdAt: Date.now(),
			lines: lines
		});
	};

	//任意のidを持った帳票を返す
	this.get = function(id) {
		var list = this.list;
		var index = list.length;
		var sheet;

		while(index--) {
			sheet = list[index];
			if(sheet.id === id) {
				return sheet;
			}
		}
		return null;
	};
}])
.controller('SheetListController', ['$scope', 'sheets', function SheetListController($scope, sheets) {
	//一覧用
	$scope.list = sheets.list;
}])
.controller('CreationtController', ['$scope', '$location', 'sheets', function CreationtController($scope, $location, sheets) {
	//新しい明細行を作成
	function createOrderLine() {
		return {
			productiName: '',
			unitPrice: 0,
			count: 0
		};
	}

	// リストモデルを初期化
	$scope.initialize = function() {
		$scope.lines = [createOrderLine()];
	};

	//リストモデルに新しい明細行を追加
	$scope.addLine = function() {
		$scope.lines.push(createOrderLine());
	};

	//任意の明細行をリストモデルから取り除く
	$scope.removeLine = function(target) {
		var lines = $scope.lines;
		var index = lines.indexOf(target);

		if(index !== -1) {
			lines.splice(index, 1);
		}
	};

	//リストモデルから帳票モデルを作成して保存
	$scope.save = function() {
		sheets.add($scope.lines);
		$location.path('/');
	};

	//引数から小計を計算して返す
	$scope.getSubtotal = function(orderLine) {
		return orderLine.unitPrice * orderLine.count;
	};

	//リストから合計金額を計算して返す
	$scope.getTotalAmount = function(lines) {
		var totalAmount = 0;
		angular.forEach(lines, function(orderLine) {
			totalAmount += $scope.getSubtotal(orderLine);
		});
		return totalAmount;
	};

	$scope.initialize();
}])
.controller('SheetController', [function SheetController() {
	//詳細用
}]);