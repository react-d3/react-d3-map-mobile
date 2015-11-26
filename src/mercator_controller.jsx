"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import d3 from 'd3';

import {
  default as ReactDOM
} from 'react-dom'

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
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.center
      !== this.props.center) {
      return false;
    }else {
      return true;
    }
  }

  componentDidMount() {
    const {
      cWidth,
      dragExtent,
      controllerCenter
    } = this.props

    var extent = ReactDOM.findDOMNode(this.refs.extent);
    var that = this;
    var newPosition = [0, 0];

    var drag = d3.behavior.drag()
      .on("drag", function(d,i) {
        var evt = d3.event;

        d3.select(this)
          .attr("transform", function(){
            newPosition[0] += evt.dx;
            newPosition[1] += evt.dy;
            return "translate(" + newPosition[0] + ',' + newPosition[1] + ")"
          })

        console.log(controllerCenter)
        var centerPx = that.proj(controllerCenter)
        var pos = that.proj.invert([centerPx[0] + newPosition[0], centerPx[1] + newPosition[1]])
        // sent the center coordinates to the map
        dragExtent(pos[0], pos[1])
      });

    d3.select(extent)
      .call(drag);
  }

  render() {

    const {
      mapDim,
      controllerScale,
      controllerCenter,
      cWidth,
      cHeight,
      projection
    } = this.props;

    var scale = controllerScale / 2 / Math.PI;
    var translate = [cWidth / 2, cHeight / 2];
    var scaleExtent = [controllerScale, controllerScale];

    var proj = projectionFunc({
      projection: 'mercator',
      scale: scale,
      translate: translate,
      center: controllerCenter
    })

    this.proj = proj;

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
          scaleExtent= {scaleExtent}
        >
          <MercatorControllerMap
            tiles= {controllerTiles}
            scale= {scale}
          >
            {children}
          </MercatorControllerMap>
          <g
            ref= {"extent"}
          >
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
