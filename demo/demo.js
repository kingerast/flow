Chart.ready(() => {
    // 开始节点的坐标
    var startX = 30;
    var startY = 40;
    // 结束节点的坐标
    var endY = 350;
    var endX = 150;
    // 创建节点的坐标
    var newX = 50;
    var newY = 50;

    let _current = null; // 当前选择节点id
    let _least = null; //定义上一个选择的节点id

    var seqArray = TEST_NODES.concat(); //保存nodes

    let _showNodeInfo = (data) => {
        if (!data) {
            return;
        }

        let infoPanel = $('.right');
        infoPanel.find('.proc-name').text(data.name || '');
        infoPanel.find('.proc-desc').text(data.desc || '');
    };

    let _hideNodeInfo = () => {
        _showNodeInfo({
            name: '',
            desc: ''
        });
    };

    let _createChart = function () {
        return new Chart($('#demo-chart'), {
            onNodeClick(data) { // 点击节点时触发
                _showNodeInfo(data);
                _least = _current
                _current = data.nodeId;
                if(_least){
                    for (let i = 0; i < $(".task").length; i++){
                        if($(".task")[i].id == _least){
                            console.log($("#changeid").text(function(){
                                return "选择交换的节点："+$(".task").eq(i).text();
                            }));
                            //$(".task").eq(i).text();
                            break;
                        }
                    }
                }
                
            },
            onNodeDel(data) {
                console.log(data);
                _hideNodeInfo();
            }
        })
    };

    let chart = _createChart();

    //添加开始节点
    let nodeStart = chart.addNode('开始', startX, startY, {
        class: 'node-start',
        removable: false,
        data: {
            name: '开始',
            nodeType: 0
        }
    });
    nodeStart.addPort({
        isSource: true
    });

    //添加结束节点
    let nodeEnd = chart.addNode('结束', endX, endY, {
        class: 'node-end',
        removable: false,
        data: {
            name: '结束',
            nodeType: 0
        }
    });
    nodeEnd.addPort({
        isTarget: true,
        position: 'Top'
    });

    const addNewTask = (name, params) => {
        params = params || {};
        params.data = params.data || {};
        params.class = 'node-process';
        params.data.nodeType = 1; // 流程节点类型
        let node = chart.addNode(name, newX, newY, params);
        node.addPort({
            isSource: true
        });
        node.addPort({
            isTarget: true,
            position: 'Top'
        });
    };

    // 排序函数
    const sort = () => {
        var chartwidth = $(window).width() - 550; // 当前桌布大小
        // var widthleaft = chartwidth; //定义当行剩余长度  
        // var issequence = true; //定义排列顺序和倒

        let tasklength = $(".task").length;
        for (let i = 0; i < tasklength; i++) {
            chart.removeNode($(".task")[0].id);
        }

        //冒泡排序
        for (let i = seqArray.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (seqArray[j].proportion > seqArray[j + 1].proportion) {
                    let a = seqArray[j];
                    seqArray[j] = seqArray[j + 1];
                    seqArray[j + 1] = a;
                }
            }
        }

        // 添加开始节点
        let nodeStart = chart.addNode('开始', startX, startY, {
            class: 'node-start',
            removable: false,
            data: {
                name: '开始',
                nodeType: 0
            }
        });
        nodeStart.addPort({
            isSource: true
        });
        newX = startX + $('.node-start').eq(0).width() + 100;
        newY = startY;
        // 历遍排序
        for (let i = 0; i < seqArray.length; i++) {
            for (let j = 0; j < seqArray.length; j++) {
                if (TEST_NODES[j].name == seqArray[i].name) {
                    $('ul a').eq(j).click();
                    break;
                }
            };
            if (newX + $(".node-process").eq(i).width() + 50 > chartwidth) {
                newX = startX;
                newY += 120;
                // $(".node-process")[i].remove();
                chart.removeNode($('.node-process')[i].id);
                for (let j = 0; j < seqArray.length; j++) {
                    if (TEST_NODES[j].name == seqArray[i].name) {
                        $('ul a')[j].click();
                        break;
                    }
                };
            }
            newX += $(".node-process").eq(i).width() + 100;
        }
        //添加结束
        if (newX + 29 + 44 > chartwidth) {
            newX = startX;
            newY += 120;
        }
        let nodeEnd = chart.addNode('结束', newX, newY, {
            class: 'node-end',
            removable: false,
            data: {
                name: '结束',
                nodeType: 0
            }
        });
        nodeEnd.addPort({
            isTarget: true,
            position: 'Top'
        });

        for (let i = 0; i < $(".window").length -1; i++) {
            chart._jsPlumb.connect({
                source: $(".window")[i].id,
                target: $(".window")[i+1].id,
                deleteEndpointsOnDetach: false,
                paintStyle: ChartNode.lineStyle,
                anchors: ["Bottom", [0.5, 0, 0, -1]]
            });

        }

    };

    //交换函数
    const changenode = (node1 , node2) => {
        if(node1 == null || node2 == null){
            return 0;
        }else{
            let node1name = null;
            let node2name = null;
            let tasklength = $(".task").length;
            for (let i = 0; i < tasklength; i++) {
                if($(".task")[i].id == node1){
                    for (let j = 0; j < tasklength; j++){
                        if($(".task")[j].id == node2){
                            node1name = $(".task").eq(i).text();
                            node2name = $(".task").eq(j).text();
                            break;
                        }
                    }
                    break;
                }
            }
            for(let i = seqArray.length-1;i>=0;i--){
                if(seqArray[i].name == node1name){
                    for(let j = seqArray.length -1;j>=0;j--){
                        if(seqArray[j].name == node2name){
                            let temnodename = seqArray[i].proportion;
                            seqArray[i].proportion = seqArray[j].proportion;
                            seqArray[j].proportion = temnodename;
                            break;
                        }
                    }
                    break;
                }
            }
            sort();
        }
    }

    const bindEvent = () => {
        $(".flowchart-panel").on('click', '.btn-add', function (event) {
            let target = $(event.target);
            let node = target.data('node');
            addNewTask(node.name, {
                data: node
            });
        });

        $(".btn-save").click(() => {
            $('#jsonOutput').val(JSON.stringify(chart.toJson()));
        });

        $(".btn-load").click(() => {
            if ($('#demo-chart').length === 0) {
                $('<div id="demo-chart"></div>').appendTo($('.middle'));
                chart = _createChart();
            }
            chart.fromJson($('#jsonOutput').val());
        });

        $(".btn-clear").click(() => {
            $('#demo-chart').remove();
            chart.clear();
        });

        $(".btn-change").click(() => {
            changenode(_current, _least);
        });

        $(".btn-del").click(() => {
            if (!_current) {
                return;
            }
            chart.removeNode(_current);
        });
        $(".btn-sort").click(() => {
            sort();
        });
    };

    bindEvent();

    // 使用测试数据
    let listHtml = '';
    TEST_NODES.forEach(node => {
        listHtml += `<li><span class='node-name'>${node.name}</span><a class='btn-add' data-id='node.procId' href='javascript:void(0)'>添加</a></li>`;
    });
    $('.nodes').html(listHtml);
    $('.nodes').find('.btn-add').each(function (index) {
        $(this).data('node', $.extend({}, TEST_NODES[index]));
    });

});