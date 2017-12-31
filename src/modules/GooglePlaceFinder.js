export default class GooglePlaceFinder {

    constructor(map) {
        this.map = new google.maps.Map(map, {
            center: new google.maps.LatLng(40, -80.5),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 8
        })

        this.service = new google.maps.places.PlacesService(this.map)
        this.routeBoxer = new RouteBoxer()
        this.boxpolys = null
        this.directionService = new google.maps.DirectionsService()
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map
        })

        this.infowindow = new google.maps.InfoWindow()

        this.boxes = null

        this.gmarkers = []
    }

    clearBoxes() {
        if (this.boxpolys !== null) {
            for (let i = 0; i < this.boxpolys.length; i++) {
                this.boxpolys[i].setMap(null)
            }
        }
        this.boxpolys = null
    }

    drawBoxes(boxes) {
        this.boxpolys = new Array(boxes.length)
        for (let i = 0; i < boxes.length; i++) {
            this.boxpolys[i] = new google.maps.Rectangle({
                bounds: boxes[i],
                fillOpacity: 0,
                strokeOpacity: 1.0,
                strokeColor: '#000000',
                strokeWeight: 1,
                map: this.map
            })
        }
    }

    findPlaceWithInBoxes(boxes, searchIndex) {


        const request = {
            bounds: boxes[searchIndex],
            types: ["gas_station"]
        }

        debugger


        this.service.radarSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                document.getElementById('side_bar').innerHTML += "bounds[" + searchIndex + "] returns " + results.length + " results<br>"
                for (let i = 0, result; result = results[i]; i++) {
                    let marker = this.createMarker(result)
                }
            } else {
                document.getElementById('side_bar').innerHTML += "bounds[" + searchIndex + "] returns 0 results<br>&nbspstatus=" + status + "<br>"
            }
            if (status !== google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
                searchIndex++
                if (searchIndex < boxes.length)
                    this.findPlaceWithInBoxes(boxes, searchIndex)
            } else { // delay 1 second and try again
                setTimeout("findPlaceWithInBoxes(" + searchIndex + ")", 1000)
            }

        })
    }

    createMarker(place) {

        const placeLoc = place.geometry.location
        let image
        if (place.icon) {
            image = new google.maps.MarkerImage(
                place.icon, new google.maps.Size(71, 71),
                new google.maps.Point(0, 0), new google.maps.Point(17, 34),
                new google.maps.Size(25, 25))
        } else image = {
            url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
            size: new google.maps.Size(7, 7),
            anchor: new google.maps.Point(3.5, 3.5)
        }

        const marker = new google.maps.Marker({
            map: this.map,
            icon: image,
            position: place.geometry.location
        })

        google.maps.event.addListener(marker, 'click', () =>
            this.service.getDetails({reference: place.reference}, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    let contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address
                    if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number
                    if (!!place.website) contentStr += '<br><a target="_blank" href="' + place.website + '">' + place.website + '</a>'
                    contentStr += '<br>' + place.types + '</p>'
                    this.infowindow.setContent(contentStr)
                    this.infowindow.open(this.map, marker)
                } else {
                    const contentStr = "<h5>No Result, status=" + status + "</h5>"
                    this.infowindow.setContent(contentStr)
                    this.infowindow.open(this.map, marker)
                }
            }))
        this.gmarkers.push(marker)
        if (!place.name) place.name = "result " + this.gmarkers.length
        const side_bar_html = "<a href='javascript:google.maps.event.trigger(this.gmarkers[" + parseInt(this.gmarkers.length - 1) + "],\"click\")'>" + place.name + "</a><br>"
        document.getElementById('side_bar').innerHTML += side_bar_html
    }

    setDriveDirection(request) {

        request = {
            ...request,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }
        return new Promise((resolve, reject) => {
            this.directionService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {

                    this.directionsRenderer.setDirections(result)

                    resolve(result, status)
                } else {
                    reject(status)
                    console.error("Directions query failed: " + status)
                }
            })
        })
    }

    async setDirection(request) {

        const direction = await this.setDriveDirection(request)
        // Box around the overview path of the first route


        const boxes = this.generateBoxes(direction, 3)


        debugger
        this.drawBoxes(boxes)
        this.findPlaceWithInBoxes(boxes, 0)

    }

    generateBoxes(direction, distance) {
        const path = direction.routes[0].overview_path
        return this.routeBoxer.box(path, distance)
    }
}