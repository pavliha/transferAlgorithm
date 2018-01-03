import BoxGenerator from "./BoxGenerator";

export default class BoxDrawer {

    constructor(map) {
        this.map = map
        this.boxpolys = null;


    }

    clear() {
        if (this.boxpolys !== null) {
            for (let i = 0; i < this.boxpolys.length; i++) {
                this.boxpolys[i].setMap(null)
            }
        }
        this.boxpolys = null
    }

    _generateBoxes(direciton, distance) {
        this.boxGenerator = new BoxGenerator(direciton, distance)
        return this.boxGenerator.generate()
    }

    draw(direction, distance) {

        const boxes = this._generateBoxes(direction, distance)

        this.boxpolys = new Array(boxes.length)
        for (let i = 0; i < boxes.length; i++) {
            this.boxpolys[i] = new window.google.maps.Rectangle({
                bounds: boxes[i],
                fillOpacity: 0,
                strokeOpacity: 1.0,
                strokeColor: '#000000',
                strokeWeight: 1,
                map: this.map
            })
        }

        return boxes
    }
}