<?php

$table = _table();
$table->body(array(
    _tag('label', __('File name')),
    _tag('input.filename', array('type'=>'text')).
    _tag('select.extension', 
        _tag('option', array('value'=>'.jpg'), __('.jpg')).
        _tag('option', array('value'=>'.png'), __('.png')).
        _tag('option', array('value'=>'.gif'), __('.gif')).
        _tag('option', array('value'=>'.svg'), __('.svg')).
        _tag('option', array('value'=>'.tiff'), __('.tiff'))
    )
));
$table->body(array(
    _tag('label', __('Legend')),
    _tag('input.legend', array('type'=>'text'))
));
$table->body(array(
    _tag('label', __('Author')),
    _tag('input.author', array('type'=>'text'))
));

$table->body(array(
    _tag('label', __('License')),
    _tag('input.license', array('type'=>'text'))
));

echo _open('div.dm.dmImageEditorPlugin.dmImageEditorPluginDialog.saveAsDialog');
    echo _tag('p',
            _tag('div.question', __('Do you want to save changes?')).
            _tag('div', $table).
            _tag('div.help', __('NOTE: You will create the copy of the image and continue to work with it.'))                
         );
echo _close('div');

