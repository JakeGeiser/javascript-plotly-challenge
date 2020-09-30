function BellyButton(jsonData) {
    // Param jsonData - string location of data to use

    // access the the data, then use it
    d3.json(jsonData).then(function (data) {
        console.log("data")
        console.log(data);

        // generate select option for all subjects
        var options = d3.select("#selDataset").selectAll("option");
        options.data(data.samples)
            .enter()
            .append("option")
            .attr("value",function (d) {
                return d.id
            })
            .text(function (d) {
                return d.id
            });
     
        // On change to html DOM tag, use optionChanged function
        d3.selectAll("#selDataset").on("change", optionChanged);

        // define optionChanged
        function optionChanged() {
            // assign value of selected data to variable
            var id = d3.select("#selDataset").property("value");

            console.log("Selected Subject", id)

            barChart(id);
        };

        function barChart(idNum) {
            // grab demographics
            console.log("DEMOGRAPHIC");
            var demographic = data.metadata.find(ele => ele.id == idNum);
            console.log(demographic);
            // samples
            console.log("SAMPLES");
            var samples = data.samples.find(ele => ele.id == idNum)
            console.log(samples);

            // define data used for plot
            var traceData = [{
                type: 'bar',
                orientation: 'h',
                x: [10,20],
                y: ["biden","trump"],
                text: ["slow Joe","deplorable"],
                transforms: [{
                    type: 'sort',
                    target: 'x',
                    order: 'ascending'
                }]
            }];

            Plotly.newPlot("bar",traceData)
        }

});

}

BellyButton("samples.json");

