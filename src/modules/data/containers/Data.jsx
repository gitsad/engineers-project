import React from 'react';
import { Button, Select } from 'react-onsenui';
import { connect } from 'react-redux';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';
import PropTypes from 'prop-types';
import { addDataFromArduino, clearData } from '../actions';

function mapStateToProps(state) {
    const { data } = state.dataReducer;
    return {
        data
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addDataFromArduino: (data, time) => dispatch(addDataFromArduino(data, time)),
        clearData: () => dispatch(clearData())
    }
}

const propTypes = {
    data: PropTypes.array
};
const defaultProps = {
    data: []
};

class DataContainer extends React.Component {
    constructor() {
        super();
        this.graphWidth = window.innerHeight;
        this.graphHeight = window.innerWidth - 70;
        this.timeMeasure = null;
        this.state = {
            measure: 0.1,
            connected: false,
            arrayMessage: [],
            time: 0,
            timeMeasure: null,
        }
    }

    concatData = (data) => {
        this.setState({
            arrayMessage: this.state.arrayMessage.concat(data)
        });

    };
    removeData = () => {
        this.setState({
            arrayMessage: []
        });
    };
    sendDataToReducer = () => {
        if((this.state.time*10) % (this.state.measure*10) === 0) {
            this.props.addDataFromArduino(Number(this.state.arrayMessage.join("")), this.state.time);
        }
    };
    disconnect = () => {
        clearInterval(this.timeMeasure);
        serial.close(
            () =>  {
                clearInterval(this.timeMeasure);
                this.timeMeasure = null;
                this.setState({ connected: false });
            },
            () => alert("Wystąpił problem, spróbuj jeszcze raz")
        )
    };
    connect = () => {
        const errorCallback = (message) => alert('Error: ' + message);
        serial.requestPermission(
            () => {
                if (!'TextDecoder' in window) {
                    alert('Your browser does not support the Encoding API.');
                    return;
                }
                this.setState({
                    connected: true
                });
                this.timeMeasure = setInterval(() => this.setState({ time: Math.round((this.state.time + 0.1)*10)/10 }), 100);
                serial.open(
                    {
                        baudRate: 9600
                    },
                    () => {
                        serial.registerReadCallback(
                            (data) => {
                                const view = new Uint8Array(data);
                                const enc = new TextDecoder();
                                const decodedString = enc.decode(view);
                                if(decodedString.length >= 1) {
                                    for(let i = 0; i < decodedString.length; i++) {
                                        if(parseInt(decodedString[i].charCodeAt(0)) !== 13) {
                                            this.concatData(decodedString[i]);
                                        } else {
                                            this.sendDataToReducer();
                                            this.removeData();
                                        }
                                    }
                                } else {
                                    if(parseInt(decodedString[i].charCodeAt(0)) !== 13) {
                                        this.concatData(decodedString);
                                    } else {
                                       this.sendDataToReducer();
                                       this.removeData();
                                    }
                                }
                            },
                            function error(){
                                new Error("Failed to register read callback");
                            });
                    },
                    errorCallback
                );
            },
            errorCallback
        )
    };
    editSelects = (event) => {
        this.setState({ measure: Number(event.target.value) }, () => {
            console.log(this.state);
        });
    };
    clearData = () => {
        this.props.clearData();
        this.setState({
            time: 0
        });
    }
    render() {
        const connectButton = this.state.connected ? 'Rozłącz' : 'Połącz';
        const connectFunction = this.state.connected ? this.disconnect : this.connect;
        return(
            <div>
                <LineChart width={this.graphWidth} height={this.graphHeight} data={this.props.data}>
                    <XAxis dataKey="time" unit="s"/>
                    <YAxis unit="A"/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="current" stroke="#8884d8" />
                </LineChart>
                <Button
                    onClick={connectFunction}
                >
                    {connectButton}
                </Button>
                <Button onClick={this.clearData}>
                    Clear data
                </Button>
                <Select
                    id="choose-sel"
                    value={this.state.measure.toString()}
                    modifier={this.state.measure.toString()}
                    onChange={this.editSelects}
                    disabled={this.state.connected}
                >
                    <option value="0.1">0.1s</option>
                    <option value="0.5">0.5s</option>
                    <option value="1">1s</option>
                </Select>
                {this.state.time}
                {this.state.measure}
                {(this.state.time*10) % (this.state.measure*10)}
            </div>
        )
    }
}

DataContainer.propTypes = propTypes;
DataContainer.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer)