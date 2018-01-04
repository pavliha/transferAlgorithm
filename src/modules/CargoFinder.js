import StartMarker from "./Marker/StartMarker"
import StopMarker from "./Marker/StopMarker"
import BoxDrawer from "./Boxer/BoxDrawer"

import {
    DirectionsRenderer, DirectionsService, DirectionsStatus, DirectionsTravelMode, InfoWindow, LatLng, MapTypeId,
    places
} from '../api/googleMaps'

export default class CargoFinder {

    constructor(map, routes) {


        this.routes = routes
        this.map = new google.maps.Map(map, {
            mapTypeId: 'roadmap',
            zoom: 9
        })

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(({coords}) => {
                this.map.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
            });
        }

        this.directionService = new google.maps.DirectionsService()
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map
        })
        this.originMarkers = []
        this.destinationMarkers = []
        this.boxDrawer = new BoxDrawer(this.map)

        this.waypoints = []
    }


    deleteMarkers() {
        for (const originMarker of this.originMarkers)
            originMarker.destroy()

        for (const destinationMarker of this.destinationMarkers)
            destinationMarker.destroy()
    }


    searchSimilarRoutesRecursive(boxes, i) {
        for (const route of this.routes)
            if (boxes[i].contains(route.origin) && boxes[i].contains(route.destination)) {
                this.originMarkers.push(new StartMarker(this.map, route.origin))
                this.destinationMarkers.push(new StopMarker(this.map, route.destination))
            }

        i++

        if (i < boxes.length) this.searchSimilarRoutesRecursive(boxes, i)

    }


    setDriveDirection(request) {

        request = {
            ...request,
            waypoints: this.waypoints,
            optimizeWaypoints: true,
            travelMode: "DRIVING"
        }
        console.log(request)
        return new Promise((resolve, reject) => {
            this.directionService.route(request, (result, status) => {
                if (status === "OK") {

                    this.directionsRenderer.setDirections(result)

                    resolve(result, status)
                } else {
                    reject(status)
                    console.error("Directions query failed: " + status)
                }
            })
        })
    }

    async find(request) {
        console.log("new route")
        this.boxDrawer.clear()

        this.deleteMarkers()

        const distance = request.distance

        delete request.distance

        const direction = await this.setDriveDirection(request)

        const boxes = this.boxDrawer.draw(direction, distance)

        for (const route of this.routes) {
            if (this.isPointInBoxes(route.origin, boxes) && this.isPointInBoxes(route.destination, boxes)) {

                const startMarker = new StartMarker(this.map, route.origin)
                startMarker.onClick((e) => {
                    this.waypoints.push({
                        location: route.origin,
                        stopover: true
                    })
                    this.waypoints.push({
                        location: route.destination,
                        stopover: true
                    })

                    this.setDriveDirection(request)
                })
                this.originMarkers.push(startMarker)

                const stopMarker = new StopMarker(this.map, route.destination)
                this.destinationMarkers.push(stopMarker)
            }
        }
    }

    isPointInBoxes(point, boxes) {
        let result = false

        for (const box of boxes) {
            if (box.contains(point)) {
                result = true
            }
        }
        return result
    }
}