
const width = 600
const height = 400
const marginTop = 45;
const marginRight = 100;
const marginBottom = 60;
const marginLeft = 60;


// taken from here https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3 
const typeColors = {
	Normal: '#A8A77A',
	Fire: '#EE8130',
	Water: '#6390F0',
	Electric: '#F7D02C',
	Grass: '#7AC74C',
	Ice: '#96D9D6',
	Fighting: '#C22E28',
	Poison: '#A33EA1',
	Ground: '#E2BF65',
	Flying: '#A98FF3',
	Psychic: '#F95587',
	Bug: '#A6B91A',
	Rock: '#B6A136',
	Ghost: '#735797',
	Dragon: '#6F35FC',
	Dark: '#705746',
	Steel: '#B7B7CE',
	Fairy: '#D685AD',
};



// BAR GRAPH 
// REFERENCE CODE USED FROM TEMPLATE EXAMPLE
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

const g = svg.append("g").attr("transform", `translate(${marginLeft}, ${marginTop})`)

d3.csv("pokemon_alopez247.csv").then(data =>{

    const numType = {}

    data.forEach(d =>{
        const type1 = d["Type_1"]
        const type2 = d["Type_2"]

        if (type1) numType[type1] = (numType[type1] || 0) + 1
        if (type2) numType[type2] = (numType[type2] || 0) + 1
    })

    const barChartdata = Object.entries(numType).map(([type, count]) => ({type: type, count: count}))
    const chartWidth = width - marginLeft - marginRight
    const chartHeight = height - marginTop - marginBottom

    // X lables
    g.append("text")
        .attr("x", width - marginLeft - marginRight * 3.25)
        .attr("y", height - marginTop - 5)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Pokemon Type")

    // Y labels
    g.append("text")
        .attr("x", -(chartHeight/2))
        .attr("y", -marginLeft + 25)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Number of Pokemon")

    // X ticks
    const x = d3.scaleBand()
        .domain(barChartdata.map(d => d.type))
        .range([0, chartWidth])
        .paddingInner(0.3)
        .paddingOuter(0.2);

    const xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    // Y ticks
    const y = d3.scaleLinear()
        .domain([0, d3.max(barChartdata, d => d.count)])
        .range([chartHeight, 0])
        .nice();

    const yAxisCall = d3.axisLeft(y).ticks(6);
    g.append("g").call(yAxisCall);

    // bars
    const bars = g.selectAll("rect").data(barChartdata);
    bars.enter().append("rect")
        .attr("y", d => y(d.count))
        .attr("x", d => x(d.type))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.count))
        .attr("fill", d => typeColors[d.type]);






    // PIE CHART
    // REFERENCE CODE USED FROM D3 GALLERY
    const bodyTypecount = {}
    data.forEach(d => {
        const body = d["Body_Style"]
        if(body) bodyTypecount[body] = (bodyTypecount[body] || 0) + 1
    })
    const pieChart = Object.entries(bodyTypecount).map(([body, count]) => ({name: body, value: count}))
    const radius = Math.min(width, height/ 1.5)

    const color = d3.scaleOrdinal()
        .domain(pieChart.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    const pie = d3.pie()
        .sort(null)
        .value(d =>d.value)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    const arcs = pie(pieChart)
    const pieGraph = svg.append("g").attr("transform", `translate(${300}, ${500})`)
    
    pieGraph.append("g")
        .attr("stroke", "white")
        .selectAll()
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

    const labels = radius * 0.8
    const arcLabel = d3.arc()
        .innerRadius(labels)
        .outerRadius(labels)

    pieGraph.append("g")
        .attr("text-anchor", "middle")
        .selectAll()
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString("en-US")));
    
    }).catch(function(error){
        console.log(error);

})