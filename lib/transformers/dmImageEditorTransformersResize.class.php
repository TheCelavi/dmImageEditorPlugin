<?php
/**
 * @author TheCelavi
 */
class dmImageEditorTransformersResize extends dmImageEditorTransformers {
    
    public function transform(sfImage $image, array $settings){
        if ($settings['method'] != 'fit') $image->thumbnail($settings['width'], $settings['height'], $settings['method']);
        else $image->thumbnail($settings['width'], $settings['height'], $settings['method'], $settings['background']);        
        return $image;
    }
    
}
