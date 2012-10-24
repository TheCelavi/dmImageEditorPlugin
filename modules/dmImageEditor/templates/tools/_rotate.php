<?php
echo _open('div.dmImageEditorPluginTool.rotate.clearfix', array('style'=>'display:none'));
    echo _tag('strong', __('Rotate image settings'));
    
    
    $table = _table();
    $table->body(array(
        __('Rotation'),
        _tag('select.rotate', 
            _tag('option', array('value'=>'90'), '90°').
            _tag('option', array('value'=>'180'), '180°').
            _tag('option', array('value'=>'270'), '270°').
            _tag('option', array('value'=>'flip_vertical'), __('Flip vertical')).
            _tag('option', array('value'=>'flip_horizontal'), __('Flip horizontal'))
        )
    ));
    $table->body(array(        
        _tag('button.apply_button', __('Apply')),_tag('button.cancel_button', __('Cancel'))
    ));
    echo $table;

echo _close('div');