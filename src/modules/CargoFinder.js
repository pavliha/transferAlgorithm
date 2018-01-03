import StartMarker from "./Marker/StartMarker"
import StopMarker from "./Marker/StopMarker"
import BoxGenerator from "./Boxer/BoxGenerator"
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
    }

    routeInBox(route, box) {

        const result = box.contains(route.origin) && box.contains(route.destination)
        console.log(box.contains(route.origin), box.contains(route.destination))
        return result
    }

    deleteMarkers() {
        for (const originMarker of this.originMarkers)
            originMarker.destroy()

        for (const destinationMarker of this.destinationMarkers)
            destinationMarker.destroy()
    }


    searchSimilarRoutesRecursive(boxes, i) {
        for (const route of this.routes)
            if (this.routeInBox(route, boxes[i])) {
                this.originMarkers.push(new StartMarker(this.map, route.origin))
                this.destinationMarkers.push(new StopMarker(this.map, route.destination))
            }

        i++

        if (i < boxes.length) this.searchSimilarRoutesRecursive(boxes, i)

    }


    setDriveDirection(request) {

        request = {
            ...request,
            travelMode: "DRIVING"
        }
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

        this.boxDrawer.clear()

        this.deleteMarkers()

        const distance = request.distance
        delete request.distance
        const direction = await
            this.setDriveDirection(request)

        this.findCargoNearDirection(direction, distance)
    }

    findCargoNearDirection(direction, distance) {
        const boxGenerator = new BoxGenerator(direction, distance)
        const boxes = boxGenerator.generate()
        this.boxDrawer.draw(boxes)
        this.searchSimilarRoutesRecursive(boxes, 0)
    }


    getRandomMarkerPosition(bounds = this.map.getBounds()) {
        const lat_min = bounds.getSouthWest().lat(),
            lat_range = bounds.getNorthEast().lat() - lat_min,
            lng_min = bounds.getSouthWest().lng(),
            lng_range = bounds.getNorthEast().lng() - lng_min;

        return new google.maps.LatLng(lat_min + (Math.random() * lat_range),
            lng_min + (Math.random() * lng_range));
    }
}