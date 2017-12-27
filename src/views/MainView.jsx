import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-onsenui';
// import { Button } from '../components/button/Button.jsx';
import DataView from './DataView.jsx';


class MainView extends React.Component {
    exitFromApp = () => {
        navigator.app.exitApp();
    };
    pushPage = () => {
        this.props.screenNavigator.pushPage({
            component: <DataView/>,
        })
    };
    render() {
        window.screen.orientation.lock('portrait');
        return (
            <div className="StartView">
                <div className="name-of-app">
                    Aplikacja pomiaru napięcia
                </div>
                <div className="buttons">
                    <Button
                        onClick={this.pushPage}
                        modifier='large'
                        className="one-button"
                    >
                        Pomiar
                    </Button>
                    <Button
                        onClick={this.exitFromApp}
                        modifier='large'
                        className="one-button"
                    >
                        Wyjście
                    </Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {screenNavigator} = state.nav;
    return {
        screenNavigator
    }
}

export default connect(mapStateToProps)(MainView)