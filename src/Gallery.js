class Gallery {

    constructor(options) {
        this.appPath = options.appPath
        this.auth = options.auth
        this.perPage = options.perPage ?? 12
        this.photoOptions = options.photo
        this.gap = options.gap ?? '40px'
        this.debug = options.debug ?? false
        this.loading = options.loading ?? '<lottie-player src="' + appPath + 'img/loading.json" background="transparent" speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>'
        this.searchPlaceholder = options.searchPlaceholder ?? false
        this.showMoreText = options.showMoreText ?? 'Show more'
        this.showMoreCount = options.showMoreCount ?? false

        this.galleryContainer = document.querySelector('.gallery')
        this.photosGrid
        this.searchInput
        this.searchBtn
        this.galleryTitle
        this.showMoreContainer
        this.showMoreBtn
        
        this.data = {}
        this.querySearch = ''
        this.queryPerPage = this.perPage
        this.queryPage = 1
        this.apiRequests = 0

        this.init()
    }

    init() {
        this.searchFormSetup()
        this.photosGridSetup()
        this.showMoreBtnSetup()

        // events
        window.addEventListener( 'DOMContentLoaded', () => {
            this.initPhotosGrid()
            this.setGalleryTitle(this.loading)
            this.buildGallery(this.queryPage, 'curated')
        })
        this.searchBtn.addEventListener( 'click', (e) => {
            let querySearch = this.getQuerySearch(e)
            // rebuild photosGrid only if querySearch is different from previous one
            if (querySearch !== this.querySearch) {
                this.initPhotosGrid()
                this.setGalleryTitle(this.loading)
                this.hideShowMoreBtn()
                this.queryPage = 1
                this.buildGallery(this.queryPage, 'or', querySearch)
                this.querySearch = querySearch
            }
        })
        this.showMoreBtn.addEventListener( 'click', () => {
            this.showMoreBtnLoading()
            let nextPage = this.queryPage + 1
            this.buildGallery(nextPage, 'or', this.querySearch)
            this.queryPage = nextPage
        })
    }

    // HTML SETUP (GALLERY PARTS)

    searchFormSetup() {
        let searchForm = document.createElement('form')
        searchForm.classList.add('search-container');
        searchForm.innerHTML = '<input type="text" class="search-input">'
        searchForm.innerHTML += '<button class="btn-secondary search-btn"><i class="fas fa-search fa-lg"></i></button>'
        this.galleryContainer.appendChild(searchForm)
        this.searchInput = document.querySelector('.search-input')
        this.searchBtn = document.querySelector('.search-btn')
        if(this.searchPlaceholder) {
            this.searchInput.setAttribute('placeholder', 'dog, people, mountains,...')
        }
    }

    photosGridSetup() {
        // title
        this.galleryTitle = document.createElement('h2')
        this.galleryTitle.classList.add('gallery-title')
        this.galleryContainer.appendChild(this.galleryTitle)
        // grid
        this.photosGrid = document.createElement('div')
        this.photosGrid.classList.add('photos-grid')
        this.galleryContainer.appendChild(this.photosGrid)
    }

    showMoreBtnSetup() {
        this.showMoreContainer = document.createElement('div')
        this.showMoreContainer.classList.add('show-more-container')
        this.showMoreContainer.style.display = 'none'
        this.showMoreContainer.innerHTML = '<button class="btn-primary show-more-btn"></button>'
        this.galleryContainer.appendChild(this.showMoreContainer)
        this.showMoreBtn = this.showMoreContainer.querySelector('button')
        this.showMoreBtn.innerText = this.showMoreText
    }

    // DATA & QUERIES

    async buildGallery(queryPage, queryType = 'curated', querySearch = '') {
        let query
        let data
        let galleryTitle
        switch (queryType) {
            case 'curated':
                query = `https://api.pexels.com/v1/curated?page=${queryPage}&per_page=${this.queryPerPage}`
                data = await this.getData(query)
                galleryTitle = "Curated photos"
                break
            case 'search':
                query = `https://api.pexels.com/v1/search?query=${querySearch}&page=${queryPage}&per_page=${this.queryPerPage}`
                data = await this.getData(query)
                galleryTitle = querySearch
                break
            case 'or':
                if(querySearch.length === 0) {
                    this.buildGallery(queryPage, 'curated')
                } else {
                    this.buildGallery(queryPage, 'search', querySearch)
                }
                break
            default: 
                console.error('Wrong property "queryType" in Gallery.rebuildGrid(). Autorized values are only: "curated", "search" and "or"')
        }
        // show result
        if (data !== undefined) {
            this.dataToGallery(data, galleryTitle)
        }
    }

    async getData(query) {
        try {
            let response = await fetch(query,  {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.auth
                }
            }) 
            // Check that not too many requests are done to API
            if(this.debug) {
                this.apiRequests += 1
                console.log('API requests done so far: ' + this.apiRequests)
            }
            // return
            return await response.json()
        } catch (error) {
            if(this.debug) {
                console.error(error)
            } else {
                this.hideGalleryTitle()
                this.galleryMessage(error)
            }
        }
    }

    dataToGallery(data, galleryTitle) {
        if (data.photos.length > 0) {
            this.addPhotosToGrid(data.photos)
            this.displayShowMoreBtn(data)
            this.setGalleryTitle(galleryTitle)
            this.data = data
        } else {
            this.hideShowMoreBtn()
            this.setGalleryTitle('No images found')
        }
    }

    getQuerySearch(e) {
        e.preventDefault()
        let querySearch = this.searchInput.value
        this.searchInput.value = ''
        return querySearch
    }

    // GRID

    initPhotosGrid() {
        let grid = this.photosGrid
        this.photosGrid.innerHTML = ''
        grid.style.display = "flex"
        grid.style.gap = this.gap
    }

    addPhotosToGrid(photos) {
        // verify that the photosGrid is displayed on grid mode
        if(this.photosGrid.style.display !== 'flex') {
            this.photosGrid.style.display = 'flex'
        }
        // add photos
        photos.forEach(photo => {
            let photoDiv = 
                (new Photo(photo, this.photoOptions))
                .show()
            this.photosGrid.appendChild(photoDiv)
        });
    }
    // SHOW MORE

    displayShowMoreBtn(data) {
        // count
        let displayedPhotos = this.queryPage * this.perPage
        let remainingPhotos = data.total_results - displayedPhotos
        // style & text
        if(remainingPhotos > 0) {
            this.showMoreContainer.style.display = 'block'
            this.showMoreBtn.style.pointerEvents = 'all'
            let btnInnerHtml = this.showMoreText
            if(this.showMoreCount) {
                btnInnerHtml += ' (' + remainingPhotos + ' left)'
            }
            this.showMoreBtn.innerHTML =  btnInnerHtml
        } else {
            this.showMoreContainer.style.display = 'none'
        }
    }

    showMoreBtnLoading() {
        this.showMoreBtn.style.pointerEvents = 'none'
        this.showMoreBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading'
    }

    hideShowMoreBtn() {
        this.showMoreContainer.style.display = 'none'
    }

    // MISC.

    setGalleryTitle(html) {
        this.galleryTitle.innerHTML = html
    }

    hideGalleryTitle() {
        this.galleryTitle.innerHTML = ''
    }

    galleryMessage(html) {
        if(this.photosGrid === undefined) {
            this.initPhotosGrid()
        }
        this.photosGrid.style.display = 'block'
        this.photosGrid.innerHTML = html
    }

}