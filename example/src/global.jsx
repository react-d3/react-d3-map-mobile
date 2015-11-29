"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var topojson = require('topojson');

var OrthographicMobileMap = require('../../lib/index').OrthographicMobileMap;
var PolygonGroup = require('../../lib/index').PolygonGroup;
var MarkerGroup = require('../../lib/index').MarkerGroup;

var css= require('./css/polygon.css');

// http://bl.ocks.org/KoGor/5994804

// Example
(function() {
  var width = window.innerWidth > 736? 736 : window.innerWidth;
  var height = window.innerHeight > 736? 736 : window.innerHeight;
  var scale = (1 << 12);
  var controllerScale = (1 << 7);
  var center = [-100.95, 40.7];
  var data = require('json!../data/states.json');
  var content = function(d) { return 'hello I am polygon'; }

  var uk = require('json!../data/uk.json');
  var ukdata = topojson.feature(uk, uk.objects.places);
  var ukcontent = function(d) { return d.properties.name; }

  ReactDOM.render(
    <OrthographicMobileMap
      width= {width}
      height= {height}
      scale= {scale}
      center= {center}
      controllerScale= {controllerScale}
    >
      <PolygonGroup
        data= {data}
        overlayContent= {content}
        polygonClass= {'react-d3-map-mobile__mercator_controller__polygon_group'}
      />
      <MarkerGroup
        data= {ukdata}
        overlayContent= {ukcontent}
        pointClass= {'react-d3-map-mobile__mercator_controller__point_group'}
      />
  </OrthographicMobileMap>
  , document.getElementById('blank-global')
  )

})()
