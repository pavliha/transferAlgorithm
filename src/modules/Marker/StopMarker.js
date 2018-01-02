import Marker from "./Marker";

export default class StopMarker extends Marker{
    constructor(pointLatLng){
        super(pointLatLng, "http://www.google.com/mapfiles/dd-end.png")
    }
}