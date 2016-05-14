import {ready, dismount} from "push-simple/app";

$(document).ready(ready);
$(document).on('page:load.push-simple', ready);
$(document).on('page:before-change.push-simple', function() {
  dismount();
  $(document).unbind('page:load.push-simple');
});
