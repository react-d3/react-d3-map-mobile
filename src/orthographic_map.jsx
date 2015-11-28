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
  tileFunc
} from 'react-d3-map-core';

import {
  default as Vector
} from './vector';

import {
  default as OrthographicController
} from './orthographic_controller'

import {
  default as ZoomControl
} from './zoom'

export default class OrthographicMobileMap extends Component {
  constructor(props) {
    super(props);

    const {
      width,
      height,
      center
    } = props;

    var translate = [width / 2, height / 2] || this.props.translate;

    this.state = {
      scale: this.props.scale,
      translate: translate,
      times: 1,
      center: center,
      refresh: false,
      dragStart: false,
      globalRotate: [-center[0], -center[1]]
    }
  }

  static defaultProps = {
    projection: 'mercator',
    controllerScale: 1 << 7
  }

  zoomIn() {
    var times = this.state.times;
    var scaleSet = this.state.scale;

    const {
      scale
    } = this.props;

    if(scaleSet < scale) {
      this.setState({
        times: times * 2,
        scale: scaleSet * 2,
        refresh: false,
        dragStart: false,
        dragEnded: false
      })
    }
  }

  zoomOut(){
    var times = this.state.times;
    var scaleSet = this.state.scale;

    const {
      controllerScale
    } = this.props;

    if(scaleSet / 4 > controllerScale) {
      this.setState({
        times: times / 2,
        scale: scaleSet / 2,
        refresh: false,
        dragStart: false
      })
    }
  }

  refreshEvt() {
    const {
      scale,
      center
    } = this.props;

    this.setState({
      scale: scale,
      center: center,
      globalRotate: [-center[0], -center[1]],
      refresh: true,
      dragStart: false
    })
  }

  dragExtent(center, rotate) {

    this.setState({
      center: center,
      globalRotate: rotate,
      refresh: false,
      dragStart: true
    })
  }

  onClickData() {
    console.log('click')
  }

  render() {
    const {
      scale,
      translate,
      center,
      refresh,
      dragStart,
      globalRotate
    } = this.state;

    const {
      width,
      height,
      projection,
      controllerScale,
      tabMode
    } = this.props;

    var zoomIn = this.zoomIn.bind(this);
    var zoomOut = this.zoomOut.bind(this);
    var refreshEvt = this.refreshEvt.bind(this);
    var onClickData = this.onClickData.bind(this);
    var dragExtent = this.dragExtent.bind(this);

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

    // add projection and geoPath to children
    var children = React.Children.map(
      this.props.children,
      (child) => {
        return React.cloneElement(child, {
          projection: proj,
          geoPath: geo
        })
      }
    );

    // controller height and width
    var cHeight = width / 2;
    var cWidth = width / 2;

    //map dims
    var mapDim = {
      topLine: [],
      bottomLine: []
    };

    mapDim.topLine.push(proj.invert([0, 0]))
    mapDim.topLine.push(proj.invert([width, 0]))
    mapDim.bottomLine.push(proj.invert([width, height]))
    mapDim.bottomLine.push(proj.invert([0, height]))

    if(!tabMode) {
      var btnGroup = (
        <ZoomControl
          top= {height}
          left= {width}
          zoomInClick= {zoomIn}
          zoomOutClick= {zoomOut}
          refreshClick= {refreshEvt}
        />
      )
    }else {
      var btnGroup = (
        <ZoomTabControl
          top= {height}
          left= {width}
          refreshClick= {refreshEvt}
        />
      )
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
          >
            {children}
          </Vector>
        </Chart>
        <OrthographicController
          {...this.props}
          mapDim= {mapDim}
          controllerScale= {controllerScale}
          controllerCenter= {center}
          cWidth= {cWidth}
          cHeight= {cHeight}
          dragExtent= {dragExtent}
          dragStart= {dragStart}
          globalRotate= {globalRotate}
          center= {center}
          refresh= {refresh}
          zoomInClick= {zoomIn}
          zoomOutClick= {zoomOut}
        >
          {this.props.children}
        </OrthographicController>
        {btnGroup}
      </div>
    )

  }
}
