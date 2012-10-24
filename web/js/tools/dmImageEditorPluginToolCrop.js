;
(function($) {    
    var methods = {
        init: function(options) {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (data) return;
            $this.data('dmImageEditorPluginToolCrop', options);            
            privateMethods['initCropActivateButton'].apply($this,[]);
            privateMethods['initCropCancelButton'].apply($this,[]);
            privateMethods['initWidthSettings'].apply($this,[]);
            privateMethods['initHeightSettings'].apply($this,[]);
            privateMethods['initTopSettings'].apply($this,[]);
            privateMethods['initLeftSettings'].apply($this,[]);
            privateMethods['initCropApplyButton'].apply($this,[]);
            function showCoords(c){               
                $this.find('input.width').val(c.w);
                $this.find('input.height').val(c.h);
                $this.find('input.top').val(c.y);
                $this.find('input.left').val(c.x);
            };
            
            options.imageEditor.bind('dmImageEditorPlugin.onImageLoaded', function(evt, image){
                var data = $this.data('dmImageEditorPluginToolCrop');
                $this.find('input.width').val(data.originalWidth = image.width());
                $this.find('input.height').val(data.originalHeight = image.height());
                $this.find('input.top').val(0);
                $this.find('input.left').val(0);                
            }).bind('dmImageEditorPlugin.onSettingsBarClosed', function(){
                var data = $this.data('dmImageEditorPluginToolCrop');
                if (!data.jcrop_api) return;
                $this.find('input.width').val(data.originalWidth);
                $this.find('input.height').val(data.originalHeight);
                $this.find('input.top').val(0);
                $this.find('input.left').val(0);
                data.jcrop_api.release();
                data.jcrop_api.destroy()
                data.imageEditor.find('img.master').attr('style','');
            }).bind('dmImageEditorPlugin.onSettingsBarOpen', function(evt, which){
                if (which != 'crop') return;
                var data = $this.data('dmImageEditorPluginToolCrop');
                data.jcrop_api = null;
                $(evt.target).find('img.master').Jcrop({
                    bgColor:     '',
                    bgOpacity:   1,
                    onSelect: showCoords,
                    onChange: showCoords
                }, function(){
                    data.jcrop_api = this;
                    $this.data('dmImageEditorPluginToolCrop', data);                    
                });
                $this.data('dmImageEditorPluginToolCrop', data);
            });
        }
    };
    
    var privateMethods = {      
        initWidthSettings: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);
            $this.find('input.width').blur(function(){
                data.jcrop_api.release();
                data.jcrop_api.setSelect([
                    parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.top').val()),
                    parseInt($this.find('input.width').val()) + parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.height').val()) + parseInt($this.find('input.top').val())
                ]);
            });
        },
        initHeightSettings: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);
            $this.find('input.height').blur(function(){
                data.jcrop_api.release();
                data.jcrop_api.setSelect([
                    parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.top').val()),
                    parseInt($this.find('input.width').val()) + parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.height').val()) + parseInt($this.find('input.top').val())
                ]);
            });
        },
        initTopSettings: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);
            $this.find('input.top').blur(function(){
                data.jcrop_api.release();
                data.jcrop_api.setSelect([
                    parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.top').val()),
                    parseInt($this.find('input.width').val()) + parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.height').val()) + parseInt($this.find('input.top').val())
                ]);
            });
        },
        initLeftSettings: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);
            $this.find('input.left').blur(function(){
                data.jcrop_api.release();
                data.jcrop_api.setSelect([
                    parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.top').val()),
                    parseInt($this.find('input.width').val()) + parseInt($this.find('input.left').val()),
                    parseInt($this.find('input.height').val()) + parseInt($this.find('input.top').val())
                ]);
            });
        },
        initCropActivateButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);
            data.button.click(function(){
                if (data.imageEditor.dmImageEditorPlugin('hasImage')) data.imageEditor.dmImageEditorPlugin('openSettingsBar', 'crop');
                else data.imageEditor.dmImageEditorPlugin('noImageAlert');
            });
        },
        initCropCancelButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);
            $this.find('button.cancel_button').click(function(){
                data.imageEditor.dmImageEditorPlugin('closeSettingsBar');
                $this.find('input.width').val(data.originalWidth);
                $this.find('input.height').val(data.originalHeight);
                $this.find('input.top').val(0);
                $this.find('input.left').val(0);
            });
        },
        initCropApplyButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolCrop');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('button.apply_button').click(function(){
                if (privateMethods['isFormValid'].apply($this,[])) {
                    var actionSettings = {
                        width: $this.find('input.width').val(),
                        height: $this.find('input.height').val(),
                        top: $this.find('input.top').val(),
                        left: $this.find('input.left').val()
                    };
                    data.imageEditor.dmImageEditorPlugin('execute', 'crop', actionSettings);                
                } else {
                    // TODO ?
                };
            });
        },
        isFormValid: function() {
            return true
            // TODO
        }
    };
    
    $.fn.dmImageEditorPluginToolCrop = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.dmImageEditorPluginToolCrop' );
        };   
    };
     
})(jQuery);