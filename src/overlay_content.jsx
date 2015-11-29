"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

export default class OverlayContent extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const {
      content,
      width,
      closeOverlay
    } = this.props;

    var overlayStyle = {
      left: 0,
      top: 0,
      position: 'absolute',
      width: width,
      backgroundColor: '#FFF',
      overflow: 'hidden',
      font: '16px/14px Tahoma, Verdana, sans-serif',
    }

    var leftContentStyle = {
      width: width - 50,
      float: 'left',
      padding: '10px',
      overflowY: 'auto',
      maxHeight: '150px',
      fontSize: '20px'
    }

    var rightCloseStyle = {
      width: 30,
      float: 'right',
      fontWeight: 'bolder',
      color: '#c3c3c3',
      fontSize: '25px',
      cursor: 'pointer'
    }

    return (
      <div style= {overlayStyle}>
        <div style= {leftContentStyle}>
          {content}
        </div>
        <div
          style= {rightCloseStyle}
          onClick= {closeOverlay}
          >
          x
        </div>
      </div>
    )
  }
}
