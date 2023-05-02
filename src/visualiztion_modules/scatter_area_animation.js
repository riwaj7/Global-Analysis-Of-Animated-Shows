export const animateScatterTitle = () => {
    d3.select('#scatter_title')
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style('opacity', '1')
}

export const animateAreaTitle = () => {
    d3.select('#area_title')
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style('opacity', '1')
}

export class ScatterAnimator{
    constructor({descriptions, descriptionD3Node, chartData, dimensions}) {
        this.descriptions = descriptions
        this.animationStack = []
        this.chartData=chartData
        this.dimensions=dimensions

        this.animationStack.push(this.animateScatterTitle)

        const doColors=this.yearColorAnimation()
        const zoomBottomLeft=this.shrinkAxes(0,10,10,500)
        const zoomSazae=this.shrinkAxes(53,55,6300,6400)
        const axisRestore=this.restoreAxes()
        const recentHighlight=this.highlight(4,1)
        const olderHighlight=this.highlight(1,4)
        const resetHighlight=this.highlight(3,3)

        this.descriptions.forEach((description, index) => {
            
            const textAnimation = function (){
                
                descriptionD3Node
                    .append('p')
                    .style('opacity', '0')
                    .text(description)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .style('opacity', '1')
                if(index==0){
                zoomBottomLeft()
                }
                if(index==2){
                    axisRestore()
                }
                if(index==4){
                    recentHighlight()
                }
                if(index==6){
                    olderHighlight()
                }
                if(index==7){
                    resetHighlight()
                }
                if(index==8){
                    zoomSazae()
                }
            }


            this.animationStack.push(textAnimation)
        })
    }


    animateScatterTitle(){
        d3.select('#scatter_title')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .style('opacity', '1')
    }

    yearColorAnimation(){
        const shows=d3.selectAll('.episodeCircle')
        const yearColor=d3.scaleLinear()
            .domain([1948,2022])
            .range(['blue','red'])
        return function(){
            shows
                .transition()
                .duration(500)
                .attr('fill',d=>color_country(d))
                .attr('r',2)
        }
    }
    shrinkAxes(x1,x2,y1,y2){
       const xAx=d3.selectAll('.scatterXAxis')
       const yAx=d3.selectAll('.scatterYAxis')
       const shows=d3.selectAll('.episodeCircle')
        const xScale = d3.scaleLinear()
            .domain([x1,x2])
            .range([0,this.dimensions.width])
        const yScale = d3.scaleLinear()
            .domain([y1,y2])
            .range([this.dimensions.height,0])
        return function(){
            xAx.transition().duration(500).call(d3.axisBottom(xScale).ticks(5))
            yAx.transition().duration(500).call(d3.axisLeft(yScale))
                .selectAll('text')
                .attr('dx','12px')
                .attr('dy','-5px')
                .attr('transform', 'rotate(-60)' );
            shows.transition()
                .duration(500)
                .attr('cx', row=>xScale(row['Years']))
                .attr('cy', row=>yScale(row['Episodes']))
                .attr('r',3)
        }
    }
    restoreAxes(){
        const xAx=d3.selectAll('.scatterXAxis')
        const yAx=d3.selectAll('.scatterYAxis')
        const shows=d3.selectAll('.episodeCircle')
        const xScale = d3.scaleLinear()
            .domain([0,55])
            .range([0,this.dimensions.width])
        const yScale = d3.scaleLinear()
            .domain([0,6500])
            .range([this.dimensions.height,0])
        return function(){
            xAx.transition().duration(500).call(d3.axisBottom(xScale).ticks(5))
            yAx.transition().duration(500).call(d3.axisLeft(yScale))
                .selectAll('text')
                .attr('dx','12px')
                .attr('dy','-5px')
                .attr('transform', 'rotate(-60)' );
            shows.transition()
                .duration(500)
                .attr('cx', row=>xScale(row['Years']))
                .attr('cy', row=>yScale(row['Episodes']))
                .attr('r',3)
        }
    }
    highlight(y,r){
        const younger=d3.selectAll('.youngCircle')
        const older=d3.selectAll('.oldCircle')
            return function(){
                younger.transition()
                    .duration(500)
                    .attr('r',y)
                older.transition()
                    .duration(500)
                    .attr('r',r)
            }
    }

}

export class AreaAnimator{
    constructor({descriptions, descriptionD3Node, chartData, dimensions}) {
        this.descriptions = descriptions
        this.animationStack = []
        this.chartData=chartData
        this.dimensions=dimensions

        this.animationStack.push(this.animateAreaTitle)

        const zoomIn=this.shrinkXAxis(2000,2010)
        const zoomOut=this.shrinkXAxis(1987,2022)
        const focusTraditional=this.focus('Traditional')
        const focusNew=this.focusTwo('Flash','CGI')
        const focusRestore=this.restoreOpacity()
        const darkenColor=this.colorDark()
        const restoreColor=this.colorRestore()

        this.descriptions.forEach((description, index) => {
            const textAnimation = function (){
                
                descriptionD3Node
                    .append('p')
                    .style('opacity', '0')
                    .text(description)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .style('opacity', '1')
                if(index==0){
                    darkenColor()
                }
                if(index==2){
                    restoreColor()
                }
                if(index==3){
                    focusNew()
                }
                if(index==4){
                    focusTraditional()
                }
                if(index==5){
                    focusRestore()
                }
            }


            this.animationStack.push(textAnimation)
        })
    }


    animateAreaTitle(){
        d3.select('#area_title')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .style('opacity', '1')
    }

    shrinkXAxis(x1,x2){
        const xAx=d3.selectAll('.areaXAxis')
        const xScale = d3.scaleLinear()
            .domain([x1,x2])
            .range([0,this.dimensions.width])
        const yScale = d3.scaleLinear()
            .domain([0,550])
            .range([this.dimensions.height,0])
        return function(){
            xAx.transition().duration(500).call(d3.axisBottom(xScale).ticks(5))
            d3.selectAll('.myArea')
                .transition()
                .duration(500)
                .attr('d',d3.area()
                    .x(function(d) { return xScale(d.data.year); })
                    .y0(function(d) { return yScale(d[0]); })
                    .y1(function(d) { return yScale(d[1]); })
                )
        }

    }
    focus(key){
        const p=d3.selectAll(`.${key}`)
        return function(){
            d3.selectAll('.myArea')
                .transition()
                .duration(500)
                .attr('opacity',.3)
            p.transition()
                .duration(500)
                .attr('opacity',1)
        }
    }
    focusTwo(key1,key2){
        const p1=d3.selectAll(`.${key1}`)
        const p2=d3.selectAll(`.${key2}`)
        return function(){
            d3.selectAll('.myArea')
                .transition()
                .duration(500)
                .attr('opacity',.3)
            p1.transition()
                .duration(500)
                .attr('opacity',1)
            p2.transition()
                .duration(500)
                .attr('opacity',1)
        }
    }
    restoreOpacity(){
        return function(){
            d3.selectAll('.myArea')
            .transition()
                .duration(500)
                .attr('opacity',1)
        }
    }
    colorDark(){
        var allP=d3.selectAll('.myArea')
        return function(){
            allP
                .transition()
                .duration(500)
                .style('fill','black')
        }
    }
    colorRestore(){
        const color = d3.scaleOrdinal() //simple color assignation since small number of categories shown
            .domain(['CGI','Flash','Traditional','Other'])
            .range(d3.schemeSet2);
        var allP=d3.selectAll('.myArea')
        return function(){
            allP.transition()
            .duration(500)
            .style('fill',function(d){
                return color(d.key)})
        }
    }

}
