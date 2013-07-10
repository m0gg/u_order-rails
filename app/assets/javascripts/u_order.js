
function get_params() {
  var temp_array = document.URL.split('?');
  if(temp_array.length < 2) return [];
  var params = temp_array[1].split('&');
  var par = [];
  $(params).each(function(i, e) {
    if(e.match('uorder')) { par.push(params[i]); }
  })
  return par;
}

function _uorder_parse_param(param) {
  var rep = new RegExp(/\[([a-zA-Z0-9_-]*)\]/g)
  var ev = param.match(rep);
  var ret = {};
  ret['table'] = ev[0].replace(rep, '$1');
  ret['col'] = ev[1].replace(rep, '$1');
  ret['direction'] = param.split('=')[1];
  return ret;
}

$(document).ready(function() {

  $('table[u_order]').each(function() {
    var table = $(this);
    var table_ctx = table.attr('u_order');
    table.find('th[data-order]').each(function() {
      var col = $(this);
      var col_ctx = col.attr('data-order');
      col.click(function() {
        var temp_array = document.URL.split('?');
        var params = 'order[' + table_ctx + ']=' + col_ctx;
        var new_url = document.URL;
        new_url += (temp_array.length > 1 ?  '&' : '?');
        new_url += params;
        window.location.href = new_url;
      })
    })
  });

});