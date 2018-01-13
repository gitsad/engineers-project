import React from 'react';
import { Button, Input, ProgressCircular, ProgressBar, AlertDialog } from 'react-onsenui';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function mapStateToProps(state) {
    const { data } = state.dataReducer;
    return {
        data
    }
}

const propTypes = {
    data: PropTypes.array
};
const defaultProps = {
    data: []
};

class SaveDataToFile extends React.Component {
    constructor() {
        super();
        this.logOb = null;
        this.state = {
            nameOfFile: '',
            loading: false,
            dialogShown: false,
            message: '',
        };
    }
    createFile = () => {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, (dir) => {
            this.setState({
                loading: true
            });
            dir.getFile(`${this.state.nameOfFile}.xlsx`,
                {
                    create:true
                },
                (file) => {
                this.logOb = file;
                this.writeLog(this.createString());
            });
        });
    };

    createString = () => {
        let string = 'current,time,\n';
        this.props.data.forEach((sample) => {
            string = string.concat(`${sample.current},${sample.time},\n`);
        });
        return string;
    };

    writeLog = (data) => {
        if(!this.logOb) return;
        const log = `${data}\n`;
        this.logOb.createWriter((fileWriter) => {
            fileWriter.seek(fileWriter.length);
            const blob = new Blob([log], {type:'text/plain'});
            fileWriter.write(blob);

            setTimeout(() => { this.showDialog('Plik został utworzony'); }, 1500);
        }, (err) => { this.showDialog('Błąd, spróbuj jeszcze raz'); });
    };

    showDialog = (message) => {
        this.setState({
            loading: false,
            dialogShown: true,
            nameOfFile: '',
            message
        });
    };

    hideDialog = () => {
        this.setState({dialogShown: false});
    };

    render() {
        const showLoader = this.state.loading ? <ProgressBar indeterminate /> : <div/>;
        return(
            <div className="save-data-to-file">
                {showLoader}
                <div className="input-container">
                    <Input
                        type="text"
                        value={this.state.nameOfFile}
                        onChange={(event) => this.setState({ nameOfFile: event.target.value })}
                        placeholder="Nazwa pliku"
                    />
                </div>
                <Button
                    modifier='large'
                    onClick={this.createFile}
                >
                    Create file
                </Button>
                <AlertDialog
                    isOpen={this.state.dialogShown}
                    isCancelable={false}>
                    <div className='alert-dialog-content'>
                        {this.state.message}
                    </div>
                    <div className='alert-dialog-footer'>
                        <button onClick={this.hideDialog} className='alert-dialog-button'>
                            Ok
                        </button>
                    </div>
                </AlertDialog>
            </div>
        )
    }
}

SaveDataToFile.propTypes = propTypes;
SaveDataToFile.defaultProps = defaultProps;

export default connect(mapStateToProps, undefined)(SaveDataToFile)