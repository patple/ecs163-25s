
const width = window.innerWidth;
const height = window.innerHeight;

let barLeft = 0, barTop = 0;
let barMargin = {top: 10, right: 30, bottom: 30, left: 60},
    barWidth = width -1050- barMargin.left - barMargin.right,
    barHeight = height- 500 - barMargin.top - barMargin.bottom;

let pieLeft = 400, pieTop = 0;
let pieMargin = {top: 10, right: 30, bottom: 30, left: 60},
    pieWidth = width - pieMargin.left - pieMargin.right,
    pieHeight = height - pieMargin.top - pieMargin.bottom;

let streamLeft = 0, streamTop = 400;
let streamMargin = {top: 10, right: 30, bottom: 0, left: 60},
    streamWidth = width - 950-streamMargin.left - streamMargin.right,
    streamHeight = height- 1250 - streamMargin.top - streamMargin.bottom;


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



let selectedTypeColor = null


// BAR GRAPH 
// REFERENCE CODE USED FROM TEMPLATE EXAMPLE
const svg = d3.select("svg")
    

const g = svg.append("g")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .attr("transform", `translate(${barMargin.left+1000}, ${barMargin.top+450})`);

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
        .attr("x", -(barHeight - 400))
        .attr("y", -20)
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
        .attr("class", "x-axis")
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
        const type =d["Type_1"]
        if (body && type){
            if(!bodyTypecount[body]){
                bodyTypecount[body] = {count: 0, types: {}};
            }
            bodyTypecount[body].count += 1;
            bodyTypecount[body].types[type] = (bodyTypecount[body].types[type] || 0) + 1
        }
    })
    const pieChart = Object.entries(bodyTypecount).map(([body, {count,types}]) => ({name: body, value: count, types}))
    const radius = Math.min(pieWidth, pieHeight * 0.40)
    

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
    const pieGraph = svg.append("g").attr("transform", `translate(${pieMargin.left+375}, ${pieTop+450})`);
    
    pieGraph.append("g")
        .attr("stroke", "white")
        .selectAll()
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d =>{
            const typeLines = Object.entries(d.data.types)
                .map(([type,count]) => `-${type}:${count}`)
                .join("\n");
            
             return `${d.data.name}: ${d.data.value.toLocaleString("en-US")}\nTypes: \n${typeLines}`
        })
            

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
        .attr("y", radius + 25)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Distribution of Pokemon by Body Type")
        






        
 
    //Stream Graph
    //CODE REFERENCE FROM D3 GALLERY

    //handles the color dimming when the key is click on
    function updateColor(){
        g.selectAll("rect")
            .transition()
            .duration(700)
           .attr("opacity", d=>{
            if(!selectedTypeColor)
                return 1
            return d.type == selectedTypeColor? 1:0.2
           })
        

         streamGraph.selectAll(".stream-colors")
            .transition()
            .duration(700)
           .attr("opacity", d=>{
            if(!selectedTypeColor)
                return 1
            return d.key == selectedTypeColor? 1:0.2
           })
        
        key.selectAll("rect")
            .transition()
            .duration(300)
           .attr("opacity", d=>{
            if(!selectedTypeColor)
                return 1
            return d == selectedTypeColor? 1:0.2
           })

    }

    const streamGraph = svg.append("g") 
                .attr("width", streamWidth + streamMargin.left + streamMargin.right)
                .attr("height", streamHeight + streamMargin.top + streamMargin.bottom)
                .attr("transform", `translate(${streamMargin.left+900}, ${streamTop-50})`);

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
        .attr("class", "stream-colors")
        .attr("d", area)
        .append("title")
        .text(d =>`${d.key}: ${d[d.length - 1][1] - d[d.length -1][0]}` )

    //Xaxis
    streamGraph.append("g" )
        .attr("transform", `translate(0, ${streamMargin.bottom})`)
        .call(d3.axisBottom(xStream).ticks(generations.length).tickFormat(d => `Gen ${d}`))
       
    //Yaxis
    streamGraph.append("g" )
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisLeft(yStream).ticks(5))
        
    //Yaxis label
    streamGraph.append("text")
        .attr("x", 150)
        .attr("y", streamMargin.left -100)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Number of Pokemon")
        
    // X axis label
     g.append("text")
        .attr("x", streamMargin.bottom + 350)
        .attr("y",streamMargin.bottom - 50)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Pokemon Generations")
        
    // graph label
    streamGraph.append("text")
        .attr("x", 400 )
        .attr("y", -320)
        .attr("text-anchor", "middle")
        .attr("font-weight","bold")
        .text("Pokemon Type Across Generations")
    
    //key for streamgraph
    const key = streamGraph.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${streamMargin.left -150},${streamMargin.left -400} )`)

    const typeList = Array.from(allTypes).sort()


    const keySpacing = 20

    key.selectAll(".key-item")
        .data(typeList)
        .enter()
        .append("g")
        .attr("class", "key-item")
        .attr("transform", (d, i) => `translate(0, ${ i * keySpacing})`)
        .each(function(d){
            const g = d3.select(this)
            g.append("rect")
                .attr("x", -streamMargin.left+10)
                .attr("y", 0)
                .attr("width", 16)
                .attr("height", 16)
                .attr("fill", typeColors[d])
                .style("cursor", "pointer")
                .on("click", ()=>{
                    if(selectedTypeColor == d){
                        selectedTypeColor = null
                    }else{
                        selectedTypeColor = d
                    }
                    updateColor()
                })

            g.append("text")
                .attr("x", -streamMargin.left+30)
                .attr("y", 10)
                .style("font-size", "12px")
                .text(d)
                .on("click", ()=>{
                    if(selectedTypeColor == d){
                        selectedTypeColor = null
                    }else{
                        selectedTypeColor = d
                    }
                    updateColor()
                })
        })

    
    
    }).catch(function(error){
        console.log(error);

})



