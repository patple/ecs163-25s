
const width = window.innerWidth;
const height = window.innerHeight;

let barLeft = 0, barTop = 0;
let barMargin = {top: 10, right: 30, bottom: 30, left: 60},
    barWidth = 400 - barMargin.left - barMargin.right,
    barHeight = 350 - barMargin.top - barMargin.bottom;

let pieLeft = 400, pieTop = 0;
let pieMargin = {top: 10, right: 30, bottom: 30, left: 60},
    pieWidth = 400 - pieMargin.left - pieMargin.right,
    pieHeight = 350 - pieMargin.top - pieMargin.bottom;

let streamLeft = 0, streamTop = 450;
let streamMargin = {top: 10, right: 30, bottom: 30, left: 60},
    streamWidth = width - 600-streamMargin.left - streamMargin.right,
    streamHeight = height- 1300 - streamMargin.top - streamMargin.bottom;


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
    

const g = svg.append("g")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`);

d3.csv("pokemon_alopez247.csv").then(data =>{

    const numType = {}

    data.forEach(d =>{
        const type1 = d["Type_1"]
        const type2 = d["Type_2"]

        if (type1) numType[type1] = (numType[type1] || 0) + 1
        if (type2) numType[type2] = (numType[type2] || 0) + 1
    })

    const barChartdata = Object.entries(numType).map(([type, count]) => ({type: type, count: count}))
   
    // X lables
    g.append("text")
        .attr("x", barWidth /2)
        .attr("y", barHeight + 50)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Pokemon Type")
        

    // Y labels
    g.append("text")
        .attr("x", -(barHeight - 220))
        .attr("y", -40)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Number of Pokemon")

    g.append("text")
        .attr("x", -(barHeight - 550))
        .attr("y", -40)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Pokemon Type")
    
    

    g.append("text")
        .attr("x", -(barHeight - 550))
        .attr("y", -45)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Distrubtion of Pokemon Types")
        

    // X ticks
    const x = d3.scaleBand()
        .domain(barChartdata.map(d => d.type))
        .range([0, barWidth])
        .paddingInner(0.3)
        .paddingOuter(0.2)

    const xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("transform", `translate(0, ${barHeight})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    // Y ticks
    const y = d3.scaleLinear()
        .domain([0, d3.max(barChartdata, d => d.count)])
        .range([barHeight, 0])
        .nice();

    const yAxisCall = d3.axisLeft(y).ticks(6);
    g.append("g").call(yAxisCall);

    // bars
    const bars = g.selectAll("rect").data(barChartdata)
    bars.enter().append("rect")
        .attr("y", d => y(d.count))
        .attr("x", d => x(d.type))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.count))
        .attr("fill", d => typeColors[d.type])






    // PIE CHART
    // REFERENCE CODE USED FROM D3 GALLERY
    const bodyTypecount = {}
    data.forEach(d => {
        const body = d["Body_Style"]
        if(body) bodyTypecount[body] = (bodyTypecount[body] || 0) + 1
    })
    const pieChart = Object.entries(bodyTypecount).map(([body, count]) => ({name: body, value: count}))
    const radius = Math.min(pieWidth, pieHeight)

    const color = d3.scaleOrdinal()
        .domain(pieChart.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), pieChart.length).reverse())

    const pie = d3.pie()
        .sort(null)
        .value(d =>d.value)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    const arcs = pie(pieChart)
    const pieGraph = svg.append("g").attr("transform", `translate(${pieMargin.left+500}, ${pieTop+750})`);
    
    pieGraph.append("g")
        .attr("stroke", "white")
        .selectAll()
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`)

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
        .style("font-size", "12px")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.05).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString("en-US")))

    //pieChart label
    pieGraph.append("text")
        .attr("x", 0)
        .attr("y", radius + 45)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Distribution of Pokemon by Body Type")
   






        
 
    //Stream Graph
    //CODE REFERENCE FROM D3 GALLERY


    const streamGraph = svg.append("g") 
                .attr("width", streamWidth + streamMargin.left + streamMargin.right)
                .attr("height", streamHeight + streamMargin.top + streamMargin.bottom)
                .attr("transform", `translate(${streamMargin.left+350}, ${streamTop})`);

    // sorts the data by seperating the pokemon by type per generation
    const generations = Array.from(new Set(data.map(d => d.Generation))).sort()
    const allTypes = new Set()
    data.forEach(d =>{
        allTypes.add(d.Type_1)
        if (d.Type_2) allTypes.add(d.Type_2)
    })

    const typePerGen = generations.map(gen =>{
        const genCount = data.filter(d => d.Generation == gen)
        const counts = {}
        allTypes.forEach(type =>{
            counts[type] = genCount.filter(d => d.Type_1 == type || d.Type_2 == type).length
        })
        return {generation: gen, ...counts}
    })

    const series = d3.stack()
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderInsideOut)
        .keys(Array.from(allTypes))
        (typePerGen)

    const xStream = d3.scaleLinear()
        .domain(d3.extent(generations))
        .range([0, streamWidth])
    
    const yStream = d3.scaleLinear()
        .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
        .range([0, streamHeight])
        
    const area = d3.area()
        .x(d => xStream(+d.data.generation))
        .y0(d => yStream(d[0]))
        .y1(d => yStream(d[1]))
        .curve(d3.curveBasis)
    
    streamGraph.append("g")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", d => typeColors[d.key])
        .attr("d", area)
        .append("title")
        .text(d =>`${d.key}: ${d[d.length - 1][1] - d[d.length -1][0]}` )

    //Xaxis
    streamGraph.append("g" )
        .attr("transform", `translate(0, ${streamHeight})`)
        .call(d3.axisBottom(xStream).ticks(generations.length).tickFormat(d => `Gen ${d}`))
       
    //Yaxis
    streamGraph.append("g" )
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisLeft(yStream).ticks(5))
        
    //Yaxis label
    streamGraph.append("text")
        .attr("x", -(streamHeight - 300))
        .attr("y", -marginLeft + 30)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Number of Pokemon")
        
    // X axis label
     g.append("text")
        .attr("x", streamWidth/2)
        .attr("y", streamheight + 40)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Pokemon Generations")
        
    // graph label
    streamGraph.append("text")
        .attr("x", streamWidth /2 )
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-weight","bold")
        .text("Pokemon Type Across Generations")
    
    //key for streamgraph
    const key = streamGraph.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${streamWidth + 20}, 20)`)

    const typeList = Array.from(allTypes).sort()

    const keyHeight = 20
    const keySpacing = 5

    key.selectAll("key-item")
        .data(typeList)
        .enter()
        .append("g")
        .attr("class", "key-item")
        .attr("transform", (d, i) => `translate(0, ${ i * (keyHeight + keySpacing)})`)
        .each(function(d){
            const g = d3.select(this)
            g.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 16)
                .attr("height", 16)
                .attr("fill", typeColors[d])

            g.append("text")
                .attr("x", 20)
                .attr("y", 10)
                .style("font-size", "12px")
                .text(d)
        })
    
    }).catch(function(error){
        console.log(error);

})
