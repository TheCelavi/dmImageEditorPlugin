<?php

echo _open('span.image_quality');
    echo __($label);
    echo _open('select.tool.image_quality', array('json'=>array('settings'=>$settings)));
        foreach ($settings['quality_values'] as $key => $value) {
            if ($key == $settings['default_quality']) {
                echo _tag('option', array('value'=>$key, 'selected'=>'selected'), $value);
            } else {
                echo _tag('option', array('value'=>$key), $value);
            }
        }
    echo _close('select');
echo _close('span');