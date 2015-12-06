"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  Marker
} from 'react-d3-map-core';

import {
  default as PointGroup
} from './point_group';

export default class MarkerGroup extends Component {

  static contextTypes = {
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired,
    showOverlay: React.PropTypes.func.isRequired,
    controller: React.PropTypes.bool.isRequired
  }

  static defaultProps = {
    markerClass: 'react-d3-map-mobile__mercator_controller__marker_group'
  }

  render() {
    const {
      data,
      onClick,
      onMouseOut,
      onMouseOver,
      markerClass,
      pointClass,
      overlayContent
    } = this.props;

    const {
      projection,
      geoPath,
      showOverlay,
      controller
    } = this.context;

    var markers;

    if(overlayContent) {
      // if have overlay content, click to show overlay
      var onMarkerClick = (dom, d, i) => {
        showOverlay(dom, d, overlayContent, i);
        if(onClick) onClick(dom, d, i);
      }
    }else {
      var onMarkerClick = onClick;
    }

    if(!controller) {

      if(data.type === 'FeatureCollection') {
        var pointData = [];

        // loop through features
        data.features.forEach(function(d) {
          pointData.push(d);
        })
      }else if(data.type === 'Feature') {
        var pointData;

        pointData = data;
      }

      if(pointData) {
        // if not array, make it as array
        if(!Array.isArray(pointData))
          pointData = [pointData];

        markers = pointData.map((d, i) => {
          var x = +projection(d.geometry.coordinates)[0];
          var y = +projection(d.geometry.coordinates)[1];
          var id = x + '-' + y;
          return (
            <Marker
              id= {id}
              key= {i}
              data= {d}
              x= {x}
              y= {y}
              onClick= {onMarkerClick}
              onMouseOver= {onMouseOver}
              onMouseOut= {onMouseOut}
              markerClass= {markerClass}
            />
          )
        })
      }
    }else {
      // change to point group, if it is in controller.
      var markers = (
        <PointGroup
          data= {data}
          pointClass= {pointClass}
        />
      )
    }

    return (
      <g>
        {markers}
      </g>
    )
  }
}
