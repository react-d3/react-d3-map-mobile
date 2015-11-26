"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  Chart,
  Polygon,
  geoPath,
  projection as projectionFunc,
  tileFunc
} from 'react-d3-map-core'

import {
  default as MercatorControllerMap
} from './mercator_controller_map'

export default class MercatorController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoomTranslate: null,
      zoomScale: null
    }
  }

  onZoom(zoomScale, zoomTranslate) {
    this.setState({
      zoomTranslate: zoomTranslate,
      zoomScale: zoomScale
    })
  }

  render() {

    const {
      zoomTranslate,
      zoomScale
    } = this.state;

    const {
      mapDim,
      controllerScale,
      controllerCenter,
      width,
      projection
    } = this.props;

    // controller height and width
    var cHeight = 150;
    var cWidth = width / 3;
    var onZoom = this.onZoom.bind(this);

    var scale = controllerScale / 2 / Math.PI;
    var translate = [cWidth / 2, cHeight / 2];
    var scaleExtent = [controllerScale, controllerScale];

    var proj = projectionFunc({
      projection: 'mercator',
      scale: zoomScale / 2 / Math.PI || scale,
      translate: zoomTranslate || translate,
      center: controllerCenter
    })

    var geo = geoPath(proj);

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

    var controllerTiles = tileFunc({
      scale: proj.scale() * 2 * Math.PI,
      translate: proj([0, 0]),
      size: ([cWidth, cHeight])
    })

    var containerStyle = {
      left: 0,
      bottom: 0,
      position: 'absolute',
      border: '2px solid rgba(0,0,0,0.2)',
      backgroundClip: 'padding-box',
      boxShadow: 'none',
      marginLeft: '10px',
      marginBottom: '10px',
      cursor: 'pointer',
      backgroundColor: '#EEE'
    }

    var extent = mapDim.topLine.concat(mapDim.bottomLine);
    extent.push([mapDim.topLine[0]])

    var extentRect = {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[]]}
    };

    extentRect.geometry.coordinates[0] = extent;


    return (
      <div style= {containerStyle}>
        <Chart
          width= {cWidth}
          height= {cHeight}
          center= {controllerCenter}
          projection= {proj}
          onZoom= {onZoom}
          scaleExtent= {scaleExtent}
        >
          <MercatorControllerMap
            tiles= {controllerTiles}
          >
            {children}
          </MercatorControllerMap>
          <Polygon
            data= {extentRect}
            geoPath= {geo}
            polygonClass= {"react-d3-map-mobile__extent"}
          />
        </Chart>
      </div>
    )

  }
}
