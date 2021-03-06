import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from '../store/configure-store.js';
import DevTools from './dev-tools.jsx';

const store = configureStore();

export default class App extends Component {
    componentDidMount() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    };
    onDeviceReady = () => {
        StatusBar.hide();
    };
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    {this.props.children}
                    {__DEVTOOLS__ && <DevTools />}
                </div>
            </Provider>
        );
    }
}
if (__DEV__) {
    // Not needed or used in minified mode
    App.propTypes = {
        children: PropTypes.node.isRequired
    };
}
