;
(function($) {    
    var methods = {
        init: function(options) {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (data) return;
            $this.data('dmImageEditorPluginToolWatermark', $.extend({}, options, {imageId: null}));            
            privateMethods['initWatermarkActivateButton'].apply($this,[]);
            privateMethods['initWatermarkCancelButton'].apply($this,[]);
            privateMethods['initWatermarkApplyButton'].apply($this,[]);
            privateMethods['initWatermarkUseAbsolutePositioningButton'].apply($this,[]);   
            privateMethods['initWatermarkDroppable'].apply($this,[]);
            privateMethods['initWatermarkTop'].apply($this,[]);
            privateMethods['initWatermarkLeft'].apply($this,[]);
            privateMethods['initWatermarkOpacity'].apply($this,[]);
            privateMethods['initWatermarkRelativePosition'].apply($this,[]);
        }
    };
    
    var privateMethods = {  
        loadImage: function(imageId) {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);
            
            data.imageEditor.block();
            
            $.ajax(dm_configuration.script_name + '+/dmImageEditorAdmin/loadImage', { 
                type        :           'get',
                dataType    :           'json',
                data        :           { imageId: 'media:' + imageId },
                error       :      function(xhr, textStatus, errorThrown) {                    
                    $this.unblock();
                    data.imageEditor.dmImageEditorPlugin('openErrorDialog', ['Error when loading watermark image', xhr.responseText]);                                     
                },
                success: function(response) {                    
                    if (response.error) {
                        data.imageEditor.dmImageEditorPlugin('openErrorDialog', ['Error when loading watermark image', response.message]);  
                        $this.unblock();
                    } else {
                        data.imageId = imageId;
                        $this.data('dmImageEditorPluginToolWatermark', data);
                        privateMethods['setupWatermark'].apply($this,[(response.src + '?' + Math.random())]);
                    };
                }
            });
            
        },
        setupWatermark: function(watermark_image_src) {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);
            var canvas = data.imageEditor.dmImageEditorPlugin('getCanvas');
            var image = data.imageEditor.dmImageEditorPlugin('getImage');
            var watermark_image = $('<img class="watermark_image" />');
            var watermark_wrapper = $('<div class="watermark_wrapper"></div>');
            canvas.append(watermark_wrapper);
            watermark_wrapper.append(image).append(watermark_image);
            watermark_image.prop('src', watermark_image_src);
            watermark_image.load(function(){
                data.imageEditor.unblock();
                if (image.width() <= watermark_image.width() || image.height() <= watermark_image.height()) {
                    alert('This image is too big to be used as watermark.');
                    privateMethods['clearWatermark'].apply($this,[]);
                } else {
                    $this.find('div.watermark_drop').slideUp('fast', function(){
                        $this.find('div.watermark_form').slideDown('fast');
                    });
                    watermark_image.draggable({
                        containment: image, 
                        scroll: false,
                        drag: function(event, ui) {
                            $this.find('input.top').val(ui.position.top);
                            $this.find('input.left').val(ui.position.left);
                        }
                    });
                    watermark_image.draggable('disable').css('opacity','1');
                };                
                data.imageEditor.unblock();
            });
        },
        clearWatermark: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);
            var canvas = data.imageEditor.dmImageEditorPlugin('getCanvas');
            var image = data.imageEditor.dmImageEditorPlugin('getImage');
            canvas.empty();
            canvas.append(image);
            if ($this.find('div.watermark_form').is(':visible')) {
                $this.find('div.watermark_form').slideUp('fast', function(){
                    $this.find('div.watermark_drop').slideDown('fast');
                });
            };
            $this.find('div.watermark_form input.top').val('0');
            $this.find('div.watermark_form input.left').val('0');
            $this.find('div.watermark_form input.opacity').val('100');
            $this.find('div.watermark_form select.relative_position').val('top-left');
            data.imageId = null;
            $this.data('dmImageEditorPluginToolWatermark', data);
        },
        initWatermarkDroppable: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);
            
            $this.find('div.watermark_drop').droppable({
                accept      :       '#dm_media_bar li.file.image',
                tolerance   :       'touch',
                greedy      :       true,
                drop        :       function(event, ui) {
                    $(this).removeClass('hover-state').addClass('ready-state');
                    var imageId = ui.draggable.attr('id').replace(/dmm/, '');
                    privateMethods['loadImage'].apply($this,[imageId]);
                },
                over        :       function(event, ui) {
                    $(this).addClass('hover-state').removeClass('ready-state');
                },
                out         :       function(event, ui) {
                    $(this).removeClass('hover-state').addClass('ready-state');
                }
            });
        },
        initWatermarkActivateButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);
            data.button.click(function(){
                if (data.imageEditor.dmImageEditorPlugin('hasImage')) data.imageEditor.dmImageEditorPlugin('openSettingsBar', 'watermark');
                else data.imageEditor.dmImageEditorPlugin('noImageAlert');
            });
        },
        initWatermarkCancelButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);            
            $this.find('button.cancel_button').click(function(){
                privateMethods['clearWatermark'].apply($this, []);
                data.imageEditor.dmImageEditorPlugin('closeSettingsBar');
            });
        },
        initWatermarkApplyButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('button.apply_button').click(function(){
                if (privateMethods['isFormValid'].apply($this,[])) {
                    var actionSettings = {
                        watermarkImageId: 'media:' + data.imageId,
                        opacity: $this.find('input.opacity').val()
                    };
                    if ($this.find('input.use_absolute_positioning').is(':checked')) {
                        actionSettings.top = $this.find('input.top').val();
                        actionSettings.left = $this.find('input.left').val();
                    } else {
                        actionSettings.relativePosition = $this.find('select.relative_position').val();
                    };                    
                    data.imageEditor.dmImageEditorPlugin('execute', 'watermark', actionSettings);   
                    privateMethods['clearWatermark'].apply($this,[]);
                } else {
                    // TODO ?
                };
            });
        },
        initWatermarkUseAbsolutePositioningButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('input.use_absolute_positioning').click(function(){
                if ($(this).is(':checked')) {
                    data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').draggable('enable');
                    $this.find('div.relative_positioning').slideUp('fast', function(){
                        $this.find('div.absolute_positioning').slideDown('fast');
                    });
                } else {
                    data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').draggable('disable');
                    $this.find('div.absolute_positioning').slideUp('fast', function(){
                        $this.find('div.relative_positioning').slideDown('fast');
                        $this.find('select.relative_position').change();
                    });
                };
            });
        },
        initWatermarkOpacity: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('input.opacity').keyup(function(){
                $this.find('input.opacity').val($(this).val());
                data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').css('opacity', ($(this).val()/100));
            });
        },
        initWatermarkTop: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('input.top').keyup(function(){                
                data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').css('top', $(this).val()+'px');
            });
        },
        initWatermarkLeft: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('input.left').keyup(function(){                
                data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').css('left', $(this).val()+'px');
            });        
        },    
        initWatermarkRelativePosition: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolWatermark');
            if (!data) methods['init'].apply($this,[]); 
            $this.find('select.relative_position').change(function(){
                var relPos = $(this).val().split('-');
                var top = relPos[0];
                var left = relPos[1];
                var imageWidth = data.imageEditor.dmImageEditorPlugin('getImage').width();
                var imageHeight = data.imageEditor.dmImageEditorPlugin('getImage').height();
                var watermarkWidth = data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').width();
                var watermarkHeight = data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').height();
                switch(top) {
                    case  'top':
                        top = 0;
                        break;
                    case 'middle':
                        top = imageHeight / 2 - watermarkHeight / 2; 
                        break;
                    case 'bottom':
                        top = imageHeight - watermarkHeight;
                        break;
                };
                switch(left) {
                    case 'left':
                        left = 0;
                        break;
                    case 'center':
                        left = imageWidth / 2 - watermarkWidth / 2;
                        break;
                    case 'right':
                        left = imageWidth - watermarkWidth;
                        break;
                };
                $this.find('input.left').val(left);
                $this.find('input.top').val(top);
                data.imageEditor.dmImageEditorPlugin('getCanvas').find('img.watermark_image').css('top', top+'px').css('left', left+'px');
            });
        },
        isFormValid: function() {
            return true
            // TODO
        }
    };
    
    $.fn.dmImageEditorPluginToolWatermark = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.dmImageEditorPluginToolWatermark' );
        };   
    };
     
})(jQuery);