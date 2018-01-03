import Marker from "./Marker";

export default class StartMarker extends Marker {
    constructor(map,pointLatLng) {
        super(map,pointLatLng, "http://www.google.com/mapfiles/dd-start.png")
    }
}