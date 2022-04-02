class Photo {

    constructor(photo, options) {
        this.photo = photo
        this.overlay
        this.overlayContent
        // options
        this.minWidth = options.minWidth ?? '400px'
        this.width = options.width ?? undefined
        this.height = options.height ?? '400px'
        this.overlayStyle = options.overlayStyle ?? 1
        this.overlayColor = options.overlayColor ?? 'white'
        this.overlayOpacity = options.overlayOpacity ?? 0.8
        this.animation = options.animation ?? undefined
        this.animationDuration = options.animationDuration ?? 0.3
        // divs
        this.photoContainer
        this.overlay
    }

    show() {
        this.photoContainer = document.createElement('div')
        this.setPhotoStyle(this.photoContainer)
        // img
        let photo = document.createElement('img')
        photo.setAttribute('src', this.photo.src.large)
        this.overlay = document.createElement('div')
        this.overlay.innerHTML = `
            <div class="gallery-photo__photographer">${this.photo.photographer}</div>
            <div class="gallery-photo__download"><a href="${this.photo.src.original}" target="_blank">Download</a></div>`
        this.setOverlayStyle(this.overlay)
        this.photoContainer.appendChild(photo)
        this.photoContainer.appendChild(this.overlay)
        // return 
        return this.photoContainer
    }

    setPhotoStyle(element) {
        element.classList.add('gallery-photo')
        if(this.width === undefined) {
            element.style.minWidth = this.minWidth
            element.style.flex = '1'
        } else {
            element.style.width = this.width
        }
        element.style.height = this.height
    }

    setOverlayStyle() {
        // class
        this.overlay.classList.add('gallery-photo__overlay')
        // overlayColor option
        this.overlayContent = this.overlay.querySelectorAll('div')
        switch(this.overlayColor) {
            case 'black':
                this.overlay.style.backgroundColor = 'black'
                this.overlayContent.forEach(div => div.style.color = 'white')
                this.photoContainer.style.setProperty('--a-pseudo-color-selector', 'white')
                break
            case 'white':
                this.overlay.style.backgroundColor = 'white'
                this.overlayContent.forEach(div => div.style.color = 'black')
                this.photoContainer.style.setProperty('--a-pseudo-color-selector', 'black')
                break
            case 'average':
                this.overlay.style.backgroundColor = this.photo.avg_color
                if(chroma(this.photo.avg_color).luminance() > 0.5) {
                    this.overlayContent.forEach(div => div.style.color = 'black')
                    this.photoContainer.style.setProperty('--a-pseudo-color-selector', 'black')
                } else {
                    this.overlayContent.forEach(div => div.style.color = 'white')
                    this.photoContainer.style.setProperty('--a-pseudo-color-selector', 'white')
                }
                break
            default:
                this.overlayColor = "black"
                this.setOverlayStyle()
                this.optionErrorLog(
                    "overlayColor",
                    ["black", "white", "average"],
                    "string",
                    "black"
                )
        }
        // overlayStyle option
        const overlayStyle = parseFloat(this.overlayStyle)
        switch(overlayStyle) {
            case 1:
                this.overlay.style.top = '0'
                this.overlay.style.height = '60px'
                break
            case 2:
                this.overlay.style.bottom = '0'
                this.overlay.style.height = '60px'
                break
            case 3:
                this.overlay.style.top = '0'
                this.overlay.style.flexDirection = 'column'
                this.overlay.style.height = '100%'
                this.overlay.style.justifyContent = 'center'
                this.overlay.style.gap = '50px'
                this.overlay
                break
            default: 
                this.overlayStyle = 1
                this.setOverlayStyle()
                this.optionErrorLog(
                    "overlayStyle",
                    [1, 2, 3],
                    "number",
                    "1"
                )
        }
        // overlayOpacity option
        this.overlay.style.opacity = this.overlayOpacity
        // animation
        if(this.animation !== undefined) {
            this.animateHeader()
        }
    }

    animateHeader() {
        let set = {}
        let mouseEnterFrom = {}
        let mouseEnterTo = {}
        let mouseLeaveTo = {}
        // check options
        let animationDuration = parseFloat(this.animationDuration)
        if(animationDuration > 100) animationDuration /= 1000
        if(this.overlayStyle < 3 && this.animation === 'circleSmall') this.animation = 'circle'
        if(this.overlayStyle == 1 && this.animation === 'slideUp') this.animation = 'slideDown'
        if(this.overlayStyle == 2 && this.animation === 'slideDown') this.animation = 'slideUp'
        // set animations
        switch(this.animation) {
            case 'none': 
                break
            case 'fade':
                set = {opacity: 0}
                mouseEnterTo = {opacity: this.overlayOpacity}
                mouseLeaveTo = {opacity: 0}
                break
            case 'slideDown':
                set = {y: '-100%'}
                mouseEnterTo = {y: '0%'}
                mouseLeaveTo = {y: '-100%'}
                break
            case 'slideUp':
                set = {y: '100%'}
                mouseEnterTo = {y: '0%'}
                mouseLeaveTo = {y: '100%'}
                break
            case 'slideRight':
                set = {x: '-100%'}
                mouseEnterFrom = {x: '-100%'}
                mouseEnterTo = {x: '0%'}
                mouseLeaveTo = {x: '100%'}
                break
            case 'slideLeft':
                set = {x: '100%'}
                mouseEnterFrom = {x: '100%'}
                mouseEnterTo = {x: '0%'}
                mouseLeaveTo = {x: '-100%'}
                break
            case 'circle':
                set = {clipPath: 'circle(0% at 50%)'}
                mouseEnterTo = {clipPath: 'circle(100% at 50%)'}
                mouseLeaveTo = {clipPath: 'circle(0% at 50%)'}
                break
            case 'circleSmall':
                set = {opacity: 0, clipPath: 'circle(0% at 50%)'}
                mouseEnterTo = {opacity: this.overlayOpacity, clipPath: 'circle(25% at 50%)'}
                mouseLeaveTo = {opacity: 0, clipPath: 'circle(0% at 50%)'}
                this.overlayContent.forEach(div => div.style.maxWidth = '40%')
                break
            default:
                this.animation = 'none'
                this.animateHeader()
                this.optionErrorLog(
                    "animation", 
                    ["fade", "slideDown", "slideUp", "slideRight", "slideLeft", "none"],
                    "string",
                    "none"
                )
        }
        // animate
        gsap.set(this.overlay, set)
        this.photoContainer.addEventListener('mouseenter', () => {
            gsap.fromTo(this.overlay, animationDuration, mouseEnterFrom, mouseEnterTo)
        })
        this.photoContainer.addEventListener('mouseleave', () => {
            gsap.to(this.overlay, animationDuration, mouseLeaveTo)
        })
    }

    optionErrorLog(optionName, autorizedValues = [], autorizedValuesType, defaultValueApplied) {
        let quote = ''
        if(autorizedValuesType === 'string') {
            quote = '"'
            defaultValueApplied = `"${defaultValueApplied}"`
        }
        autorizedValues = autorizedValues.map((value, index) => { 
            if(index < autorizedValues.length - 2) {
                value = quote + value + quote + ', '
            } else if (index < autorizedValues.length - 1) {
                value = quote + value + quote + ' and '
            } else {
                value = quote + value + quote
            }
            return value
        })
        autorizedValues = autorizedValues.join('')
        console.error(`Wrong "${optionName}" property passed in new Gallery options. Autorized values are only: ${autorizedValues} (value type: ${autorizedValuesType}). ${defaultValueApplied} has been applied by default.`)
    }

}