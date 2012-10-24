<?php
/**
 * @author TheCelavi
 */
class dmImageEditorTransformersRotate extends dmImageEditorTransformers {
    
    public function transform(sfImage $image, array $settings) {
        switch ($settings['angle']) {
            case 'flip_vertical': {
                $image->flip();
            } break;
            case 'flip_horizontal': {
                $image->rotate(90);
                $image->flip();
                $image->rotate(270);
            } break;
            default: {
                $image->rotate($settings['angle']);
            } break;
        }
        return $image;
    }
    
}
