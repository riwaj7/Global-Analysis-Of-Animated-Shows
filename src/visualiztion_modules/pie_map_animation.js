export const animatePieTitle = () => {
    d3.select('#pie_title')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style('opacity', '1')
}

export const animateMapTitle = () => {
    d3.select('#map_title')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style('opacity', '1')
}

export class PieAnimator{
    constructor({descriptions, descriptionD3Node}) {
        this.descriptions = descriptions
        this.animationStack = []

        this.animationStack.push(this.animatePieTitle)

        this.descriptions.forEach((description, index) => {
            
            const textAnimation = function (){
                
                descriptionD3Node
                    .append('p')
                    .style('opacity', '0')
                    .text(description)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .style('opacity', '1')
            }
            this.animationStack.push(textAnimation)
        })

    }

    animatePieTitle(){
        d3.select('#pie_title')
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .style('opacity', '1')
    }

}

export class MapAnimator{
    constructor({descriptions, descriptionD3Node}) {
        this.descriptions = descriptions
        this.animationStack = []

        this.animationStack.push(this.animateMapTitle)

        this.descriptions.forEach((description, index) => {
            
            const textAnimation = function (){
                
                descriptionD3Node
                    .append('p')
                    .style('opacity', '0')
                    .text(description)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .style('opacity', '1')
            }
            this.animationStack.push(textAnimation)
        })

    }

    animateMapTitle(){
        d3.select('#map_title')
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .style('opacity', '1')
    }

}