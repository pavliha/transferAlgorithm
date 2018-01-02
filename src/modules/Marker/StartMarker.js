import Marker from "./Marker";

export default class StartMarker extends Marker {
    constructor(pointLatLng) {
        super(pointLatLng, "http://www.google.com/mapfiles/dd-start.png")
    }
}