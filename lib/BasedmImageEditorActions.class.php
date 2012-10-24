<?php
/**
 * @author TheCelavi
 */
class BasedmImageEditorActions extends dmBaseActions {
    
    public function executeIndex(dmWebRequest $request) {
        $imageEditor = $this->getService('image_editor');
        $this->editor = $imageEditor->renderImageEditor();
    }
    
    public function executeLoadImage(dmWebRequest $request) {
        if (!$request->hasParameter('sessionId') || $request->getParameter('sessionId') == '') $sessionId = $this->generateSessionId ();
        else $sessionId = $request->getParameter('sessionId');
        
        if ($request->hasParameter('doSave') && $request->getParameter('doSave')) {
            if ($request->hasParameter('fileName') && $request->getParameter('fileName')) {
                return $this->saveImageAsCopy($request);
            } else {
                return $this->saveImage($request);
            }                
        }
        
        $imageEditor = $this->getService('image_editor');
        
        try {
            $resource = dmContext::getInstance()->getServiceContainer()->getService('media_resource')->initialize($request->getParameter('imageId'));
            $source = dmOs::join(sfConfig::get('sf_web_dir'), $resource->getWebPath());
            $destination = $this->getDestination($source, $sessionId);
        } catch (Exception $e) {
            return $this->renderError(sprintf('Could not load image from source %s', $request->getParameter('imageId')));
        }
        try {
            $imagePath = $imageEditor->transformImage(
                    $source, 
                    $destination, 
                    (($request->hasParameter('actions')) ? $request->getParameter('actions') : null),
                    (($request->hasParameter('imageQuality')) ? $request->getParameter('imageQuality') : dmConfig::get('image_resize_quality', 90))
                );
        } catch (Exception $e) {
            return $this->renderError($e->getMessage());
        }
        return $this->renderJson(array(
            'error' => false,
            'src' => $imagePath,
            'sessionId' => $sessionId
        ));
        
    }
    
    protected function saveImage(dmWebRequest $request) {
        $imageEditor = $this->getService('image_editor');
        try {
            $resource = dmContext::getInstance()->getServiceContainer()->getService('media_resource')->initialize($request->getParameter('imageId'));
            $source = dmOs::join(sfConfig::get('sf_web_dir'), $resource->getWebPath());          
        } catch (Exception $e) {
            return $this->renderError(sprintf('Could not load image from source %s', $request->getParameter('imageId')));
        }
        try {
            $imagePath = $imageEditor->transformImage(
                    $source, 
                    $source, 
                    (($request->hasParameter('actions')) ? $request->getParameter('actions') : null),
                    (($request->hasParameter('imageQuality')) ? $request->getParameter('imageQuality') : dmConfig::get('image_resize_quality', 90))
                );
        } catch (Exception $e) {
            return $this->renderError($e->getMessage());
        }
        return $this->renderJson(array(
            'error' => false,
            'src' => $imagePath,
            'sessionId' => $request->getParameter('sessionId'),
            'saved' => true
        ));
    }

    public function saveImageAsCopy(dmWebRequest $request) {
        $imageEditor = $this->getService('image_editor');        
        $originalMedia = DmMediaTable::getInstance()->findOneByIdWithFolder(str_replace('media:', '', $request->getParameter('imageId')));
        $folder = $originalMedia->getFolder();
        
        try {
            $resource = dmContext::getInstance()->getServiceContainer()->getService('media_resource')->initialize($request->getParameter('imageId'));
            $source = dmOs::join(sfConfig::get('sf_web_dir'), $resource->getWebPath());          
        } catch (Exception $e) {
            return $this->renderError(sprintf('Could not load image from source %s', $request->getParameter('imageId')));
        }
        
        if ($folder->hasFile($request->getParameter('fileName'))) {
            return $this->renderError(sprintf('The file %s already exists on web path %s!', $request->getParameter('fileName'), $folder->getRelPath()));
        }
        if (!$folder->isWritable()) {
            return $this->renderError(sprintf('The folder %s is not writable!', $folder->getRelPath()));
        }
        
        try {
            $imagePath = $imageEditor->transformImage(
                    $source, 
                    dmOs::join($folder->getFullPath(), $request->getParameter('fileName')), 
                    (($request->hasParameter('actions')) ? $request->getParameter('actions') : null),
                    (($request->hasParameter('imageQuality')) ? $request->getParameter('imageQuality') : dmConfig::get('image_resize_quality', 90))
                );
        } catch (Exception $e) {
            return $this->renderError($e->getMessage());
        }
        
        $mimeTypeResolver = dmContext::getInstance()->getServiceContainer()->getService('mime_type_resolver');
        
        $imgObj = new DmImageEditorImage();
        $imgObj->setFolder($folder);
        $imgObj->setFile($request->getParameter('fileName'));
        $imgObj->setMime($mimeTypeResolver->getByFilename($imagePath));
        $imgObj->setSize(filesize(dmOs::join(sfConfig::get('sf_web_dir'),$imagePath)));
        
        $dimensions = getimagesize(dmOs::join(sfConfig::get('sf_web_dir'),$imagePath));
        $imgObj->setDimensions($dimensions[0].'x'.$dimensions[1]);
        if ($request->hasParameter('copyrights')) {
            $copyInfo = $request->getParameter('copyrights');
            $imgObj->setAuthor($copyInfo['author']);
            $imgObj->setLicense($copyInfo['license']);
            $imgObj->setLegend($copyInfo['legend']);
        }        
        
        try {
            $imgObj->save();
        } catch (Exception $e) {
            unlink(dmOs::join(sfConfig::get('sf_web_dir'),$imagePath));
            return $this->renderError($e->getMessage());
        }
        
        return $this->renderJson(array(
            'error' => false,
            'src' => $imagePath,
            'sessionId' => $request->getParameter('sessionId'),
            'saved' => true
        ));
    }

    protected function generateSessionId() {
        return md5(date(DATE_RFC822).dmString::random());
    }
    
    protected function getDestination($source, $sessionId) {
        $info = pathinfo($source);
        return dmOs::join($info['dirname'], '/.thumbs/', $info['filename'].'_'.$sessionId.'.'.$info['extension']);
    }

    protected function renderError($message) {
        return $this->renderJson(array(
            'message' => $message,
            'error' => true,
            'src' => '',
            'sessionId'=>null
        ));
    }
}

