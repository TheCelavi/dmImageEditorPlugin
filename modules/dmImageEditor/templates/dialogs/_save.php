<?php

echo _open('div.dm.dmImageEditorPlugin.dmImageEditorPluginDialog.saveDialog');
    echo _tag('p',
            _tag('div.question', __('Do you want to save changes?')).
            _tag('div.help', __('NOTE: You will overwrite the original image. This can not be undone.'))                
         );
echo _close('div');

