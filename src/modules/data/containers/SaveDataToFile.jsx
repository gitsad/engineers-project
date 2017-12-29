import React from 'react';
import { Button } from 'react-onsenui';
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
        };
    }
    createFile = () => {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, (dir) => {
            console.log("got main dir", dir);
            dir.getFile(`${this.state.nameOfFile}.xlsx`,
                {
                    create:true
                },
                (file) => {
                console.log("got the file", file);
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
        }, (err) => { console.log(err) });
    };

    render() {
        return(
            <div>
                <div>
                    <input
                        type="text"
                        value={this.state.nameOfFile}
                        onChange={(event) => this.setState({ nameOfFile: event.target.value })}
                        placeholder="Nazwa pliku"
                    />
                </div>
                <Button onClick={this.createFile}>Create file</Button>
            </div>
        )
    }
}

SaveDataToFile.propTypes = propTypes;
SaveDataToFile.defaultProps = defaultProps;

export default connect(mapStateToProps, undefined)(SaveDataToFile)