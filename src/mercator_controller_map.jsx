"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  Tile
} from 'react-d3-map-core'

export default class MercatorControllerMap extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.scale
      !== this.props.scale) {
      return false;
    }else {
      return true;
    }
  }


  render() {

    const {
      tiles
    } = this.props;

    return (
      <g>
        <Tile
          ref= 'tiles'
          scale= {tiles.scale}
          translate= {tiles.translate}
          tiles= {tiles}
        />
        {this.props.children}
      </g>
    )

  }
}
