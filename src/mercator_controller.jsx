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

    const {
      controllerScale,
      controllerCenter,
      cWidth,
      cHeight,
      projection
    } = this.props;

    var scale = controllerScale / 2 / Math.PI;
    var translate = [cWidth / 2, cHeight / 2];

    var proj = projectionFunc({
      projection: 'mercator',
      scale: scale,
      translate: translate,
      center: controllerCenter
    })

    var geo = geoPath(proj);

    var controllerTiles = tileFunc({
      scale: proj.scale() * 2 * Math.PI,
      translate: proj([0, 0]),
      size: ([cWidth, cHeight])
    })

    this.extentPosition = [0, 0]

    this.state = {
      proj: proj,
      geo: geo,
      controllerTiles: controllerTiles
    }
  }

  componentDidUpdate() {
    const {refresh} = this.props

    if(refresh){
      var extent = ReactDOM.findDOMNode(this.refs.extent);

      d3.select(extent)
        .attr("transform", "translate(0, 0)")

      this.extentPosition = [0, 0]
    }
  }

  componentDidMount() {
    const {
      cWidth,
      dragExtent,
      controllerCenter
    } = this.props;

    const {
      proj
    } = this.state;

    var extent = ReactDOM.findDOMNode(this.refs.extent);
    var that = this;

    var drag = d3.behavior.drag()
      .on("drag", function(d,i) {
        var evt = d3.event;
        var newPosition = that.extentPosition

        d3.select(this)
          .attr("transform", function(){
            newPosition[0] += evt.dx;
            newPosition[1] += evt.dy;
            return "translate(" + newPosition[0] + ',' + newPosition[1] + ")"
          })

        var centerPx = proj(controllerCenter)
        var pos = proj.invert([centerPx[0] + newPosition[0], centerPx[1] + newPosition[1]])
        // sent the center coordinates to the map
        dragExtent(pos[0], pos[1])
      });

    d3.select(extent)
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
      refresh
    } = this.props;

    const {
      geo,
      proj,
      controllerTiles
    } = this.state;

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
      border: '2px solid rgba(0,0,0,0.2)',
      backgroundClip: 'padding-box',
      boxShadow: 'none',
      marginLeft: '10px',
      marginBottom: '10px',
      backgroundColor: '#EEE'
    }

    var translate = [cWidth / 2, cHeight / 2];

    var projExtent = projectionFunc({
      projection: 'mercator',
      scale: controllerScale / 2 / Math.PI,
      translate: translate,
      center: controllerCenter
    })

    var geoExtent = geoPath(projExtent);

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
              geoPath= {geoExtent}
              polygonClass= {"react-d3-map-mobile__extent"}
            />
          </g>
        </Chart>
      </div>
    )

  }
}
