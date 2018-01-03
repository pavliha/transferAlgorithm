import Marker from "./Marker";

export default class StopMarker extends Marker{
    constructor(map,pointLatLng){
        super(map,pointLatLng, "http://www.google.com/mapfiles/dd-end.png")
    }
}