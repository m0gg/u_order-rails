function get_params() {
  var parameters = {};
  var url_params = location.search.substring(1);
  var reg = /([^&=]+)=([^&]*)/g;
  var par;
  while(par = reg.exec(url_params)) {
    parameters[decodeURIComponent(par[1])] = decodeURIComponent(par[2]);
  }
  return parameters;
}

function strip_uorder_params() {
  $.map(document.params, function(v, k) {
    if(k.match(/uorder_/)) {
      var order = {
        'table': k.replace(/uorder_([a-zA-Z0-9_-]*)\[.*/g, '$1'),
        'col': k.replace(/uorder_[a-zA-Z0-9_-]*\[(.*)\]/g, '$1'),
        'direction': v
      };
      delete document.params[k]
      var uorder = new UOrder(get_data_column(get_data_table(order['table']), order['col']));
      uorder.set_direction(order['direction']);
      return uorder;
    }
  });
}

function get_data_table(name) {
  return $('table[data-table=' + name + ']');
}

function get_data_column(table, name) {
  return table.find('th[data-order=' + name + ']');
}

function enable_uorder() {
  var map = $('table[data-table]').map(function(i, e) {
    return $(e).find('th[data-order]').map(function(j, dhead) {
      var head = $(dhead);
      if(!head.uorder) {
        new UOrder(head);
      }
      dhead.uorder.add_cb(reorder);
      return dhead.uorder;
    });
  });
  var merged = [];
  return merged.concat.apply(merged, map);
}

function UOrder(head) {
  head[0].uorder = this;
  this.head_element = head;
  this.head_name = this.head_element.attr('data-order');
  this.table_element = this.head_element.parents('[data-table]');
  this.table_name = this.table_element.attr('data-table');

  var direction_indicator = $('<span>');
  this.set_direction = set_direction;
  this.cycle_direction = cycle_direction;
  var direction;
  var direction_cycles = ['asc', 'desc'];
  if(cyc = this.head_element.attr('direction-cycle')) {
    direction_cycles = cyc.split(' ');
  }

  var cycle_cbs = [];
  this.add_cb = add_cb;

  this.param_serialize = param_serialize;

  function set_direction(dir) {
    direction = direction_cycles.indexOf(dir);
    switch(dir) {
      case 'asc':
        var css_class = 'ui-icon ui-icon-carat-1-n';
        break;
      case 'desc':
        var css_class = 'ui-icon ui-icon-carat-1-s';
        break
      default:
        var css_class = 'ui-icon ui-icon-carat-1-n-s';
    }
    direction_indicator.attr('class', css_class);
  };

  function cycle_direction() {
    direction = (direction != null ? direction+1 : 0);
    if(direction == direction_cycles.length) direction = 0;
    for(var i = 0; i < cycle_cbs.length; i++) {
      cycle_cbs[i](this);
    }
  }

  function add_cb(cb) {
    cycle_cbs.push(cb);
  }

  function param_serialize() {
    return 'uorder_' + this.table_name + '[' + this.head_name + ']=' + direction_cycles[direction];
  }

  this.head_element.on('click', function() {
    this.uorder.cycle_direction();
  });
  this.head_element.append(direction_indicator);
}


function reorder(element) {
  var old_params = $.map(document.params, function(v, k) {
    return [k, v].join('=');
  }).join('&');
  var uorder_param = element.param_serialize();
  location.href = location.pathname + '?' + [old_params, uorder_param].join('&');
}

$(document).ready(function() {

  document.params = get_params();
  strip_uorder_params(document.params);
  document.uorders = enable_uorder();

});