import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-onsenui';
import SaveDataToFile from '../modules/data/containers/SaveDataToFile.jsx';

function mapStateToProps(state) {
    const {screenNavigator} = state.nav;
    return {
        screenNavigator
    }
}

class SaveDataView extends React.Component {
    componentDidMount() {
        window.screen.orientation.lock('portrait');
    }
    popPage = () => {
        this.props.screenNavigator.popPage();
    };
    render() {
        return (
            <div className="SaveDataView">
                <SaveDataToFile />
                <Button
                    className="back-button"
                    modifier='large'
                    onClick={this.popPage}
                >
                    Wróć
                </Button>
            </div>
        );
    }
}


export default connect(mapStateToProps)(SaveDataView)
