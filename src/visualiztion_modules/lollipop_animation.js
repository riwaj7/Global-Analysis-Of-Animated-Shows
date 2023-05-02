export const animateLollipopTitle = () => {
    d3.select('#lollipop_title')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style('opacity', '1')
}

export class LollipopAnimator{
    constructor({descriptions, descriptionD3Node}) {
        this.descriptions = descriptions
        this.animationStack = []

        this.animationStack.push(this.animateLollipopTitle)

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

    animateLollipopTitle(){
        d3.select('#lollipop_title')
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .style('opacity', '1')
    }

}