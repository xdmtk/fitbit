<?php
    $uid = $_GET["c391mxZFbb4"];
    $calories = $_GET["3vKfdEE9BzDrk"];
    $burned = $_GET["29sndddd8291"];
    $utc_str = $_GET["mc99z32kmss"];
    $nl = "<br>";


    $nick_data_loc = "/var/www/html/laravel/382mdcsdskmue382/222smxwim39111mdnd.dat";



    if (is_numeric($uid) && is_numeric($calories) && is_numeric($utc_str)) {
        if ($uid == "0") {
            writeCalData($nick_data_loc, $calories, $utc_str, $burned);
        //    trimExcess($nick_data_loc);
        }
    }
    

    function trimExcess($path) {
        $line_array = file($path);
        $trimmed_lines = [];
        foreach ($line_array as $line) {
            $trim_len = 18;
            if (strlen($line) <= 18) {
                $trim_len = strlen($line);
            }
            
            if (strlen(trim($line))) {
                array_push($trimmed_lines, substr($line, 0, $trim_len));
            }
        }
        $handle = fopen($path, "w");
        flock($handle, LOCK_EX);
        foreach ($trimmed_lines as $line) {
            fwrite($handle, $line . "\n");
        }
        flock($handle, LOCK_UN);
        fclose($handle);
    }


    function writeCalData($path, $calories, $utc_date, $burned) {
        // Get incoming date
        $date = gmdate("m/d/y", (mktime()-28800));

        // Read file into array
        $line_array = file($path);


        if (count($line_array)) {
            $last_entry = $line_array[count($line_array)-1];

            // Split CSV style and analzyze first value (date)
            $vals = explode("," , $last_entry);

            // If the value is the same as the incoming, only update the entry, do
            // not create new entry
            if ($vals[0] == $date) {

                $vals[1] = $calories;
                $vals[2] = $burned;
                $last_entry = implode("," , $vals);
                
                // Update last entry with new cals
                $line_array[count($line_array)-1] = $last_entry;

                $write_handle = fopen($path, "w");
                foreach ($line_array as $line_w) {
                    if (count($line_w)) {
                        fwrite($write_handle, $line_w);
                    }
                }
                return;
            }
            else {
                $handle = fopen($path, "a+");
                flock($handle, LOCK_EX);
                fwrite($handle, $date . "," . $calories . "," . $burned . "\n");
                flock($handle, LOCK_UN);
                fclose($handle);
            }

        } else {
            $handle = fopen($path, "w+");
            fwrite($handle, $date . "," . $calories .  "," . $burned . "\n");
            fclose($handle);
        }



    }










?>
