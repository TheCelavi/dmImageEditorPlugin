<?php
echo _open('div.dmImageEditorPluginTool.resize.clearfix', array('style'=>'display:none'));
    echo _tag('strong', __('Resize image settings'));
    
    
    $table = _table();
    $table->body(array(
        __('Width'),
        _tag('input.width', array('type'=>'text', 'size'=>3)),
        __('Resize method'),
        _tag('select.resize_method', 
                _tag('option', array('value'=>'fit'), __('Fit')).
                _tag('option', array('value'=>'center'), __('Center')).
                _tag('option', array('value'=>'scale', 'selected'=>'selected'), __('Scale')).
                _tag('option', array('value'=>'inflate'), __('Inflate')).
                _tag('option', array('value'=>'left'), __('Left')).
                _tag('option', array('value'=>'right'), __('Right')).
                _tag('option', array('value'=>'top'), __('Top')).
                _tag('option', array('value'=>'bottom'), __('Bottom'))
        ),
        _tag('span.background', array('style'=>'display: none'),__('Background')),
        _tag('input.background', array('type'=>'text', 'size'=>6, 'style'=>'display: none')),
    ));
    $table->body(array(
        __('Height'),
        _tag('input.height', array('type'=>'text', 'size'=>3)),
         __('Constrain proportions'),
        _tag('input.constrain_proportion', array('type'=>'checkbox', 'checked'=>'checked')),
        '',
        ''
    ));
    $table->body(array(        
        _tag('button.apply_button', __('Apply')),_tag('button.cancel_button', __('Cancel')),'','','',''
    ));
    echo $table;

echo _close('div');