<?php
/**
 * @author TheCelavi
 */
class dmImageEditorTransformersWatermark extends dmImageEditorTransformers {
    public function transform(sfImage $image, array $settings) {
        $resource = dmContext::getInstance()->getServiceContainer()->getService('media_resource')->initialize($settings['watermarkImageId']);
        $source = sfConfig::get('sf_web_dir').$resource->getWebPath();
        $mimeTypeResolver = dmContext::getInstance()->getServiceContainer()->getService('mime_type_resolver');        
        
        $ovr = new sfImage($source, $mimeTypeResolver->getByFilename($source));        
        
        if ($settings['opacity'] < 100) {
            $ovr->opacity($settings['opacity']);
            $ovr->transparency('#000000');
            $image->transparency('#000000');
        }
        
        if (isset($settings['relativePosition'])) {
            return $image->overlay($ovr, $settings['relativePosition']);            
        } else {
            return $image->overlay($ovr, array(
                $settings['left'],
                $settings['top']
            ));
        }
    }
}
