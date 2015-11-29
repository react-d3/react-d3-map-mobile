"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var topojson = require('topojson');

var MercatorMobileMap = require('../../lib/index').MercatorMobileMap;
var PolygonGroup = require('../../lib/index').PolygonGroup;

var css= require('./css/polygon.css');

// Example
(function() {
  var width = window.innerWidth > 736? 736 : window.innerWidth;
  var height = window.innerHeight > 736? 736 : window.innerHeight;
  var scale = (1 << 12);
  var controllerScale = (1 << 8);
  var center = [-100.95, 40.7];
  var data = require('json!../data/states.json');
  var content = function(d) { return d.properties.text; }

  ReactDOM.render(
    <MercatorMobileMap
      width= {width}
      height= {height}
      scale= {scale}
      controllerScale= {controllerScale}
      center= {center}
    >
      <PolygonGroup
        data= {data}
        content= {content}
        polygonClass= {'react-d3-map-mobile__mercator_controller__polygon_group'}
      />
    </MercatorMobileMap>
  , document.getElementById('blank-multipolygon')
  )

})()
