<?php
/**
 * @author TheCelavi
 */
class dmImageEditorTransformersCrop extends dmImageEditorTransformers {
    public function transform(sfImage $image, array $settings) {
        return $image->crop($settings['left'], $settings['top'], $settings['width'], $settings['height']);
    }
}
