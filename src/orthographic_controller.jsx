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

import d3 from 'd3';
import ReactDOM from 'react-dom'
import OrthographicControllerMap from './orthographic_controller_map'

export default class OrthographicController extends Component {
  constructor(props) {
    super(props);
    this.extentPosition = [0, 0]
  }

  static defaultProps = {
    sens: .25
  }

  componentDidUpdate() {
    const {refresh} = this.props

    if(refresh){
      this.extentPosition = [0, 0]
    }
  }

  componentDidMount() {
    const {
      cWidth,
      cHeight,
      sens,
      dragExtent,
      controllerCenter,
      globalRotate,
      controllerScale
    } = this.props;

    var translate = [cWidth / 2, cHeight / 2];

    var proj = projectionFunc({
      projection: 'orthographic',
      scale: controllerScale,
      translate: translate,
      rotate: globalRotate,
      clipAngle: 90
    })

    var orthograpic = ReactDOM.findDOMNode(this.refs['orthographic-map']);
    var that = this;

    var drag = d3.behavior.drag()
      .origin(() => {
        var r = proj.rotate();
        return {
          x: r[0] / sens,
          y: -r[1] / sens
        };
      })
      .on("drag", function(d,i) {
        var centerPx = proj(controllerCenter)
        var newPosition = that.extentPosition

        var evt = d3.event;
        var rotate = proj.rotate();

        newPosition[0] += evt.dx;
        newPosition[1] += evt.dy;

        var pos = proj.invert([centerPx[0] - newPosition[0], centerPx[1] - newPosition[1]])
        // sent the center coordinates to the map
        dragExtent(pos, [
          evt.x * sens,
          -evt.y * sens,
          rotate[2]
        ])
      })

    d3.select(orthograpic)
      .call(drag);
  }

  render() {

    const {
      mapDim,
      cHeight,
      cWidth,
      controllerCenter,
      controllerScale,
      scaleExtent,
      scale,
      refresh,
      zoomInClick,
      zoomOutClick,
      dragStart,
      globalRotate
    } = this.props;

    var translate = [cWidth / 2, cHeight / 2];

    var proj = projectionFunc({
      projection: 'orthographic',
      scale: controllerScale,
      translate: translate,
      rotate: globalRotate,
      clipAngle: 90
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

    var containerStyle = {
      left: 0,
      bottom: 0,
      position: 'absolute',
      marginLeft: '10px',
      marginBottom: '10px',
    }

    // var geoExtent = geoPath(proj);

    var extent = mapDim.topLine.concat(mapDim.bottomLine);
    extent.push([mapDim.topLine[0]])

    var extentRect = {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[]]}
    };

    extentRect.geometry.coordinates[0] = extent;

    return (
      <div
        style= {containerStyle}
      >
        <Chart
          width= {cWidth}
          height= {cHeight}
          center= {controllerCenter}
          projection= {proj}
          scaleExtent= {scaleExtent}
        >
          <g
            ref={"orthographic-map"}
          >
            <OrthographicControllerMap
              cWidth= {cWidth}
              cHeight= {cHeight}
              projection= {proj}
              geoPath= {geo}
            >
              {children}
            </OrthographicControllerMap>
            <Polygon
              data= {extentRect}
              geoPath= {geo}
              polygonClass= {"react-d3-map-mobile__extent"}
            />
          </g>
        </Chart>
      </div>
    )

  }
}
