/**
 * Created by kimbyungsoo on 2015-10-14.
 */

(function($){
	$.fn.sortTable = function(opt, callback){
		if($.isFunction(opt)){
			callback = opt;
			opt = null;
		}

		$.fn.sortTable.setting = {
			onInit:function($data){}
		};

		opt = $.extend($.fn.sortTable.setting, opt);

		var el = this;			// 컨테이너
		var data = [];			// sort data
		var sortStatus = [];	// 각 th의 현재 정렬 상태

		function init(){		//초기화
			// 각 정렬상태에 초기값 지정
			$(el).children("thead").find("th").each(function(i){
				sortStatus.push("desc");
			});

			setData();			// 데이터 가져오기(td로부터)
			initEvent();		// 이벤트 생성
			opt.onInit(data);	// 초기화 반환값
		}

		function initEvent(){
			var $head = $(el).children("thead").find("th").addClass("noselect").css("cursor", "pointer").append("<i></i>");
			//각 th클릭시
			$head.click(function(e){
				var idx = $(this).index();
				var tmpArr = [];
				for(var i = 0; i<data.length; i++){
					tmpArr.push({sortNum:i, sortData:data[i][idx]});
				}

				if(sortStatus[idx] == "asc"){
					$(this).find("i").removeClass("upArrow");
					$(this).find("i").addClass("downArrow").parent().siblings().find("i").removeClass("downArrow upArrow");
					sortStatus[idx] = "desc";
					tmpArr.sort(function(a,b){
						return naturalSort(a.sortData, b.sortData, {intensive:true}) * -1;
					});
				}else if(sortStatus[idx] == "desc"){
					$(this).find("i").removeClass("downArrow");
					$(this).find("i").addClass("upArrow").parent().siblings().find("i").removeClass("upArrow downArrow");
					sortStatus[idx] = "asc";
					tmpArr.sort(function(a,b){
						return naturalSort(a.sortData, b.sortData, {intensive:true});
					});
				}
				setSortResult(tmpArr);
			});
		}

		// sort된 값을 가지고 나머지 값들도 정렬해서 넣기
		function setSortResult($arr){
			el.find("tbody").empty();
			for(var i = 0; i<data.length; i++){
				el.find("tbody").append("<tr></tr>");
				for(var j = 0; j<data[i].length; j++){
					var td = $("<td>"+data[$arr[i].sortNum][j]+"</td>");
					el.find("tbody > tr:nth-child("+(i+1)+")").append(td);
				}
			}
			setData();		// 데이터가 재정렬 되었으므로 다시 가지고 옴
		}



		/* 
		* 자바스크립트의 경우 숫자와 문자 또는 시간타입문자의 경우에 한꺼번에 정렬을 해줄수 없기 때문에 
		* 자연정렬 알고리즘 검색후 인용
		*/

		/*
		* Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
		* Author: Jim Palmer (based on chunking idea from Dave Koelle)
		*/
		function naturalSort (a, b) {
			var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
			sre = /(^[ ]*|[ ]*$)/g,
			dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
			hre = /^0x[0-9a-f]+$/i,
			ore = /^0/,
			i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
			// convert all to strings strip whitespace
			x = i(a).replace(sre, '') || '',
			y = i(b).replace(sre, '') || '',
			// chunk/tokenize
			xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
			yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
			// numeric, hex or date detection
			xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
			yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
			oFxNcL, oFyNcL;			
			// first try and sort Hex codes or Dates
			if (yD)
				if ( xD < yD ) return -1;
			else if ( xD > yD ) return 1;
			// natural sorting through split numeric strings and default strings
			for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
			// find floats not starting with '0', string or 0 if not defined (Clint Priest)
			oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
			oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
			// handle numeric vs string comparison - number < string - (Kyle Adams)
			if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
			// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
			else if (typeof oFxNcL !== typeof oFyNcL) {
				oFxNcL += '';
				oFyNcL += '';
			}
			if (oFxNcL < oFyNcL) return -1;
			if (oFxNcL > oFyNcL) return 1;
			}
			return 0;
		}

		function setData(){
			data = [];
			$(el).children("tbody").children("tr").each(function(i){
				var cols = [];
				$(this).children("td").each(function(j){
					cols.push($(this).html());
				})
				data.push(cols);
			});
		}

		init();

		return el;		// 컨테이너를 리턴해주면 적용하는곳에서 자기자신을 리턴 받을수 있음
		/*
		* ex) var sortTable = $(".sort-table").sortTable({});
		* console.log(sortTable);		//$(".sort-table")을 리턴 받을 수 있음
		*/
	};
})(jQuery);