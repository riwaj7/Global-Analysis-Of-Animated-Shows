import {getCanonicalName} from "../../global_utilities.js";
import {Chart} from "../../chart.js";

export const drawBubbleChart = (dataset1, dataset2) => {
    const showsByCountry1 = dataset1.loc({rows: [":"], columns:['Title', 'Country']})
    const showsByCountry2 = dataset2.loc({rows: [":"], columns:['Title', 'Country']})
    const chartWrapper = d3.select('#bubble_chart_wrapper')
    const set1Json = dfd.toJSON(showsByCountry1)
    const expSet1 = expandMultiCountryRows(set1Json)
    const set2Json = dfd.toJSON(showsByCountry2)
    const expSet2 = expandMultiCountryRows(set2Json)
    const theHolySet = expSet1.concat(expSet2)

    const bubbleTipD3 = d3.select('#bubble_tooltip')

    const countryLabel = bubbleTipD3.append('div')
        .attr('class', 'ps-2 text-center')
    const showCountLabel = bubbleTipD3.append('div').attr('class', 'ps-2')

    const holyDF = new dfd.DataFrame(theHolySet)
    const groupedCountries2 = holyDF.groupby(['Country'])
    const showCountsByCountry2 = groupedCountries2.col(['Title']).count()
    const holyData = dfd.toJSON(showCountsByCountry2)
    let topFiveCountries = showCountsByCountry2
        .sortValues('Title_count', {ascending:false, inplace:false})
        .head(5)

    topFiveCountries = dfd.toJSON(topFiveCountries)
    console.log(topFiveCountries)

    const chartWidth = parseInt(chartWrapper.style('width').replace('px', ''))
    const chartHeight = parseInt(chartWrapper.style('height').replace('px', ''))
    const chartManager = new Chart('bubble_chart', chartWidth, chartHeight)
    chartManager.setChartData(topFiveCountries)
    // chartManager.setMargin('bottom', 0.1)

    const graphLayout = d3.pack()
        .size([
            chartManager.dimensions.width,
            (chartManager.dimensions.height - chartManager.dimensions.margins.top)
        ])
        .padding(5)

    const hierarchicalNodes = d3.hierarchy({children:holyData})
        .sum(row => row['Title_count'])

    const root = graphLayout(hierarchicalNodes)

    chartManager.CHART.selectAll('.countryBubbles')
        .data(root.leaves())
        .join('g')
        .attr('transform', leafNode=>`translate(${leafNode.x}, ${leafNode.y})`)
        .append('circle')
        .attr('r', leafNode=> leafNode.r)
        .attr('fill', '#af7aa1')
        .attr('data-country', leafNode => leafNode.data.Country)
        .attr('data-show-count', leafNode => leafNode.data.Title_count)
        .attr('class', 'countryBubbles')
        .on('mouseover', bubbleHover)
        .on('mousemove', hoverMove)
        .on('mouseout', hoverOut)


    function bubbleHover(event){
        const countryBubble = event.target
        countryBubble.classList.add('bubbleHighlight')
        countryLabel.text(countryBubble.getAttribute('data-country'))
        showCountLabel.text(`${countryBubble.getAttribute('data-show-count')} shows`)
        bubbleTipD3.style('top', `${event.clientY + window.scrollY}px`)
        bubbleTipD3.style('left', `${event.clientX}px`)
        bubbleTipD3.style('display', 'block')

    }
    function hoverOut(event){
        const countryBubble = event.target
        countryBubble.classList.remove('bubbleHighlight')
        bubbleTipD3.style('display', 'none')
    }

    function hoverMove(event){
        bubbleTipD3.style('top', `${event.clientY + window.scrollY - 30}px`)
        bubbleTipD3.style('left', `${event.clientX + 20}px`)
    }

    return chartManager
}

function expandMultiCountryRows(dataset){
    const newSet = []
    for(const row of dataset){
        if(row['Country'].includes(',')){
            let countryList = row['Country'].split(',')
            countryList = countryList.map(country => country.trim())
            countryList.forEach(country=> {
                let countryName = getCanonicalName(country)
                newSet.push({Title: row['Title'], Country: countryName})
            })
        }
        else {
            newSet.push({Title: row['Title'], Country: getCanonicalName(row['Country'])})
        }
    }
    return newSet
}


