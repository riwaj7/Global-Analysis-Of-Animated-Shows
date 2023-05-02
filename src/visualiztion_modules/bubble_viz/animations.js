export class BubbleAnimator{
    constructor({descriptions, descriptionD3Node, chartData}) {
        this.descriptions = descriptions
        this.animationStack = []
        this.chartData = chartData.map((row) => row['Country'])
        this.topFiveColors = d3.scaleOrdinal()
            .domain(this.chartData)
            .range(d3.schemeTableau10)
        const highlightAnimation = this.animateHighlights()

        this.animationStack.push(this.animateTitle)

        this.descriptions.forEach((description, index) => {
            let textAnimation
            if(index === this.descriptions.length - 1){
                const countries = this.chartData
                const topFiveColors = this.topFiveColors
                textAnimation = function (){

                    const topFiveText = descriptionD3Node
                        .append('p')
                        .style('opacity', '0')
                        .text(description)

                    for(const [strIndex, country] of Object.entries(countries)){
                        const countrySpan = topFiveText.append('span')
                            .style('color', topFiveColors(country))
                            .classed('fw-bold', true)
                        let countryText = `${country}, `
                        if(parseInt(strIndex) === countries.length - 1){
                            countryText = `${country}.`
                        }
                        if(['United States', 'United Kingdom'].includes(country)){
                            countryText = 'The ' + countryText
                        }
                        countrySpan.text(countryText)
                    }

                        topFiveText.transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .style('opacity', '1')
                    highlightAnimation()
                }
            }
            else{
                textAnimation = function (){
                    descriptionD3Node
                        .append('p')
                        .style('opacity', '0')
                        .text(description)
                        .transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .style('opacity', '1')
                }
            }

            this.animationStack.push(textAnimation)
        })
        // this.animationStack.push(this.animateHighlights())
    }

    animateTitle(){
        d3.select('#bubble_title')
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .style('opacity', '1')
    }

    animateHighlights(){
        const topFiveCountries = this.chartData
        const topFiveColors = this.topFiveColors
        return function (){
            const countries = d3.selectAll('[data-country]')
            countries.filter(function (datum, i) {
                if(topFiveCountries.includes(datum.data.Country)){
                    return datum
                }
            })
                .transition()
                .delay(1000)
                .attr('fill', (datum) => {
                    return topFiveColors(datum.data.Country)
                })
        }
    }

}
