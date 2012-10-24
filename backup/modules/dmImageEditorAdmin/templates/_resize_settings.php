<?php

echo _open('div.tools_settings_box.resize_settings.clearfix', array('style'=>'display:none'));
    echo _tag('strong', __('Resize image'));
    
    
    $table = _table();
    $table->body(array(
        __('Width'),
        _tag('input.width', array('type'=>'text', 'size'=>3)),
        _tag('input.constrain_proportion', array('type'=>'checkbox')) . ' ' . __('Constrain proportions')              
    ));
    $table->body(array(
        __('Height'),
        _tag('input.height', array('type'=>'text', 'size'=>3)),        
        _tag('button.action_button', __('Apply'))
    ));
    echo $table;

echo _close('div');