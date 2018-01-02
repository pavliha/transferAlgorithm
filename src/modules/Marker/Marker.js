import {event, Marker as GoogleMarker, Point, Size} from "../../api/googleMaps"

export default class Marker {

    constructor(pointLatLng, image) {
        this.marker = new GoogleMarker({
            map: this.map,
            icon: {
                url: image,
                size: new Size(70, 70),
                anchor: new Point(3.5, 3.5)
            },
            position: pointLatLng
        })

    }

    onClick(callback) {
        event.addListener(this.marker, 'click', callback)
    }
}