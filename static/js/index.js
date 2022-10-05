(function (){
    {
        let minimizeBtn = document.querySelector(".frame-btn[data-action=min]")
        let tSizeBtn = document.querySelector(".frame-btn[data-action=t-size]")
        let closeBtn = document.querySelector(".frame-btn[data-action=close]")

        for(let btn of [minimizeBtn, tSizeBtn, closeBtn]){
            namespaces.createRipple?.(btn)
        }
        function toggleIcons(){
            window.controls.isMaximized().then((val) => {
                if(val){
                    tSizeBtn.querySelector("img[data-style=max]").hidden = true
                    tSizeBtn.querySelector("img[data-style=restore]").hidden = false
                }else{
                    tSizeBtn.querySelector("img[data-style=max]").hidden = false
                    tSizeBtn.querySelector("img[data-style=restore]").hidden = true
                }
            })
        }

        minimizeBtn.addEventListener("click", _ => {
            window.controls.minimize()
        })
        tSizeBtn.addEventListener("click", _ => {
            window.controls.toggleSize()
        })
        closeBtn.addEventListener("click", _ => {
            window.controls.close()
        })

        window.controls.onResize(toggleIcons)
        toggleIcons()
    }

    // General init
    window.addEventListener("load", () => {

    })
})()
