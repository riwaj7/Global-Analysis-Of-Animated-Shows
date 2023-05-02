export const toggleLoadingOverlay = () => {
    const overlay = document.getElementById('loading_screen')
    const currentClassList = overlay.classList

    if(currentClassList.length > 0){
        overlay.setAttribute('class', '')
    }
    else{
        overlay.setAttribute('class', 'd-flex justify-content-center align-items-center')
    }
    document.body.style.overflow = 'auto'
}

export const sleep = (miliSecs) => {
    return new Promise(resolve => setTimeout(resolve, miliSecs))
}

export const getCanonicalName = (country) => {
    const aliasMap = {
        'United States': ['US', 'USA', 'United States (revival)[1]'],
        'Soviet Union': ['USSR'],
        'United Kingdom': ['UK', 'Britain', 'Britain (Seasons 1–2)'],
        'Australia': ['AUS'],
        'Chile': ['Spanish (Chile)'],
        'South Korea': ['South Korea (season 4)'],
        'Canada': 'Canada (Series 1)',
        'New Zealand': 'English (New Zealand)',
        'Spain': 'Spain Mexico'
    }
    for(const [connName, aliases] of Object.entries(aliasMap)){
        if(aliases.includes(country)){
            // console.log(country)
            // console.log(connName)
            return connName
        }
    }
    return country
}


/**
 * Chrome solution for scrollIntoView
 * @param targetElement
 */
export const navTo = (targetElement) => {
    const target = document.getElementById(targetElement)
    const targetDimensions = target.getBoundingClientRect()
    const targetY = targetDimensions.top + window.scrollY
    target.style.scrollBehavior = 'smooth'
    console.log('navigating to', targetY)
    window.scrollTo(0,targetY)
}

export const safeNavTo = (sectionNodeRef) => {
    sectionNodeRef.scrollIntoView()
    return sleep(500)
}

export const navToAndLockView = (sectionNodeRef) => {
    sectionNodeRef.scrollIntoView()
    const sectionId=sectionNodeRef.id
    window.location.href=`#${sectionId}`
    window.onscroll = ()=>{window.location.href = `#${sectionId}`}
    return sleep(500)
}

export const toggleOverflow = () => {
    const bodyNode = document.querySelector('body')
    bodyNode.style.overflow = bodyNode.style.overflow === 'hidden' ? 'auto' : 'hidden'
}

export const toggleYOverflow = () => {
    const bodyNode = document.querySelector('body')
    bodyNode.style.overflowY = bodyNode.style.overflowY === 'hidden' ? 'auto' : 'hidden'
}

export const getDescriptions = (descriptions, chartCode) => {
    const vizDescription = descriptions.filter(description => {
        return description.code === chartCode
    })
    if(vizDescription.length < 1){
        return null
    }
    return vizDescription[0]['descriptions']
}
