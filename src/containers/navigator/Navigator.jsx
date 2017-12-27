/**
 * Created by gitsad on 27.06.17.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Navigator, Page } from 'react-onsenui';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import MainView from '../../views/MainView.jsx';
import {setRoute} from './actions';

const propTypes = {
    setRoute: PropTypes.func,
    navigator: PropTypes.object
};

const defaultProps = {
    navigator: {}
};

class NavigatorContainer extends React.Component {
    renderPage = (route, navigator) => {
        this.props.setRoute(route, navigator);
        return (
            <Page key={shortid.generate()}>
                {route.component}
            </Page>
        );
    };
    render() {
        return(
            <Navigator
                renderPage={this.renderPage}
                initialRoute={{
                    component: <MainView />,
                    title: 'TITLE',
                    key: 'MENUROOT'
                }}
            />
        )
    }
}

NavigatorContainer.propTypes = propTypes;
NavigatorContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
    const screenNavigator = state.nav.screenNavigator;
    return {
        screenNavigator
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setRoute: (route, navigator) => dispatch(setRoute(route, navigator))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorContainer)