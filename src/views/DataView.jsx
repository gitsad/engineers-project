import React from 'react';
import Data from '../modules/data/containers/Data.jsx';

export default class DataView extends React.Component {
    componentDidMount() {
        window.screen.orientation.lock('landscape');
    }

    render() {
        return (
            <div className="NextView">
                <Data />
            </div>
        );
    }
}