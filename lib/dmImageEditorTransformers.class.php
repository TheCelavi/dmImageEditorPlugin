<?php
/**
 * @author TheCelavi
 */
abstract class dmImageEditorTransformers extends dmConfigurable {
    
    public abstract function transform(sfImage $image, array $settings);
    
}
