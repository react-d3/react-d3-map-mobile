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
  default as MercatorController
} from './mercator_controller'

import {
  default as OverlayContent
} from './overlay_content'

import {
  default as ZoomControl
} from './zoom'

import {
  default as ZoomTabControl
} from './zoom_tab'

export default class MobileMap extends Component {
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
      overlayContent: null
    }
  }

  static defaultProps = {
    projection: 'mercator'
  }

  static childContextTypes = {
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired,
    showOverlay: React.PropTypes.func.isRequired,
    controller: React.PropTypes.bool.isRequired
  }

  getChildContext() {
    return {
      geoPath: this.geoPath,
      projection: this.projection,
      showOverlay: this.showOverlay.bind(this),
      controller: false
    };
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
        dragStart: false,
        dragEnded: false
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
      refresh: true,
      dragStart: false,
      dragEnded: false
    })
  }

  dragExtent(x, y) {
    this.setState({
      center: [x, y],
      refresh: false,
      dragStart: true,
      dragEnded: false
    })
  }

  dragEnd() {
    this.setState({
      dragStart: false,
      dragEnded: true
    })
  }

  resetDrag() {
    this.setState({
      dragStart: false,
      dragEnded: false
    })
  }

  showOverlay(dom, d, overlayContent, i) {
    this.setState({
      overlayContent: overlayContent(d)
    })
  }

  closeOverlay() {
    this.setState({
      overlayContent: null
    })
  }

  render() {
    const {
      scale,
      translate,
      center,
      refresh,
      dragStart,
      dragEnded,
      overlayContent
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
    var closeOverlay = this.closeOverlay.bind(this);
    var refreshEvt = this.refreshEvt.bind(this);
    var dragExtent = this.dragExtent.bind(this);
    var dragEnd = this.dragEnd.bind(this);
    var resetDrag = this.resetDrag.bind(this);

    var proj = projectionFunc({
      projection: projection,
      scale: scale / 2 / Math.PI,
      translate: translate,
      center: center
    });

    var geo = geoPath(proj);

    this.projection = proj;
    this.geoPath = geo;

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

    // controller height and width
    var cHeight = 150;
    var cWidth = width / 3;

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

    if(overlayContent) {
      var overlay = (
        <OverlayContent
          width= {width}
          content= {overlayContent}
          closeOverlay= {closeOverlay}
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
            {this.props.children}
          </Vector>
        </Chart>
        <MercatorController
          {...this.props}
          mapDim= {mapDim}
          controllerScale= {controllerScale}
          controllerCenter= {center}
          cWidth= {cWidth}
          cHeight= {cHeight}
          dragExtent= {dragExtent}
          dragEnd= {dragEnd}
          dragEnded= {dragEnded}
          dragStart= {dragStart}
          resetDrag= {resetDrag}
          center= {center}
          refresh= {refresh}
          zoomInClick= {zoomIn}
          zoomOutClick= {zoomOut}
          tabMode= {tabMode}
        >
          {this.props.children}
        </MercatorController>
        {btnGroup}
        {overlay}
      </div>
    )

  }
}
