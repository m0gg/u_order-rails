function DataTable(table, reorder_callback) {
  table.data_table = this;

  this.table_element = $(table);
  this.table_name = this.table_element.attr('data-table');
  var reorder_cb = reorder_callback;

  this.param_serialize = param_serialize;

  var order_mode = 'single';
  if(mode = this.table_element.attr('order-mode')) order_mode = mode;

  var uorders = this.table_element.find('th[data-order]').map(function(j, head) {
    var uorder = (head.uorder == null ? new DataHead(head) : head.uorder);
    uorder.add_cb(reorder);
    return uorder;
  });
  this.get_uorders = get_uorders;

  this.get_modified_uorders = _get_modified_uorders;
  function _get_modified_uorders() {
    var as_list = {};
    $.each(uorders, function(i, e) {
      if(e.get_modified()) as_list[e.get_modified()] = e;
    });
    var key_list = [];
    for(x in as_list) {
      key_list.push(x);
    }
    var ret_val = [];
    for(x in key_list.sort().reverse()) {
      ret_val.push(as_list[key_list[x]]);
    }
    return ret_val;
  }

  function get_uorders() {
    return uorders;
  }

  function param_serialize(element) {
    switch(order_mode) {
      case 'single':
        if(!element) {
          var modified = _get_modified_uorders();
          if(modified.length >= 1) {
            element = modified[0];
          } else return '';
        }
        return element.param_serialize();
        break;
      case 'multi':
        return $.map(_get_modified_uorders(), function(e) {
          return e.param_serialize();
        }).join('&');
        break;
    }
  }

  function reorder(element) {
    reorder_cb(this, element);
  }
}

function DataHead(head) {
  head.uorder = this;
  this.head_element = $(head);
  this.head_name = this.head_element.attr('data-order');
  this.table_element = this.head_element.parents('[data-table]');
  this.table_name = this.table_element.attr('data-table');

  var modify_tstamp = 0;
  this.set_direction = set_direction;
  this.cycle_direction = cycle_direction;
  var direction_indicator = $('<span>');
  var direction;
  var order_cycles = ['asc', 'desc'];
  if(cyc = this.head_element.attr('order-cycle')) {
    order_cycles = cyc.split(' ');
  }

  var cycle_cbs = [];
  this.add_cb = add_cb;

  this.param_serialize = param_serialize;

  this.get_modified = get_modified;
  function get_modified() {
    return modify_tstamp;
  }
  function set_modified() {
    return modify_tstamp = new Date().getTime();
  }

  function set_direction(dir) {
    set_modified();
    direction = order_cycles.indexOf(dir);
    switch(dir) {
      case 'asc':
        var css_class = 'ui-icon ui-icon-carat-1-n';
        break;
      case 'desc':
        var css_class = 'ui-icon ui-icon-carat-1-s';
        break
      case 'none':
        modified = false;
        break;
      default:
        var css_class = 'ui-icon ui-icon-carat-2-n-s';
    }
    direction_indicator.attr('class', css_class);
  };

  function cycle_direction() {
    set_modified();
    direction = (direction != null ? direction+1 : 0);
    if(direction == order_cycles.length) direction = 0;
    for(var i = 0; i < cycle_cbs.length; i++) {
      cycle_cbs[i](this);
    }
  }

  function add_cb(cb) {
    cycle_cbs.push(cb);
  }

  function param_serialize() {
    return 'uorder_' + this.table_name + '[' + this.head_name + ']=' + order_cycles[direction];
  }

  this.head_element.on('click', function() {
    this.uorder.cycle_direction();
  });
  this.head_element.append(direction_indicator);
}





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
      var uorder = new DataHead(get_data_column(get_data_table(order['table']), order['col'])[0]);
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
  return $('table[data-table]').map(function(i, e) {
    return (e.data_table == null ? new DataTable(e, reorder) : e.data_table);
  });
}

function reorder(table, element) {
  var old_params = $.map(document.params, function(v, k) {
    return [k, v].join('=');
  }).join('&');
  var uorder_param = $.map(document.data_tables, function(e) {
    return e.param_serialize();
  }).join('&');
  location.href = location.pathname + '?' + [old_params, uorder_param].join('&');
}

$(document).ready(function() {
  document.params = get_params();
  strip_uorder_params(document.params);
  document.data_tables = enable_uorder();
});

