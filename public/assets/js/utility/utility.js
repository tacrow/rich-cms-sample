App.util = (function() {
	return {
		// ajax
		ajax: function(param) {
			$.ajax({
				url: param.url,
				type: param.type,
				dataType: param.dataType,
				success: param.success,
				error: param.error
			});
		}
	};
}());
