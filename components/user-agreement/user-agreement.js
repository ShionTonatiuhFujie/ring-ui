/**
 * @name User Agreement
 * @category Components
 * @framework React
 * @constructor
 * @description A component displays user agreement dialog
 * @example-file ./user-agreement.examples.html
 */

import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';

import Dialog from '../dialog/dialog';
import {Content} from '../island/island';
import Panel from '../panel/panel';
import Button from '../button/button';
import Markdown from '../markdown/markdown';

import style from './user-agreement.css';

const SCROLL_TOLERANCE = 10;

export default class UserAgreement extends PureComponent {
  static propTypes = {
    translations: PropTypes.object,

    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired,

    userAgreement: PropTypes.shape({
      enabled: PropTypes.bool.isRequired,
      majorVersion: PropTypes.number.isRequired,
      minorVersion: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired,

    userConsent: PropTypes.shape({
      accepted: PropTypes.bool.isRequired,
      majorVersion: PropTypes.number.isRequired,
      minorVersion: PropTypes.number.isRequired
    }).isRequired
  };

  static defaultProps = {
    translations: {
      accept: 'Accept',
      decline: 'Decline',
      scrollToAccept: 'View the entire agreement to continue'
    }
  };

  state = {
    scrolledDown: false
  };

  onTextRef = component => {
    // eslint-disable-next-line react/no-find-dom-node
    const textRef = this.textRef = findDOMNode(component);
    if (textRef) {
      textRef.addEventListener('scroll', this.onScroll);
      this.onScroll();
    }
  };

  onScroll = () => {
    const textRef = this.textRef;
    const delta = Math.abs(textRef.scrollTop - (textRef.scrollHeight - textRef.offsetHeight));

    if (delta < SCROLL_TOLERANCE) {
      this.setState({scrolledDown: true});
    }
  };

  render() {
    const {scrolledDown} = this.state;
    const {
      translations, onAccept, onDecline,
      userAgreement: {enabled, text, majorVersion: actualVersion},
      userConsent: {accepted, majorVersion: acceptedVersion}
    } = this.props;

    const show = enabled && (!accepted || actualVersion > acceptedVersion);

    return (
      <Dialog show={show} contentClassName={style.dialogContent}>
        <Content>
          <Markdown source={text} className={style.text} ref={this.onTextRef}/>
        </Content>
        <Panel>
          <Button blue disabled={!scrolledDown} onClick={onAccept}>{translations.accept}</Button>
          <Button onClick={onDecline}>{translations.decline}</Button>
          {!scrolledDown && translations.scrollToAccept}
        </Panel>
      </Dialog>
    );
  }
}