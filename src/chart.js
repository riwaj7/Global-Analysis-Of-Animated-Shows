export class Chart {
    /**
     *
     * @param svgID
     * @param width
     * @param height
     */
    constructor(svgID, width, height) {
        this.rootSVG = d3.select(`#${svgID}`)
            .attr('width', width)
            .attr('height', height)

        this.rootHeight = height
        this.rootWidth = width

        this.margins = {
            top: Math.round(this.rootHeight * .05),
            bottom: Math.round(this.rootHeight * .1),
            left: Math.round(this.rootWidth * .1),
            right: Math.round(this.rootWidth * .05)
        }
        this.dimensions = {
            width: this.rootWidth - (this.margins.left + this.margins.right),
            height: this.rootHeight - (this.margins.top + this.margins.bottom),
            margins: this.margins
        }

        if(svgID=='scatter_chart'||svgID=='area_chart'){
            this.CHART = this.rootSVG.append('g')
                .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
                .attr("clip-path", "url(#clip)")
        }
        else{
            this.CHART = this.rootSVG.append('g')
                .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
        }
    }

    /**
     *
     * @param margin
     * @param value
     */
    setMargin(margin, value){
        if(margin === 'top'){
            this.margins.top = value
        }
        else if(margin === 'bottom'){
            this.margins.bottom = value
        }
        else if(margin === 'right'){
            this.margins.right = value
        }
        else if(margin === 'left'){
            this.margins.left = value
        }
        else{
            throw new Error('Invalid margin selection')
        }
    }

    setChartData(data){
        this.data = data
    }

    getChartData(){
        if(!this.hasOwnProperty('data')){
            return null
        }
        else{
            return this.data
        }
    }

    resetViz(){
        // console.log(this)
        if(this.element.id=='bubble_section'){
            d3.selectAll('.countryBubbles')
                .attr('fill', '#af7aa1')

            d3.select('#bubble_title')
                .style('opacity', '0')

            document.getElementById('viz_description')
                .innerHTML = ''
        }
        if(this.element.id=='scatter_section'){
            d3.select('#scatter_title')
                .style('opacity', 0)
            var widthS=document.getElementById('scatter_chart').getAttribute('width')
            widthS=widthS-(widthS*.15)
            var heightS=document.getElementById('scatter_chart').getAttribute('height')
            heightS=heightS-(heightS*.15)
            const xScale = d3.scaleLinear()
                .domain([0,55])
                .range([0,widthS])
            const yScale = d3.scaleLinear()
                .domain([0,6500])
                .range([heightS,0])
            d3.select('.scatterXAxis')
                .transition().call(d3.axisBottom(xScale).ticks(5))
            d3.select('.scatterYaxis')
                .transition().call(d3.axisLeft(yScale))
                .selectAll('text')
                    .attr('dx','12px')
                    .attr('dy','-5px')
                    .attr('transform', 'rotate(-60)' );
            
            d3.selectAll('.episodeCircle')
                .transition()
                // .attr('fill',d=>color_country(d))
                .attr('r',3)
                .attr('cx', row=>xScale(row['Years']))
                .attr('cy', row=>yScale(row['Episodes']))                
            
            document.getElementById('viz_description')
                .innerHTML = ''
        }
        if(this.element.id=='area_section'){
            d3.select('#area_title')
                .style('opacity',0)
            var widthA=document.getElementById('area_chart').getAttribute('width')
            widthA=widthA-(widthA*.13)
            var heightA=document.getElementById('area_chart').getAttribute('height')
            heightA=heightA-(heightA*.15)
            const xScale = d3.scaleLinear()
                .domain([1987,2022])
                .range([0,widthA])
            const yScale = d3.scaleLinear()
                .domain([0,6500])
                .range([heightA,0])
            const AColor=d3.scaleOrdinal() //simple color assignation since small number of categories shown
                .domain(['CGI','Flash','Traditional','Other'])
                .range(d3.schemeSet2);
            d3.select('.areaXAxis')
                .transition().call(d3.axisBottom(xScale).ticks(5))
            d3.selectAll('.myArea')
                .transition()
                .attr('opacity',1)
                .style('fill',function(d){
                    return AColor(d.key)})

            document.getElementById('viz_description')
                .innerHTML = ''

        }
        
    }

}
