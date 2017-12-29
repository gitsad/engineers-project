import React from 'react';
import SaveDataToFile from '../modules/data/containers/SaveDataToFile.jsx';
import { BackButton } from 'react-onsenui';

export default class SaveDataView extends React.Component {
    render() {
        return (
            <div className="SaveDataView">
                <SaveDataToFile />
                <BackButton>Wróć</BackButton>
            </div>
        );
    }
}
