<?php
echo _open('div.dm.dmImageEditorPlugin', array('json'=>array('loadedTools'=>$loadedTools, 'imageQuality'=>  dmConfig::get('image_resize_quality', 90)), 'style'=>sprintf('width: %s;', $canvas_width)));
    echo _open('div.toolbox.clearfix');
        echo _open('div.toolbox-tools.clearfix');
            foreach ($toolBar as $button) {
                switch($button['key']){
                    case 'separator': {
                        echo _tag('div.separator', '&nbsp;');
                    }break;
                    case 'new-line': {
                        echo _tag('div.new-line.clearfix');
                    }break;
                    case 'viewport': {
                        dm_render_partial('dmImageEditor','viewport', array(
                            'label'=>$button['label'], 
                            'settings' => $button['settings'],
                            'canvas_width' => $canvas_width,
                            'canvas_height' => $canvas_height
                            ));
                    }break;
                    case 'image-quality': {
                        dm_render_partial('dmImageEditor','image_quality', array(
                            'label'=>$button['label'], 
                            'settings' => $button['settings']
                            ));
                    } break;
                    default: {
                        echo _tag('button.tool.'.$button['key'], array('json'=>array('settings'=>$button['settings'])), $button['label']);
                    }break;
                }
            }
        echo _close('div');
        echo _open('div.toolbox-settings.clearfix', array('style'=>'display:none'));
            foreach ($loadedTools as $tool) {
                dm_render_partial('dmImageEditor', 'tools/_'.$tool['key'], array('settings'=>$tool['settings']));
            }
        echo _close('div');
    echo _close('div');
    
    echo _tag('div.canvas-wrapper',_tag('div.canvas.ready-state', array('style'=>sprintf('height: %s', $canvas_height))));
    
    echo _open('div.actionbox.clearfix');
        echo _tag('div.status-bar', __('Drag & drop image from IMAGE bar to start with editing...'));
        echo _open('div.actions');
            if (in_array('Cancel', $actionBar)) echo _tag('button.cancel', __('Cancel'));
            if (in_array('Save', $actionBar)) echo _tag('button.save', __('Save'));
            if (in_array('Save as copy', $actionBar)) echo _tag('button.save-as-copy', __('Save as copy'));
        echo _close('div');
    echo _close('div');

    echo _open('div.dialogs', array('style'=>'display: none;'));
        dm_render_partial('dmImageEditor', 'dialogs/_error');
        dm_render_partial('dmImageEditor', 'dialogs/_save');
        dm_render_partial('dmImageEditor', 'dialogs/_save_as');
    echo _close('div');
echo _close('div');