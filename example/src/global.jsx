"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var topojson = require('topojson');

var OrthographicMobileMap = require('../../lib/index').OrthographicMobileMap;
var PolygonGroup = require('../../lib/index').PolygonGroup;

var css= require('./css/polygon.css');

// http://bl.ocks.org/KoGor/5994804

// Example
(function() {
  var width = window.innerWidth > 736? 736 : window.innerWidth;
  var height = window.innerHeight > 736? 736 : window.innerHeight;
  var scale = (1 << 13);
  var center = [-73.95, 40.7];
  var data = {geometry: {coordinates: [[[-74.0479, 40.8820], [-73.9067, 40.8820], [-73.9067, 40.6829], [-74.0479, 40.6829], [-74.0479, 40.8820]]], type: "Polygon"}, id: 999999, properties:{"text": "hi, this is a polygon!"}, type: "Feature"};
  var content = function(d) { return d.properties.text; }

  ReactDOM.render(
    <OrthographicMobileMap
      width= {width}
      height= {height}
      scale= {scale}
      center= {center}
    >
      <PolygonGroup
        data= {data}
        content= {content}
        polygonClass= {'react-d3-map-mobile__mercator_controller__polygon_group'}
      />
  </OrthographicMobileMap>
  , document.getElementById('blank-global')
  )

})()
