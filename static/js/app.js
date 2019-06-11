// Build the metadata panel
function buildMetadata(sample) {

    // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
      d3.json(url).then(data => {
        // Use d3 to select the panel with id of `#sample-metadata`
        var sample_metadata = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        sample_metadata.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        var list = sample_metadata.append("ul");
        Object.entries(data).forEach(([key, value]) => {
          list.append("li").text(`${key}: ${value}`);
        });

    });
}

//Build out the function for populating the the bubble plot and pie chart
function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    console.log(data);
    var sample_values = data.sample_values
    var otu_ids = data.otu_ids
    var otu_labels = data.otu_labels

    // Build a trace for the bubble plot
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    };
    // Define the dimensions of the chart and label the x-axis 
    var layout = {
      height: 600,
      width: 1300,
      xaxis: {
        title: {
          text: 'OTU Ids',
          font: {
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
    }
    // Create a list out of trace 1
    var plotdata = [trace1];
    
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", plotdata, layout);

    // Define the spot on the page to render the pie chart
    var layout2 = {
      height: 400,
      width: 600
    };

    // Create a trace to show top 10 sample values in a pie chart
    var trace2 = { 
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hoverinfo: otu_labels.slice(0,10),
      type: "pie"
      
    }
    // Create a list out of trace 2
    var plotdata2 = [trace2];
    
    // Render the plot to the div tag with id "pie"
    Plotly.newPlot("pie", plotdata2,layout2);


  })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();