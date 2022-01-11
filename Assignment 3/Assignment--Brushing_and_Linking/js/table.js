function table() {
    let dispatcher;

    function chart(column, data) {
        let table = d3.select(column)
            .append('table')
            .attr("style", "margin-left: 600px")
            .style("border-collapse", "collapse")
            .style("border", "2px black solid") ;
            
        let thead = table.append('thead');
        let tbody = table.append('tbody');

        let header = thead.append('tr')
            .selectAll('th')
            .data(Object.keys(data[0]))
            .enter()
            .append('th')
            .text((function(column) { 
                return column; }));

        let clicked = false;
        
        let rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr')

            .on("mouseover", function () {
                d3.select(this).classed("mouseover", true)
                    .style("background-color", "light grey")
            })

            .on("mouseout", function () {
                d3.select(this)
                    .classed("mouseover", false)
            })

            .on("mousemove", function () {
                if (clicked) {
                    d3.select(this).classed("selected", true);
                    let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                    dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
                }
            })

            .on("mousedown", function () {
                d3.selectAll('tr').classed("selected", false);
                d3.select(this).classed("selected", true);
                clicked = true;
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
            })

            .on("mouseup", function () {
                if (clicked) {
                    clicked = false;
                }
            });

        let values = rows.selectAll("td")
            .data(function(value) {
                return Object.keys(data[0]).map(function (v, i) {
                    return {i: v, value: value[v]};
                });
            })
            .enter()
            .append("td")
            .html(function(v) {
                return v.value;
            });
        return chart;
    }

    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        d3.selectAll('tr').classed("selected", d =>  
        selectedData.includes(d));
    };

    return chart;
}