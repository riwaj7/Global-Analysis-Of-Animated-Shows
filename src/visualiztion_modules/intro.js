export const animateIntro = () => {
    const animeHistory = document.querySelector('#anime_history')
    const giphyWrapper = document.getElementById('giphy_wrapper')


    let giphyObserver = new IntersectionObserver(inViewToggle, {threshold:0.25})
    giphyObserver.observe(animeHistory)

    let wScrollY = 0
    let inView = false
    let triggeredWscrollY = 0
    let targetRect = animeHistory.getBoundingClientRect()

    window.addEventListener('scroll', () => {
        wScrollY = window.scrollY
        if(inView){
            if(wScrollY > triggeredWscrollY && wScrollY < (targetRect.height - triggeredWscrollY - 200)){
                giphyWrapper.style.top = `${((wScrollY - triggeredWscrollY)+38) * 0.85}px`
            }
        }
    })


    const giphysNodeList = document.querySelectorAll('.giphy-width')
    const giphyDescriptionNodeList = document.querySelectorAll('.giphy-description')
    const giphyDescriptions = ['40%', '30%', '30%']
    let percentIndex = 0
    const giphysList = []
    giphysNodeList.forEach(node=>giphysList.push(node))

    giphyDescriptionNodeList.forEach(node=>{
        new Waypoint({
            element: node,
            offset: giphyDescriptions[percentIndex],
            handler: displayNextGif
        })
        ++percentIndex
    })




    function displayNextGif(direction){
        if(direction === 'down' && giphysList.length > 0){
            const giphy = giphysList.pop()
            // console.log(giphy)
            giphy.style.display = 'none'
            giphysList[giphysList.length - 1].classList.remove('d-none')

        }
    }

    function inViewToggle(entries){
        entries.forEach((entry)=>{
            if(entry.isIntersecting){
                // console.log('Giphy in view')
                inView = true
                triggeredWscrollY = wScrollY
            }
            else{
                // console.log('Giphy not in view')
                giphyWrapper.style.top = `${38}px`
                inView = false
            }
        })
    }


}


