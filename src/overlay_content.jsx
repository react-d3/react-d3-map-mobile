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
      padding: '10px',
      backgroundColor: '#FFF',
      overflow: 'hidden'
    }

    var leftContentStyle = {
      width: width - 50,
      float: 'left',
      overflowY: 'auto',
      maxHeight: '150px',
      fontSize: '20px'
    }

    var rightCloseStyle = {
      width: 50,
      float: 'right',
      fontWeight: 'bolder',
      color: '#333',
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
