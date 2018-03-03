import React from 'react';
import PropTypes from 'prop-types';

import FileDownload from 'react-file-download';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { MdClear, MdEdit, MdClose, MdFileDownload } from 'react-icons/lib/md';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';


import * as moment from 'moment/moment';

import axios from 'axios';
import { flaskRoot } from 'utils/constants';
import { styles } from './styles';

const backendRoot = `${flaskRoot}/apps/catKitDemo`;
const url = `${backendRoot}/generate_dft_input`;

const initialState = {
  loading: false,
};


class CalculationsView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.clearCalculations = this.clearCalculations.bind(this);
    this.removeCalculation = this.removeCalculation.bind(this);
    this.downloadCalculations = this.downloadCalculations.bind(this);
  }
  clearCalculations() {
    this.props.clearCalculations();
  }
  removeCalculation(n) {
    this.props.removeCalculation(n);
  }

  downloadCalculations() {
    this.setState({
      loading: true,
    });
    const params = { params: {
      calculations: JSON.stringify(this.props.calculations),
    },
      responseType: 'arraybuffer',
    };
    axios.get(url, params).then((response) => {
      FileDownload(response.data, `calculations_${moment().format('YYYYMMDD_HHmmss')}.zip`);
    });
    this.setState({ loading: false });
  }

  render() {
    return (
      <div>
        {this.props.calculations.length === 0 ? null :
        <Slide
          in
          mountOnEnter
          unmountOnExit
          direction="up"
        >
          <Paper className={this.props.classes.paper} height={8}>
            <h4>Stored Calculations</h4>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="none">Lattice</TableCell>
                  <TableCell padding="none">Composition</TableCell>
                  <TableCell padding="none">Facet</TableCell>
                  <TableCell padding="none">Adsorbates</TableCell>
                  <TableCell padding="none">Calculator</TableCell>
                  <TableCell padding="none"><MdEdit /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.calculations.map((calculation, i) => (
                  <TableRow key={`calculation_${i}`}>
                    <TableCell padding="none">{calculation.bulkParams.structure}</TableCell>
                    <TableCell padding="none">{`
            [${calculation.bulkParams.elements.join(', ')}]
              `}</TableCell>
                    <TableCell padding="none">{
              `[
              ${calculation.slabParams.millerX},
              ${calculation.slabParams.millerY},
              ${calculation.slabParams.millerZ}
            ]`
            }</TableCell>
                    <TableCell padding="none">{`${calculation.adsorbateParams.adsorbate}@${calculation.adsorbateParams.siteType}`}
                    </TableCell>
                    <TableCell padding="none">{`
            ${calculation.dftParams.calculator}/${calculation.dftParams.functional}
            `}</TableCell>
                    <TableCell padding="none">
                      <IconButton onClick={() => { this.removeCalculation(i); }}>
                        <MdClose />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Grid container justify="flex-end" direction="row">
              <Grid item>
                <Button raised onClick={this.clearCalculations} color="inherit" className={this.props.classes.button}><MdClear /> Clear All</Button>
              </Grid>
              <Grid item>
                <Button
                  raised
                  onClick={this.downloadCalculations}
                  color="primary"
                  className={this.props.classes.button}
                ><MdFileDownload /> Download All</Button>
              </Grid>
            </Grid>

          </Paper>
        </Slide>
        }
        {this.state.loading ? <LinearProgress className={this.state.classes.progress} /> : null }
      </div>
    );
  }
}

CalculationsView.propTypes = {
  calculations: PropTypes.array,
  clearCalculations: PropTypes.func,
  removeCalculation: PropTypes.func,
  classes: PropTypes.object,
};

module.exports = {
  CalculationsView: withStyles(styles, { withTheme: true })(CalculationsView),
};
