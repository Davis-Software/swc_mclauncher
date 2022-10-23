(() => {
    function getElementOffset(element){
        let de = document.documentElement
        let box = element.getBoundingClientRect()
        let top = box.top + window.scrollY - de.clientTop
        let left = box.left + window.scrollX - de.clientLeft
        return { top, left }
    }

    function createRipple(elem) {
        elem.classList.add("ripple")
        elem.addEventListener("mousedown", e => {
            if(elem.classList.contains(".disabled")) {
                return
            }

            let offs = getElementOffset(elem)
            let x = e.pageX - offs.left
            let y = e.pageY - offs.top
            let dia = Math.min(elem.offsetHeight, elem.offsetWidth, 100)
            let ripple = document.createElement("div")
            ripple.classList.add("ripple-inner")
            elem.append(ripple)

            let rippleWave = document.createElement("div")
            rippleWave.classList.add("ripple-wave")
            rippleWave.style.left = (x - dia/2).toString() + "px"
            rippleWave.style.top = (y - dia/2).toString() + "px"
            rippleWave.style.width = dia.toString() + "px"
            rippleWave.style.height = dia.toString() + "px"

            ripple.append(rippleWave)
            rippleWave.addEventListener("animationend", _ => {
                ripple.remove()
            })
        })
    }


    function attachCandle(elem, size=1){
        elem.classList.add("candle-attached")
        if(elem.querySelector(".candle-canvas")) return

        let canvas = document.createElement("div")
        let candle = document.createElement("div")
        canvas.classList.add("candle-canvas")
        candle.classList.add("candle")
        elem.append(canvas)
        canvas.append(candle)

        elem.addEventListener("mouseenter", e => {
            if(e.target !== elem) return
            candle.classList.remove("candle-anim-back")
            candle.classList.add("candle-anim")
        })
        elem.addEventListener("mouseleave", e => {
            if(e.target !== elem) return
            candle.classList.remove("candle-anim")
            candle.classList.add("candle-anim-back")
        })
        elem.addEventListener("mousemove", e => {
            let offset = getElementOffset(elem)
            let x = e.pageX - offset.left
            let y = e.pageY - offset.top
            let dia = Math.max(elem.offsetHeight, elem.offsetWidth) * 2 * size

            candle.style.width = dia + "px"
            candle.style.height = dia + "px"
            candle.style.left = x - (dia/2) + "px"
            candle.style.top = y - (dia/2) + "px"
        })
    }


    function hostCandleOnChildren(elem, size=1){
        elem.classList.add("candle-host")

        elem.childNodes.forEach(child => {
            if(child.nodeType === 1) {
                attachCandle(child, size)
            }
        })
    }


    function addListeners(list, callback, className){
        list = Array.from(list).map(selector => selector + `:not(.${className})`)
        if(list.join(", ") === "") return
        document.querySelectorAll(list.join(", ")).forEach(elem => {
            elem.classList.add(className)
            callback(elem)
        })
    }

    function addRipples(){
        addListeners([
            ".btn",
            ".dropdown-item",
            ".card-header",
            ".list-group-item"
        ], createRipple, "ripple")
    }
    function addCandles(){
        addListeners([
            ".attach-candle"
        ], attachCandle, "candle-attached")
    }
    function addCandleHosts(){
        addListeners([
            ".host-candle"
        ], hostCandleOnChildren, "candle-host")
    }

    addRipples()
    addCandles()
    addCandleHosts()
    setInterval(addRipples, 1000)
    setInterval(addCandles, 1000)
    setInterval(addCandleHosts, 1000)
    document.addEventListener("click", addListeners)
    document.addEventListener("click", addCandles)
    document.addEventListener("click", addCandleHosts)

    namespaces.createRipple = createRipple
    namespaces.attachCandle = attachCandle
    namespaces.hostCandleOnChildren = hostCandleOnChildren
})()
