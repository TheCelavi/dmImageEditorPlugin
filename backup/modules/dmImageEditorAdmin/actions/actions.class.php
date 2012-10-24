<?php

class dmImageEditorAdminActions extends dmAdminBaseActions {
    
    public function executeIndex(dmWebRequest $request) {
        
    }
    public function executeLoadImage(dmWebRequest $request) {
        
        $mimeTypeResolver = dmContext::getInstance()->getServiceContainer()->getService('mime_type_resolver');
        
        $url = $request->getParameter('dm_image_id');
        $resource = dmContext::getInstance()->getServiceContainer()->getService('media_resource')->initialize($url);
        // TODO Check for errors
        
        $img = new sfImage(sfConfig::get('sf_web_dir').$resource->getWebPath(), $mimeTypeResolver->getByFilename($resource->getWebPath()));
        
        return $this->renderJson(array(
            'error' => false,
            'src' => $resource->getWebPath(),
            'mime' => $mimeTypeResolver->getByFilename($resource->getWebPath()),
            'width' => $img->getWidth(),
            'height' => $img->getHeight()
        ));
    }
}

