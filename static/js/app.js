function BellyButton(jsonData) {
    // Param jsonData - string location of data to use

    // access the the data, then use it
    d3.json(jsonData).then(function (data) {
        console.log("data.samples")
        console.log(data.samples);

        // map the needed data
        // console.log("otu_ids")
        // var otu_ids = data.samples.map(ele => ele.otu_ids);
        // console.log(otu_ids);

        // console.log("otu_labels")
        // var otu_labels = data.samples.map(ele => ele.otu_labels);
        // console.log(otu_labels);

        // console.log("sample_values")
        // var sample_values = data.samples.map(ele => ele.sample_values);
        // console.log(sample_values);

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
        };

});

}

BellyButton("samples.json");

