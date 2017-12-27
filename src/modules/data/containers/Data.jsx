import React from 'react';
import { Button } from 'react-onsenui';
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
import { addDataFromArduino } from '../actions';

function mapStateToProps(state) {
    const { data } = state.dataReducer;
    return {
        data
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addDataFromArduino: (data, time) => dispatch(addDataFromArduino(data, time))
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
            connected: false,
            arrayMessage: [],
            time: 0
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
        this.props.addDataFromArduino(Number(this.state.arrayMessage.join("")), this.state.time);
    };
    disconnect = () => {
        serial.close(
            () =>  {
                clearInterval(this.timeMeasure);
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
                this.timeMeasure = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
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
    render() {
        const connectButton = this.state.connected ? 'Rozłącz' : 'Połącz';
        const connectFunction = this.state.connected ? this.disconnect : this.connect;
        return(
            <div>
                <LineChart width={this.graphWidth} height={this.graphHeight} data={this.props.data}>
                    <XAxis dataKey="time" />
                    <YAxis />
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
            </div>
        )
    }
}

DataContainer.propTypes = propTypes;
DataContainer.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer)