import { ready as companion } from 'cache-then-network/companion';
import { ready as init } from 'cache-then-network/init';

function ready() {
  companion();
  init();
}

$(document).ready(ready);
$(document).on('page:load.cache-then-network', ready);
$(document).on('page:before-change.cache-then-network', function() {
  $(document).unbind('page:load.cache-then-network');
});
