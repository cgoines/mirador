import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewWindow from 'react-new-window';

/**
 * Opens a new window for click
 */
export class AuthenticationSender extends Component {
  /** */
  render() {
    const { handleInteraction, url } = this.props;
    if (!url) return <></>;

    /**
    login, clickthrough/kiosk open @id, wait for close
    external, no-op
    */
    return (
      <NewWindow url={`${url}?origin=${window.origin}`} onUnload={() => { handleInteraction(url); }} />
    );
  }
}

AuthenticationSender.propTypes = {
  handleInteraction: PropTypes.func.isRequired,
  url: PropTypes.string,
};

AuthenticationSender.defaultProps = {
  url: undefined,
};
