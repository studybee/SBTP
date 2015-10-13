$(document).ready(function(){
	var rows = [];
	$(".sb-yh-table tbody tr").each(function(i){
		var cols = [];
		//insertTd($(this));
		$(this).find("td").each(function(j){
			cols[j] = $(this).html();
		});
		rows.push(cols);
	});
	console.log(rows);

	// function insertTd(data) {
		
	// }

	// var dataTable = {
	// 	data: [],
	// 	init: function() {
	// 		$('')
	// 	}

	// }

	// dataTable.init();
});