var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';
import antmove_2_module from '../wxs/add-unit.sjs';

/* eslint-disable */
var style = antmove_1_module;
var addUnit = antmove_2_module;

function rootStyle(data) {
  return style({
    'padding-left': addUnit(data.gutter)
  });
}

antmove_export = {
  rootStyle: rootStyle
};
export default antmove_export;