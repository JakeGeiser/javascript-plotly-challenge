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
            
            samples.otu_ids = samples.otu_ids.map(ele => `OTU ${ele}`)

            
            // reorganize demographic so its easy to append to a list
            var demographic = Object.entries(metaData).map((ele) => `${ele[0]}: ${ele[1]}`);
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
                y: samples.otu_ids,
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

            Plotly.newPlot("bar",traceDataBar)
        }

});

}

BellyButton("samples.json");

