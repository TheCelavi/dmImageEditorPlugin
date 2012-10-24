<?php
echo _open('span.viewport');
    echo __($label);
    echo _open('select.tool.viewport', array('json'=>array('settings'=>$settings)));
        foreach ($settings['sizes'] as $key=>$value) {
            if ($key == $canvas_width . '_' . $canvas_height) {
                echo _tag('option', array('value'=>$key, 'selected'=>'selected'), $value);
            } else {
                echo _tag('option', array('value'=>$key), $value);
            }
        }
    echo _close('select');
echo _close('span');