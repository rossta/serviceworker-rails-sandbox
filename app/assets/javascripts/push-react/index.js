import {ready, dismount} from "push-react/app";

$(document).ready(ready);
$(document).on('page:load.push-react', ready);
$(document).on('page:before-change.push-react', function() {
  dismount();
  $(document).unbind('page:load.push-react');
});
