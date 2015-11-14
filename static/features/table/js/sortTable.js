/**
 * Created by kimbyungsoo on 2015-10-14.
 */

$(document).ready(function() {
    $(".sb-table-sort").each(function () {
        $(this).sortTable($(this).data());
    })
});

$.fn.sortTable = function (opt, callback) {
    if ($(this).length === 0) {
        throw "Not Found correct element";
    } else if ($(this).length > 1) {
        var result = [];
        $(this).each(function () {
            result.push(new SortTable($(this), opt, callback));
        })
        return result;
    } else {
        return new SortTable($(this), opt, callback);
    }
}

var SortTable = function (tableElement, opt, callback) {
    if ($.isFunction(opt)) {
        callback = opt;
        opt = null;
    }
    var self = this;
    self.container = tableElement;			// 컨테이너


    //자주 사용 되는 정렬 필드 가져오기
    //th 태그에 "data-sort=false" 인 th는 정렬기능을 두지 않는다.


    $.fn.sortTable.setting = {
        onInit: function ($data) {
        }
    };

    opt = $.extend($.fn.sortTable.setting, opt);
    var dom = {
        "sortAbleField" : $(self.container).children("thead").find("th:not('[data-sort=false]')")
    };
    var data = [];			// sort data
    var iconArr = [];

    function init() {		//초기화
        //정렬 클릭시 블럭 생기는거 방지

        dom.sortAbleField.css({
            'cursor': 'pointer',
            '-ms-user-select': 'none',
            '-moz-user-select': '-moz-none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            'user-select': 'none',
            'vertical-align': 'middle'
        });

        setData();			// 데이터 가져오기(td로부터)
        setField();         // 필드 셋팅
        initEvent();		// 이벤트 생성
        opt.onInit(data);	// 초기화 반환값
    }


    function setField() {
        dom.sortAbleField.data('sort', 'default');
        dom.sortAbleField.append($('<i></i>').addClass('fa').addClass('fa-sort'));
        iconArr = dom.sortAbleField.find('i');
    }

    function initEvent() {

        //각 th클릭시
        dom.sortAbleField.click(function (e) {
            var idx = dom.sortAbleField.index($(this)),
                tmpArr = [],
                destSort;


            for (var i = 0; i < data.length; i++) {
                tmpArr.push({sortNum: i, sortData: data[i][idx]});
            }

            if ($(this).data('sort') == "default" || $(this).data('sort') == "asc") {
                destSort = 'desc';
                tmpArr.sort(function (a, b) {
                    return naturalSort(a.sortData, b.sortData, {intensive: true}) * -1;
                });
            } else if ($(this).data('sort') == "desc") {
                destSort = 'asc';
                tmpArr.sort(function (a, b) {
                    return naturalSort(a.sortData, b.sortData, {intensive: true});
                });
            }

            dom.sortAbleField.data('sort', 'default');
            $(this).data('sort', destSort);
            switchIcon(idx, destSort);
            setSortResult(tmpArr);
        });
    }

    //아이콘을 바꿔준다.
    function switchIcon(index, sort) {
        $(iconArr).attr('class', 'fa fa-sort');
        $(iconArr[index]).attr('class', 'fa fa-sort-' + sort);
    }

    // sort된 값을 가지고 나머지 값들도 정렬해서 넣기
    function setSortResult($arr) {
        self.container.find("tbody").empty();
        for (var i = 0; i < data.length; i++) {
            self.container.find("tbody").append("<tr></tr>");
            for (var j = 0; j < data[i].length; j++) {
                var td = $("<td>" + data[$arr[i].sortNum][j] + "</td>");
                self.container.find("tbody > tr:nth-child(" + (i + 1) + ")").append(td);
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
    function naturalSort(a, b) {
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            sre = /(^[ ]*|[ ]*$)/g,
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function (s) {
                return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s
            },
        // convert all to strings strip whitespace
            x = i(a).replace(sre, '') || '',
            y = i(b).replace(sre, '') || '',
        // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
        // numeric, hex or date detection
            xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
            yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
            oFxNcL, oFyNcL;
        // first try and sort Hex codes or Dates
        if (yD)
            if (xD < yD) return -1;
            else if (xD > yD) return 1;
        // natural sorting through split numeric strings and default strings
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
                return (isNaN(oFxNcL)) ? 1 : -1;
            }
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

    function setData() {
        data = [];
        $(self.container).children("tbody").children("tr").each(function (i) {
            var cols = [];
            $(this).children("td").each(function (j) {
                cols.push($(this).html());
            })
            data.push(cols);
        });
    }

    init();

    return self;		// 객체자체를 리턴
    /*
     * ex) var sortTable = $(".sort-table").sortTable({});
     * console.log(sortTable.container);		//$(".sort-table")을 리턴 받을 수 있음
     */
};

SortTable.prototype.action =function() {
    console.log('to do something');
}
