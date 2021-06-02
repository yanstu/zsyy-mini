var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';
import antmove_2_module from '../wxs/add-unit.sjs';

/* eslint-disable */
var style = antmove_1_module;
var addUnit = antmove_2_module;

function wrapperStyle(data) {
  var width = 100 / data.columnNum + '%';
  return style({
    width: width,
    'padding-top': data.square ? width : null,
    'padding-right': addUnit(data.gutter),
    'margin-top': data.index >= data.columnNum && !data.square ? addUnit(data.gutter) : null
  });
}

function contentStyle(data) {
  return data.square ? style({
    right: addUnit(data.gutter),
    bottom: addUnit(data.gutter),
    height: 'auto'
  }) : '';
}

antmove_export = {
  wrapperStyle: wrapperStyle,
  contentStyle: contentStyle
};
export default antmove_export;