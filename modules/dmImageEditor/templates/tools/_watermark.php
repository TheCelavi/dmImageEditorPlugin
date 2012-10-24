<?php
echo _open('div.dmImageEditorPluginTool.watermark.clearfix', array('style'=>'display:none'));
    echo _tag('strong', __('Watermark image settings'));
    echo _tag('div.watermark_drop', __('Drag & drop image here from IMAGE bar to add watermark.'));
    echo _open('div.watermark_form', array('style'=>'display: none;'));
    $table = _table();
    $table->body(array(
        __('Use absolute positioning'),
        _tag('input.use_absolute_positioning', array('type'=>'checkbox'))
    ));
    echo $table;
    
    $table = _table();
    $table->body(array(
        __('Relative position'),
        _tag('select.relative_position',             
            _tag('option', array('value'=>'top-left'), __('Top left')).
            _tag('option', array('value'=>'top-center'), __('Top center')).
            _tag('option', array('value'=>'top-right'), __('Top right')).            
            _tag('option', array('value'=>'middle-left'), __('Middle left')).
            _tag('option', array('value'=>'middle-center'), __('Middle center')).
            _tag('option', array('value'=>'middle-right'), __('Middle right')).
            _tag('option', array('value'=>'bottom-left'), __('Bottom left')).
            _tag('option', array('value'=>'bottom-center'), __('Bottom center')).
            _tag('option', array('value'=>'bottom-right'), __('Bottom right'))            
        ),
        __('Opacity'),
        _tag('input.opacity', array('type'=>'text', 'size'=>3, 'value'=>'100'))
    ));    
    echo _open('div.relative_positioning', array('style'=>'display: block;'));
    echo $table; 
    echo _close('div');
    
    $table = _table();
    $table->body(array(
        __('Top'),
        _tag('input.top', array('type'=>'text', 'size'=>3, 'value'=>0)),
        __('Left'),
        _tag('input.left', array('type'=>'text', 'size'=>3, 'value'=>0)),
        __('Opacity'),
        _tag('input.opacity', array('type'=>'text', 'size'=>3, 'value'=>'100'))
    ));
    echo _open('div.absolute_positioning', array('style'=>'display: none;'));
    echo $table;
    echo _close('div');   
    echo _close('div');
    $table = _table();
    $table->body(array(        
        _tag('button.apply_button', __('Apply')),_tag('button.cancel_button', __('Cancel'))
    ));
    echo $table;
    

echo _close('div');