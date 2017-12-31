import React, {Component} from 'react'
import GooglePlaceFinder from "../modules/GooglePlaceFinder";

export default class Index extends Component {


    state = {
        distance: 3,
        from: "Tymoshivka, Zaporiz'ka oblast, 72030",
        to: "112B, Kosmichna St, 112Б, Zaporizhzhia, Zaporiz'ka oblast, 69000",
        type: "gas_station",
        keyword: "",
        name: "",
    }

    googlePlaceFinder = null;

    componentDidMount() {

        google.maps.event.addDomListener(window, 'load', () => {
            this.googlePlaceFinder = new GooglePlaceFinder(document.querySelector("#map"))
        });
    }

    route() {

        this.googlePlaceFinder.clearBoxes()


        this.googlePlaceFinder.setDirection({
            origin: this.state.from,
            destination: this.state.to,
            //distance: this.state.distance
        }, )

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
