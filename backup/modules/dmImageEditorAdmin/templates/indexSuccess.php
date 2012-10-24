<?php
echo _open('div#sf_admin_container.dm.image_editor');
    echo _open('div.dm_list_action_bar.dm_list_action_bar_top.clearfix');

        echo _tag('div.toolbar.clearfix',
                    _tag('button.tools.tool_resize', __('Resize')).
                    _tag('button.tools.tool_crop', __('Crop')).
                    _tag('button.tools.tool_rotate', __('Rotate')).
                    _tag('button.tools.tool_watermark', __('Watermark'))
                );
    
        echo _open('div.tools_settings_bar.clearfix', array('style'=>'display:none'));
            
            include_partial('resize_settings');
            include_partial('crop_settings');
            include_partial('rotate_settings');
            include_partial('watermark_settings');
        
        echo _close('div');
    echo _close('div');

        echo _open('div.container');
            echo _tag('div.image_canvas.transparent_background');
        echo _close('div');

    echo _open('div.dm_list_action_bar.dm_list_action_bar_bottom.clearfix');
        echo _tag('div.status_bar_help', __('Drag & drop image from IMAGE bar to start with editing.'));
        echo _tag('div.save_actions',
                    _tag('button.action_cancel', __('Cancel')).
                    _tag('button.action_save_as_copy', __('Save as copy')).
                    _tag('button.action_save', __('Save'))
                );
    echo _close('div');
echo _close('div');
  
