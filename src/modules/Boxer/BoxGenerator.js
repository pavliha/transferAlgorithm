export default class BoxGenerator {
    constructor(direction, distance) {

        this.direction = direction
        this.distance = distance
        this.routeBoxer = new RouteBoxer()
        //this.routeBoxer.box(direction.routes[0].overview_path, distance)
    }

    generate() {
        // Box around the overview path of the first route
        const path = this.direction.routes[0].overview_path
        return this.routeBoxer.box(path, this.distance)
    }
}