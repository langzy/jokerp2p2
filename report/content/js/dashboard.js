/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\u767B\u5F55-4"], "isController": false}, {"data": [1.0, 500, 1500, "\u767B\u5F55-3"], "isController": false}, {"data": [1.0, 500, 1500, "\u767B\u5F55-5"], "isController": false}, {"data": [1.0, 500, 1500, "\u83B7\u53D6\u77ED\u4FE1\u9A8C\u8BC1\u7801"], "isController": false}, {"data": [1.0, 500, 1500, "\u767B\u5F55"], "isController": false}, {"data": [1.0, 500, 1500, "\u6CE8\u518C"], "isController": false}, {"data": [1.0, 500, 1500, "\u83B7\u53D6\u56FE\u7247\u9A8C\u8BC1\u7801"], "isController": false}, {"data": [1.0, 500, 1500, "\u662F\u5426\u767B\u5F55"], "isController": false}, {"data": [1.0, 500, 1500, "\u5B9E\u540D\u8BA4\u8BC1"], "isController": false}, {"data": [1.0, 500, 1500, "\u767B\u5F55-2"], "isController": false}, {"data": [1.0, 500, 1500, "\u767B\u5F55-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11, 0, 0.0, 66.72727272727273, 34, 105, 103.0, 105.0, 105.0, 6.756756756756757, 2.7035424984643734, 2.263849431818182], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\u767B\u5F55-4", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 14.492753623188406, 2.8023097826086953, 4.670516304347825], "isController": false}, {"data": ["\u767B\u5F55-3", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 13.698630136986301, 2.608625856164384, 4.49486301369863], "isController": false}, {"data": ["\u767B\u5F55-5", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 12.82051282051282, 3.0924479166666665, 4.194210737179487], "isController": false}, {"data": ["\u83B7\u53D6\u77ED\u4FE1\u9A8C\u8BC1\u7801", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 19.607843137254903, 3.791360294117647, 6.2423406862745106], "isController": false}, {"data": ["\u767B\u5F55", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 19.230769230769234, 5.314753605769231, 5.972055288461538], "isController": false}, {"data": ["\u6CE8\u518C", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 3.230168269230769, 5.618990384615384], "isController": false}, {"data": ["\u83B7\u53D6\u56FE\u7247\u9A8C\u8BC1\u7801", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 9.523809523809526, 20.414806547619047, 1.4694940476190477], "isController": false}, {"data": ["\u662F\u5426\u767B\u5F55", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 29.41176470588235, 5.227481617647059, 8.645450367647058], "isController": false}, {"data": ["\u5B9E\u540D\u8BA4\u8BC1", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 20.0, 4.58984375, 13.84765625], "isController": false}, {"data": ["\u767B\u5F55-2", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 16.129032258064516, 3.165952620967742, 5.119077620967742], "isController": false}, {"data": ["\u767B\u5F55-1", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 10.526315789473683, 3.680098684210526, 2.6932565789473686], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
