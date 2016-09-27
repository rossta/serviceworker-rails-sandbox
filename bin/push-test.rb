#!/usr/bin/env ruby

system(%Q|curl --header "Authorization: key=#{ENV['GOOGLE_CLOUD_MESSAGE_API_KEY']}" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"fs...Tw:APA...SzXha\"]}"|

       "https://android.googleapis.com/gcm/send/eTPnktKJNT4:APA91bFOExq07-yfmOJIlTbTVkbqxCBMRr6cBjJsnVR3l8AWPe_i_sOgouZd3ZWNRo5C9y9pw4aqx6f0LFK-tU1P1mMrD6ZIzfFHQO5sl5OKO7y4byVWjgU5Q5ZyLy7425OQZ70gax6T"
