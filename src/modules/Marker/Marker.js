export default class Marker extends google.maps.Marker {

    constructor(map, pointLatLng, image) {
        super({
            map: map,
            icon: {
                url: image,
                size: new google.maps.Size(70, 70),
                anchor: new google.maps.Point(3.5, 3.5)
            },
            position: pointLatLng
        });
    }

    onClick(callback) {
        google.maps.event.addListener(this, 'click', callback)
    }

    destroy() {
        this.setMap(null);
    }
}