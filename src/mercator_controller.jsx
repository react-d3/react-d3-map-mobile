"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  default as topojson
} from 'topojson'

import {
  default as world
} from './data/world-50m'

import {
  Chart,
  Mesh,
  Graticule,
  Polygon,
  geoPath,
  projection as projectionFunc
} from 'react-d3-map-core'

import {
  default as LineGroup
} from './components/line_group'

import {
  default as PolygonGroup
} from './components/polygon_group'

import {
  default as PointGroup
} from './components/point_group'

export default class MercatorController extends Component {
  constructor(props) {
    super(props);

    const {
      data
    } = this.props;

    // seperate data to polygon, line, point and sent to different groups
    if(data.type === 'FeatureCollection') {
      var polygonData = [],
          lineData = [],
          pointData = [];

      // loop through features
      data.features.forEach(function(d) {
        d.properties.react_d3_map__id = Math.floor(Math.random() * 100000)
        if(d.geometry.type === 'Polygon' || d.geometry.type === 'MultiPolygon') {
          // polygon
          polygonData.push(d);
        }else if (d.geometry.type === 'LineString' || d.geometry.type === 'MultiLineString') {
          // line
          lineData.push(d);
        }else if (d.geometry.type === 'Point' || d.geometry.type === 'MultiPoint') {
          // point
          pointData.push(d);
        }
      })
    }else if(data.type === 'Feature') {
      var polygonData, lineData, pointData;

      data.properties.react_d3_map__id = Math.floor(Math.random() * 100000)
      if(data.geometry.type === 'Polygon' || data.geometry.type === 'MultiPolygon') {
        // polygon
        polygonData = data;
      }else if (data.geometry.type === 'LineString' || data.geometry.type === 'MultiLineString') {
        // line
        lineData = data;
      }else if (data.geometry.type === 'Point' || data.geometry.type === 'MultiPoint') {
        // point
        pointData = data;
      }
    }

    this.state = {
      polygonData: polygonData,
      lineData: lineData,
      pointData: pointData
    }
  }

  static defaultProps = {
    mesh : topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
    land : topojson.feature(world, world.objects.land),
    precision : .1,
    projection: 'mercator'
  }

  render() {

    const {
      polygonData,
      lineData,
      pointData
    } = this.state;

    const {
      width,
      height,
      projection,
      precision,
      mesh,
      land,
      controllerCenter,
      controllerScale,
      mapDim
    } = this.props;

    var cHeight = 150;
    var cWidth = width / 3

    var scale = controllerScale / 2 / Math.PI;
    var translate = [cWidth / 2, cHeight / 2];

    var proj = projectionFunc({
      projection: projection,
      scale: scale,
      translate: translate,
      center: controllerCenter,
      precision: precision
    })

    var geo = geoPath(proj);

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
          center= {[0, 0]}
          projection= {proj}
        >
          <Graticule
            geoPath = {geo}
          />
          <Mesh
            data= {mesh}
            geoPath= {geo}
          />
          <Polygon
            data= {land}
            geoPath= {geo}
          />
          <Polygon
            data= {extentRect}
            geoPath= {geo}
            polygonClass= {"react-d3-map-mobile__extent"}
          />
          <Polygon
            data= {polygonData}
            geoPath= {geo}
          />
          <PolygonGroup
            data= {polygonData}
            geoPath= {geo}
            polygonClass= {'react-d3-map-mobile__mercator_controller__polygon_group'}
          />
          <LineGroup
            data= {lineData}
            geoPath= {geo}
            meshClass= {'react-d3-map-mobile__mercator_controller__line_group'}
          />
          <PointGroup
            data= {pointData}
            geoPath= {geo}
            pointClass= {'react-d3-map-mobile__mercator_controller__point_group'}
          />
        </Chart>
      </div>
    )

  }
}
