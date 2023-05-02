
import {drawScatterChart} from "./visualiztion_modules/episodes_years_chart.js";
import {drawBubbleChart} from "./visualiztion_modules/bubble_viz/shows_by_country_chart.js";
import {
    getDescriptions,
    navToAndLockView,
    safeNavTo,
    toggleLoadingOverlay,
    toggleOverflow,
    toggleYOverflow
} from "./global_utilities.js";
import {VIZ_DESCRIPTIONS} from "../data/viz_descriptions.js";
import {drawPieChart} from "./visualiztion_modules/total_number_of_shows_by_animation.js";
import {lollipop} from "./visualiztion_modules/lollipop.js";
import {BubbleAnimator} from "./visualiztion_modules/bubble_viz/animations.js";
import { drawWorldMap } from "./visualiztion_modules/world_map.js";
import { drawAreaChart } from "./visualiztion_modules/area.js";
import {animateScatterTitle, ScatterAnimator, animateAreaTitle, AreaAnimator} from "./visualiztion_modules/scatter_area_animation.js";
import {animatePieTitle, PieAnimator, animateMapTitle, MapAnimator} from "./visualiztion_modules/pie_map_animation.js";
import {animateLollipopTitle, LollipopAnimator} from "./visualiztion_modules/lollipop_animation.js"


document.addEventListener("DOMContentLoaded",(event) => {
    Promise.all([d3.csv('../data/1948 - 1986.csv'),d3.csv('../data/1987 - 2022.csv')])
        .then((bulkData) => {
            const dataset1 = new dfd.DataFrame(bulkData[0])
            const dataset2 = new dfd.DataFrame(bulkData[1])
            const scatterManager = drawScatterChart(dataset1,dataset2)
            const bubbleManager = drawBubbleChart(dataset1, dataset2)
            drawPieChart(dataset1, dataset2)
            lollipop()
            drawWorldMap(dataset1, dataset2)
            const areaManager = drawAreaChart(dataset1, dataset2)

            // console.clear()

            function vizCallback(direction){
                const currentSectionNode = this.element
                // console.log(currentSectionNode)
                if(direction === 'down'){
                    const DESCRIPTION_D3_NODE =d3.select('#viz_description')


                    //Load descriptions
                    const descriptionCode = this.element.dataset.chartCode
                    const currentVizDescripts = getDescriptions(VIZ_DESCRIPTIONS, descriptionCode)

                    if(currentVizDescripts == null){
                      //  throw new Error('A chart description failed to load.')
                    }

                    DESCRIPTION_D3_NODE.html('')

                    //Additional chart effects
                    if(descriptionCode === 'BUBBLE_CHART'){
                        navToAndLockView(currentSectionNode).then(() => {
                            toggleYOverflow()
                            const animatorOptions = {
                                descriptions:currentVizDescripts,
                                descriptionD3Node: DESCRIPTION_D3_NODE,
                                chartData: bubbleManager.getChartData()
                            }
                            const animator = new BubbleAnimator(animatorOptions)
                            const animationHandler = () => {
                                try{
                                    const animation = animator.animationStack.shift()
                                    animation()

                                }catch (e){
                                    window.removeEventListener('wheel', animationHandler)
                                    toggleYOverflow()
                                    window.onscroll = null
                                }
                            }
                            window.addEventListener('wheel', animationHandler)
                        })

                    }
                    if(descriptionCode === 'SCATTER_CHART'){
                        //Chart specific effects
                        navToAndLockView(currentSectionNode).then(() => {
                            toggleYOverflow()
                            const animatorOptions = {
                                descriptions:currentVizDescripts,
                                descriptionD3Node: DESCRIPTION_D3_NODE,
                                chartData: scatterManager.getChartData(),
                                dimensions: scatterManager.dimensions
                            }
                            const animator = new ScatterAnimator(animatorOptions)
                            const animationHandler = () => {
                                try{
                                    const animation = animator.animationStack.shift()
                                    animation()
                                }catch (e){
                                    window.removeEventListener('wheel', animationHandler)
                                    toggleYOverflow()
                                    window.onscroll = null
                                }
                            }
                            window.addEventListener('wheel', animationHandler)
                        })
                    }
                    if(descriptionCode === 'PIE_CHART'){
                        navToAndLockView(currentSectionNode).then(() => {
                            toggleYOverflow()
                            const animatorOptions = {
                                descriptions:currentVizDescripts,
                                descriptionD3Node: DESCRIPTION_D3_NODE
                            }
                            const animator = new PieAnimator(animatorOptions)
                            const animationHandler = () => {
                                try{
                                    const animation = animator.animationStack.shift()
                                    animation()
                                }catch (e){
                                    window.removeEventListener('wheel', animationHandler)
                                    toggleYOverflow()
                                    window.onscroll = null
                                }
                            }
                            window.addEventListener('wheel', animationHandler)
                        })
                    }
                    if(descriptionCode === 'AREA_CHART'){
                        //Chart specific effects
                        // console.log(currentSectionNode)
                        navToAndLockView(currentSectionNode).then(() => {
                            toggleYOverflow()
                            const animatorOptions = {
                                descriptions:currentVizDescripts,
                                descriptionD3Node: DESCRIPTION_D3_NODE,
                                chartData: areaManager.getChartData(),
                                dimensions: areaManager.dimensions
                            }
                            const animator = new AreaAnimator(animatorOptions)
                            const animationHandler = () => {
                                try{
                                    const animation = animator.animationStack.shift()
                                    animation()

                                }catch (e){
                                    window.removeEventListener('wheel', animationHandler)
                                    toggleYOverflow()
                                    window.onscroll = null
                                }
                            }
                            window.addEventListener('wheel', animationHandler)
                        })
                    }
                    if(descriptionCode === 'LOLLIPOP_CHART'){
                        //Chart specific effects
                        navToAndLockView(currentSectionNode).then(() => {
                            toggleYOverflow()
                            const animatorOptions = {
                                descriptions:currentVizDescripts,
                                descriptionD3Node: DESCRIPTION_D3_NODE,
                            }
                            const animator = new LollipopAnimator(animatorOptions)
                            const animationHandler = () => {
                                try{
                                    const animation = animator.animationStack.shift()
                                    animation()
                                }catch (e){
                                    window.removeEventListener('wheel', animationHandler)
                                    toggleYOverflow()
                                    window.onscroll = null
                                }
                            }
                            window.addEventListener('wheel', animationHandler)
                        })
                    }
                    if(descriptionCode === 'INNOVATIVE_CHART'){
                        //Chart specific effects
                        navToAndLockView(currentSectionNode).then(() => {
                            toggleYOverflow()
                            const animatorOptions = {
                                descriptions:currentVizDescripts,
                                descriptionD3Node: DESCRIPTION_D3_NODE,
                            }
                            const animator = new MapAnimator(animatorOptions)
                            const animationHandler = () => {
                                try{
                                    const animation = animator.animationStack.shift()
                                    animation()

                                }catch (e){
                                    window.removeEventListener('wheel', animationHandler)
                                    toggleYOverflow()
                                    window.onscroll = null
                                }
                            }
                            window.addEventListener('wheel', animationHandler)
                        })
                    }

                }
            }
            const visualizations = document.querySelectorAll('.viz-section')
            visualizations.forEach(vizNode => {
                new Waypoint({
                    element: vizNode,
                    handler: vizCallback,
                    offset: '15%'
                })
            })

            toggleLoadingOverlay()

            new Waypoint({
                element: document.getElementById('bubble_section'),
                handler: bubbleManager.resetViz,
                offset: '-30%'
            })
            new Waypoint({
                element: document.getElementById('scatter_section'),
                handler: scatterManager.resetViz,
                offset: '-30%'
            })
            new Waypoint({
                element: document.getElementById('area_section'),
                handler: areaManager.resetViz,
                offset: '-30%'
            })


        })

})


