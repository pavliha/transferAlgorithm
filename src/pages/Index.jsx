import React, {Component} from 'react'
import CargoFinder from "../modules/CargoFinder"

const routes = [
    {
        origin: {lat: 47.178526, lng: 35.111407},
        destination: {lat: 47.789085, lng: 35.211338}
    }, {
        origin: {lat: 47.268105, lng: 35.222356},
        destination: {lat: 47.788083, lng: 35.291438}
    }, {
        origin: {lat: 47.268105, lng: 35.222356},
        destination: {lat: 47.784185, lng: 35.612418}
    }, {
        origin: {lat: 47.268105, lng: 35.222356},
        destination: {lat: 47.781095, lng: 35.110498}
    }, {
        origin: {lat: 47.231606, lng: 35.401359},
        destination: {lat: 47.338033, lng: 35.069088}
    }
]
export default class Index extends Component {


    state = {
        distance: 10,
        from: "Tymoshivka, Zaporiz'ka oblast, 72030",
        to: "112B, Kosmichna St, 112Б, Zaporizhzhia, Zaporiz'ka oblast, 69000",
        type: "gas_station",
        keyword: "",
        name: "",
    }

    cargoFinder = null;

    componentDidMount() {

        google.maps.event.addDomListener(window, 'load', () => {
            this.cargoFinder = new CargoFinder(document.querySelector("#map"),routes)
        });
    }

    route() {


        this.cargoFinder.find({
            origin: this.state.from,
            destination: this.state.to,
            distance: this.state.distance,
        })


    }

    render() {
        return <div>
            <table border={1}>
                <tbody>
                <tr>
                    <td valign="top">
                        <div id="map" style={{width: 600, height: 500}}/>
                    </td>
                    <td>
                        <div id="side_bar" style={{width: 200, height: 600, overflow: 'auto'}}/>
                    </td>
                </tr>
                </tbody>
            </table>
            Box within at least
            <input type="text" id="distance"
                   value={this.state.distance}
                   onChange={(e) => this.setState({distance: e.target.value})}
                   size={2}/>
            kilometers of the route from
            <input type="text" id="from"
                   value={this.state.from}
                   onChange={(e) => this.setState({from: e.target.value})}/>
            to
            <input type="text" id="to"
                   value={this.state.from}
                   onChange={(e) => this.setState({from: e.target.value})}/>
            <input type="submit" onClick={this.route.bind(this)}/>
            <br/>
            <label>type</label>
            <input type="text" id="type"
                   value={this.state.type}
                   onChange={(e) => this.setState({type: e.target.value})}/>
            <label>keyword</label>
            <input type="text" id="keyword"
                   value={this.state.keyword}
                   onChange={(e) => this.setState({type: e.target.keyword})}
            />
            <label>name</label>
            <input type="text" id="name"
                   value={this.state.name}
                   onChange={(e) => this.setState({type: e.target.name})}
            />
            <div id="towns"/>
        </div>
    }

}
