function get_params() {
  var temp_array = document.URL.split('?');
  if(temp_array.length < 2) return [];
  var params = temp_array[1].split('&');
  var par = [];
  $(params).each(function(i, e) {
    if(e.match('uorder_')) { par.push(params[i]); }
  })
  return par;
}

function _uorder_parse_param(param) {
  var rep = new RegExp(/\[([a-zA-Z0-9_-]*)\]/g)
  var ev = param.match(rep);
  var ret = {};
  ret['table'] = param.replace(/uorder_([a-zA-Z0-9_-]*)\[.*/, '$1');
  ret['col'] = ev[0].replace(rep, '$1');
  ret['direction'] = param.split('=')[1];
  return ret;
}

function _uorder_swap_dir(dir) {
  if(dir == 'desc') {
    return 'asc';
  } else {
    return 'desc';
  }
}

function _uorder_add_or_update_param(order) {
  var new_url = document.URL;
  var hit = false;
  $(document.uorder_params).each(function(i, e) {
    if((e['table'] == order['table']) && (e['col'] == order['col'])) {
      var reg = new RegExp('(uorder_' + e['table'] + '\\[' + e['col'] + '\\]=)[ascde]+');
      new_url = new_url.replace(reg, '$1' + order['direction']);
      hit = true;
    }
  });
  if(!hit) {
    var temp_array = document.URL.split('?');
    var params = 'uorder_' + order['table'] + '[' + order['col'] + ']=' + order['direction'];
    new_url += (temp_array.length > 1 ?  '&' : '?');
    new_url += params;
  }
  window.location.href = new_url;
}

function load_orders() {
  document.uorder_params = $(get_params()).map(function(i, e) { return _uorder_parse_param(e) });
  $(document.uorder_params).each(function(i, e) {
    $('table[u_order=' + e['table'] + ']').find('th[data-order=' + e['col'] + ']').attr('order-direction', e['direction']);
  })
}

function enable_orders() {
  $('table[u_order]').each(function() {
    $(this).find('th[data-order]').each(function(i, e) {
      $(e).click(_click_order);
    })
  });
}

function _click_order() {
  var element = $(this);
  var new_direction = _uorder_swap_dir(element.attr('order-direction'));
  _uorder_add_or_update_param({
    'table': element.parents('table[u_order]').attr('u_order'),
    'col': element.attr('data-order'),
    'direction': new_direction
  })
}

$(document).ready(function() {

  load_orders();
  enable_orders();

});