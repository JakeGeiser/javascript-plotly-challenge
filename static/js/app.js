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

        // generate initial charts
        var firstId = data.names[0]
        getCharts(firstId,10)
        
        // On change to html DOM tag, use optionChanged function
        d3.selectAll("#selDataset").on("change", optionChanged);
        
        // define optionChanged
        function optionChanged() {
            // assign value of selected data to variable
            var id = d3.select("#selDataset").property("value");

            console.log("Selected Subject", id)

            // generate charts on change
            getCharts(id,10); // getCharts function defined below
        };

        // funtion to generate all charts and demographic info
        function getCharts(idNum,bins) {
            // param - idNum: test subject id number
            // param - bins: input number of elements you want to keep


            // grab demographics
            console.log("METADATA");
            var metaData = data.metadata.find(ele => ele.id == idNum);
            console.log(metaData);

            // grab samples
            console.log("SAMPLES");
            var samples = data.samples.find(ele => ele.id == idNum)
            console.log(samples);
            
            var otuIds = samples.otu_ids.map(ele => `OTU ${ele}`)

            
            // reorganize demographic so its easy to append to a table
            var demographic = Object.entries(metaData).map((ele) => `${ele[0]}: ${ele[1]}`);
            // remove old tables
            d3.selectAll("#sample-metadata").select("table").remove()
            // Append Demographic list of info as table due to list not looking right
            var list = d3.select("#sample-metadata").append("table")
            list.selectAll("tr")
                .data(demographic)
                .enter()
                .append("tr")
                .attr("class","demo-info")
                .html(function (d) {
                    return `<td>${d}</td>`
                })

            console.log("DEMOGRAPHIC LIST");
            console.log(demographic);
            

            function findVal(array,bin) {
                // param - array: input array you want to find value for
                // param - bins: input number of elements you want to keep
                if (array.length >= bin) {
                    return (array.sort((a,b)=>b-a)[bin-1])
                }
                else {
                    return array.length
                }
            }
            
            // define data used for plot
            var traceDataBar = [{
                type: 'bar',
                orientation: 'h',
                x: samples.sample_values,
                y: otuIds,
                text: samples.otu_labels,
                transforms: [{
                    type: 'sort',
                    target: 'x',
                    order: 'ascending'
                }, {
                    type: 'filter',
                    target: 'x',
                    operation: '>=',
                    value: findVal(samples.sample_values,bins)
                }]
            }];
            // define layout for bar chart
            var barLayout = {
                xaxis: {
                    title: "Population"
                }
            };
            // Plot the bar chart
            Plotly.newPlot("bar",traceDataBar,barLayout)

            // defin maxID for use in making colors scale consistently
            var maxID = samples.otu_ids.reduce((a,b) => Math.max(a,b));

            // define data used for bubble chart
            var traceDataBubble = [{
                x: samples.otu_ids,
                y: samples.sample_values,
                mode: "markers",
                text: samples.otu_labels,
                marker: {
                    color: samples.otu_ids.map(ele => 
                        `hsl(${ele/maxID * 360}, 50%, 50%)`),
                    size: samples.sample_values
                }
            }];
            // define layout for bubble chart
            var bubbleLayout = {
                xaxis: {
                    title: 'OTU ID'
                },
                yaxis: {
                    title: 'Population'
                }
            };
            // Plot the bubble chart
            Plotly.newPlot("bubble",traceDataBubble,bubbleLayout);

            d3.select("#gaugediv").append("h2").text("Test")
            // Define data for number gauge
            var traceDataGauge = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: metaData.wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [null,9]}
                }
                }];
            // Define layout for number gauge
            var gaugeLayout = {
                // title: "Belly Button Washing Fequency",
                xaxis: {
                    title: "Scrubs per Week"
                },
                width: 500, 
                height: 400, 
                margin: { t: 0, b: 0 }
            };
            // Plot the Gauge chart
            Plotly.newPlot("gauge",traceDataGauge,gaugeLayout);
            
        };

});

}

BellyButton("samples.json");

