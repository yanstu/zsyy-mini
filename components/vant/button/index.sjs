var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';

/* eslint-disable */
var style = antmove_1_module;

function rootStyle(data) {
  if (!data.color) {
    return '';
  }

  var properties = {
    color: data.plain ? data.color : '#fff',
    background: data.plain ? null : data.color
  }; // hide border when color is linear-gradient

  if (data.color.indexOf('gradient') !== -1) {
    properties.border = 0;
  } else {
    properties['border-color'] = data.color;
  }

  return style(properties);
}

function loadingColor(data) {
  if (data.plain) {
    return data.color ? data.color : '#c9c9c9';
  }

  if (data.type === 'default') {
    return '#c9c9c9';
  }

  return '#fff';
}

antmove_export = {
  rootStyle: rootStyle,
  loadingColor: loadingColor
};
export default antmove_export;