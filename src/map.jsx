"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  Chart,
  projection as projectionFunc,
  geoPath,
  tileFunc,
  ZoomControl
} from 'react-d3-map-core';

import {
  default as Vector
} from './vector';

import {
  default as MercatorController
} from './mercator_controller'

export default class MobileMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: this.props.scale,
      times: 1
    }
  }

  static defaultProps = {
    projection: 'mercator'
  }

  zoomIn() {
    var times = this.state.times;
    var scaleSet = this.state.scale;

    const {
      scale
    } = this.props;

    if(scaleSet * 2 < scale) {
      this.setState({
        times: times * 2,
        scale: scaleSet * 2
      })
    }
  }

  zoomOut() {
    var times = this.state.times;
    var scaleSet = this.state.scale;

    const {
      controllerScale
    } = this.props;

    if(scaleSet / 2 > controllerScale) {
      this.setState({
        times: times / 2,
        scale: scaleSet / 2
      })
    }
  }

  onClickData() {
    console.log('click')
  }

  render() {
    const {
      scale
    } = this.state;

    const {
      width,
      height,
      center,
      projection,
      data,
      content,
      controllerScale
    } = this.props;

    var zoomIn = this.zoomIn.bind(this);
    var zoomOut = this.zoomOut.bind(this);
    var onClickData = this.onClickData.bind(this);

    var translate = [width / 2, height / 2] || this.props.translate;

    var proj = projectionFunc({
      projection: projection,
      scale: scale / 2 / Math.PI,
      translate: translate,
      center: center
    });

    var geo = geoPath(proj);

    var tiles = tileFunc({
      scale: proj.scale() * 2 * Math.PI,
      translate: proj([0, 0]),
      size: ([width, height])
    });

    var styleContainer = {
      position: 'relative',
      backgroundColor: '#EEE',
      width: width
    }

    //map dims
    var mapDim = {
      topLine: [],
      bottomLine: []
    };

    var samples = 8,
      step = width / samples;

    for (var i = 0; i < samples; i++) {
      mapDim.topLine.push(proj.invert( [step * i,0] ))
      mapDim.bottomLine.push(proj.invert( [step * (samples - i - 1),height] ))
    }

    return (
      <div style= {styleContainer}>
        <Chart
          {...this.props}
          width= {width}
          height= {height}
          projection = {proj}
          center= {center}
        >
          <Vector
            tiles= {tiles}
            projection= {proj}
            geoPath= {geo}
            data= {data}
            width= {width}
            height= {height}
            onClick= {onClickData}
            {...this.state}
          />
        </Chart>
        <MercatorController
          width= {width}
          height= {height}
          controllerCenter= {center}
          controllerScale= {controllerScale}
          mapDim= {mapDim}
          data= {data}
        />
        <ZoomControl
          top= {height - 100}
          left= {width - 50}
          zoomInClick= {zoomIn}
          zoomOutClick= {zoomOut}
        />
      </div>
    )

  }
}
