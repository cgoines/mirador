import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend';
import * as actions from '../state/actions';
import {
  getDefaultManifestLocale,
  getDestructuredMetadata,
  getCanvasLabel,
  getManifestDescription,
  getManifestTitle,
  getSelectedCanvas,
  getManifestMetadata,
  getMetadataLocales,
  getCanvasDescription,
} from '../state/selectors';
import { WindowSideBarInfoPanel } from '../components/WindowSideBarInfoPanel';

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowSideBarInfoPanel
 * @private
 */
const mapStateToProps = (state, { id, windowId }) => ({
  availableLocales: getMetadataLocales(state, { companionWindowId: id, windowId }),
  canvasDescription: getCanvasDescription(state, { canvasIndex: 'selected', companionWindowId: id, windowId }),
  canvasLabel: getCanvasLabel(state, { canvasIndex: 'selected', companionWindowId: id, windowId }),
  canvasMetadata: getDestructuredMetadata(
    getSelectedCanvas(state, { companionWindowId: id, windowId }),
  ),
  locale: state.companionWindows[id].locale || getDefaultManifestLocale(state, { windowId }),
  manifestDescription: getManifestDescription(state, { companionWindowId: id, windowId }),
  manifestLabel: getManifestTitle(state, { companionWindowId: id, windowId }),
  manifestMetadata: getManifestMetadata(state, { companionWindowId: id, windowId }),
});

/** */
const mapDispatchToProps = (dispatch, { windowId, id }) => ({
  setLocale: locale => dispatch(actions.updateCompanionWindow(windowId, id, { locale })),
});

/**
 *
 * @param theme
 * @returns {label: {paddingLeft: number}}}
 */
const styles = theme => ({
  section: {
    borderBottom: '.5px solid rgba(0,0,0,0.25)',
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 2,
  },
});

const enhance = compose(
  withTranslation(),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowSideBarInfoPanel'),
);

export default enhance(WindowSideBarInfoPanel);
