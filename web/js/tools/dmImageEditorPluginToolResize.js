;
(function($) {    
    var methods = {
        init: function(options) {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (data) return;
            $this.data('dmImageEditorPluginToolResize', options);            
            privateMethods['initResizeActivateButton'].apply($this,[]);
            privateMethods['initResizeCancelButton'].apply($this,[]);
            privateMethods['initWidthSettings'].apply($this,[]);
            privateMethods['initHeightSettings'].apply($this,[]);
            privateMethods['initScaleMethodSettings'].apply($this,[]);
            privateMethods['initResizeApplyButton'].apply($this,[]);
            options.imageEditor.bind('dmImageEditorPlugin.onImageLoaded', function(evt, image){
                var data = $this.data('dmImageEditorPluginToolResize');
                $this.find('input.width').val(data.originalWidth = image.width());
                $this.find('input.height').val(data.originalHeight = image.height());
                $this.data('dmImageEditorPluginToolResize', data);
            });
        }
    };
    
    var privateMethods = {      
        initWidthSettings: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (!data) methods['init'].apply($this,[]);
            $this.find('input.width').keyup(function(){
                if ($this.find('input.constrain_proportion').is(':checked')) {
                    var proportion = data.originalWidth / $(this).val();
                    $this.find('input.height').val(Math.floor(data.originalHeight / proportion));
                };
            });
        },
        initHeightSettings: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (!data) methods['init'].apply($this,[]);
            $this.find('input.height').keyup(function(){
                if ($this.find('input.constrain_proportion').is(':checked')) {
                    var proportion = data.originalHeight / $(this).val();
                    $this.find('input.width').val(Math.floor(data.originalWidth / proportion));                    
                };
            });
        },
        initScaleMethodSettings: function() {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (!data) methods['init'].apply($this,[]);
            $this.find('select.resize_method').change(function(){
                if ($(this).val() == 'fit') $this.find('.background').css('display','block');                    
                else $this.find('.background').css('display','none');                    
            });
        },
        initResizeActivateButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (!data) methods['init'].apply($this,[]);
            data.button.click(function(){
                if (data.imageEditor.dmImageEditorPlugin('hasImage'))
                    data.imageEditor.dmImageEditorPlugin('openSettingsBar', 'resize');
                else 
                    data.imageEditor.dmImageEditorPlugin('noImageAlert');
            });
        },
        initResizeCancelButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (!data) methods['init'].apply($this,[]);
            $this.find('button.cancel_button').click(function(){
                data.imageEditor.dmImageEditorPlugin('closeSettingsBar');
                $this.find('input.width').val(data.originalWidth);
                $this.find('input.height').val(data.originalHeight);
            });
        },
        initResizeApplyButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolResize');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('button.apply_button').click(function(){
                if (privateMethods['isFormValid'].apply($this,[])) {
                    var actionSettings = {
                        width: $this.find('input.width').val(),
                        height: $this.find('input.height').val(),
                        method: $this.find('select.resize_method').val(),
                        background: $this.find('input.background').val()
                    };
                    data.imageEditor.dmImageEditorPlugin('execute', 'resize', actionSettings);                
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
    
    $.fn.dmImageEditorPluginToolResize = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.dmImageEditorPluginToolResize' );
        };   
    };
     
})(jQuery);