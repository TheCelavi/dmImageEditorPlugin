<?php
echo _open('div.dmImageEditorPluginTool.crop.clearfix', array('style'=>'display:none'));
    echo _tag('strong', __('Crop image settings'));
    
    
    $table = _table();
    $table->body(array(
        __('Top'),
        _tag('input.top', array('type'=>'text', 'size'=>3)),
        __('Left'),
        _tag('input.left', array('type'=>'text', 'size'=>3))
    ));
    $table->body(array(
        __('Width'),
        _tag('input.width', array('type'=>'text', 'size'=>3)),
        __('Height'),
        _tag('input.height', array('type'=>'text', 'size'=>3))
    ));
    $table->body(array(        
        _tag('button.apply_button', __('Apply')),_tag('button.cancel_button', __('Cancel')),'',''
    ));
    echo $table;

echo _close('div');