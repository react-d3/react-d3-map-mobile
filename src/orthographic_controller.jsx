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

    const {
      controllerScale,
      controllerCenter,
      cWidth,
      cHeight,
      projection
    } = this.props;

    var scale = controllerScale;
    var translate = [cWidth / 2, cHeight / 2];

    var proj = projectionFunc({
      projection: 'orthographic',
      scale: scale,
      translate: translate,
      rotate: [-controllerCenter[0], -controllerCenter[1]],
      clipAngle: 90
    })

    var geo = geoPath(proj);

    this.extentPosition = [0, 0]

    this.state = {
      proj: proj,
      geo: geo
    }
  }

  static defaultProps = {
    sens: 1
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
      sens,
      dragExtent,
      controllerCenter
    } = this.props;

    const {
      proj
    } = this.state;

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
        var rotate = proj.rotate();
        proj.rotate([
          d3.event.x * sens,
          -d3.event.y * sens,
          rotate[2]
        ])

        that.setProjection(proj)
      })

    d3.select(orthograpic)
      .call(drag);
  }

  setProjection(proj) {
    this.setState({
      proj: proj
    })
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
      dragStart
    } = this.props;

    const {
      geo,
      proj
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
      marginLeft: '10px',
      marginBottom: '10px',
    }

    var geoExtent = geoPath(proj);

    var extent = mapDim.topLine.concat(mapDim.bottomLine);
    extent.push([mapDim.topLine[0]])

    var extentRect = {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[]]}
    };

    // console.log(geoExtent.centroid(extentRect))
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
              geoPath= {geoExtent}
              polygonClass= {"react-d3-map-mobile__extent"}
            />
          </g>
        </Chart>
      </div>
    )

  }
}
