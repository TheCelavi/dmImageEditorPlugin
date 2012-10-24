<?php
/**
 * @author TheCelavi
 */
class dmImageEditorService extends dmConfigurable  {
    
    protected $helper;
    protected $i18n;

    public function __construct($options) {
        $this->helper = dmContext::getInstance()->getServiceContainer()->getService('helper');
        $this->i18n = dmContext::getInstance()->getServiceContainer()->getService('i18n');
        $this->initialize($options);
    }
    
    public function setSkin($skin) {
        $availableSkins = array_keys(sfConfig::get('dm_dmImageEditorPlugin_skins'));
        if (in_array($skin, $availableSkins)) $this->setOption ('skin', $skin);
        return $this;
    }

    public function getSkin() {
        return $this->getOption('skin');
    }

    public function transformImage($source, $destination, array $actions = null, $quality = 90) {
        $mimeTypeResolver = dmContext::getInstance()->getServiceContainer()->getService('mime_type_resolver');
        try {
            $img = new sfImage($source, $mimeTypeResolver->getByFilename($source));
        } catch (Exception $e) {
            throw new dmException(sprintf('There is no image on given path: %s', $source));
        }
        if (!is_null($actions)) {
            foreach ($actions as $action) {
                try {
                    $transformer = dmContext::getInstance()->getServiceContainer()->getService('image_editor_transform_' . $action['action']);
                    $img = $transformer->transform($img, $action['settings']);
                } catch (Exception $e) {
                    throw new dmException(sprintf('Image transform %s is not available.', dmString::humanize($action['action'])));
                }
            }
        }
        $img->setQuality($quality);
        $img->saveAs($destination);
        return str_replace(sfConfig::get('sf_web_dir'), '', $destination);
    }

    public function renderImageEditor($skin = null) {
        if (!is_null($skin)) $this->setSkin($skin);
        
        $skinSettings = $this->parseImageEditorSkinConfiguration($this->getSkin());        
        $this->loadImageEditorAssets($skinSettings['loadedTools']);
        return $this->helper->renderPartial('dmImageEditor', 'image_editor', array(
            'canvas_width' => $skinSettings['canvas_width'],
            'canvas_height' => $skinSettings['canvas_height'],
            'loadedTools' => $skinSettings['loadedTools'],
            'actionBar' => $skinSettings['actionBar'],
            'toolBar' => $skinSettings['toolBar']
        )); 
    }
    
    protected function loadImageEditorAssets($tools) {
        $response = dmContext::getInstance()->getResponse();
        $javascripts = array();
        $css = array();
        foreach ($tools as $tool) {
            $key = $tool['key'];
            $assetsConfig = sfConfig::get('dm_dmImageEditorPlugin_view');
            if (isset($assetsConfig['js'][$key])) $javascripts = array_merge ($javascripts, $assetsConfig['js'][$key]);
            if (isset($assetsConfig['css'][$key])) $css = array_merge ($css, $assetsConfig['css'][$key]);
        }
        $javascripts = array_merge($javascripts, $assetsConfig['js']['core']);
        $css = array_merge($css, $assetsConfig['css']['core']);
        foreach ($javascripts as $js) $response->addJavaScript($js);
        foreach ($css as $c) $response->addStylesheet($c);
    }

    protected function parseImageEditorSkinConfiguration($skin) {
        $result = array();
        $skinConfiguration = sfConfig::get('dm_dmImageEditorPlugin_skins');
        $skinConfiguration = $skinConfiguration[$skin];
        
        $result['loadedTools'] = array();
        foreach ($skinConfiguration['tools'] as $key=>$value) {
            $result['loadedTools'][] = array(
                'key' => $key,
                'settings' => $value,
                'name' => sprintf('dmImageEditorPluginTool%s', dmString::camelize($key))
            );
        }
        $result['actionBar'] = explode('|', $skinConfiguration['actionBar']);
        $result['toolBar'] = array();
        foreach(($toolbarItems = explode('|', $skinConfiguration['toolBar'])) as $button) {
            
            $result['toolBar'][] = array(
                'key' => $button,
                'label' => ((isset($skinConfiguration['buttons']) && isset($skinConfiguration['buttons'][$button]) && isset($skinConfiguration['buttons'][$button]['label'])) ? $this->i18n->__($skinConfiguration['buttons'][$button]['label']) : dmString::humanize($button)),
                'settings' => ((isset($skinConfiguration['buttons']) && isset($skinConfiguration['buttons'][$button]) && isset($skinConfiguration['buttons'][$button]['settings'])) ? $skinConfiguration['buttons'][$button]['settings'] : null)
            );
        }
        
        $result['canvas_width'] = $skinConfiguration['canvas_width'];
        $result['canvas_height'] = $skinConfiguration['canvas_height'];
        
        return $result;
    }
    
    protected function initialize(array $options) {        
        $this->configure($options);
    }
}


