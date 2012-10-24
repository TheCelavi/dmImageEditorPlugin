;
(function($) {    
    var methods = {
        init: function(options) {
            var $this = $(this), data = $this.data('dmImageEditorPluginToolRotate');
            if (data) return;
            $this.data('dmImageEditorPluginToolRotate', options);            
            privateMethods['initRotateActivateButton'].apply($this,[]);
            privateMethods['initRotateCancelButton'].apply($this,[]);
            privateMethods['initRotateApplyButton'].apply($this,[]);            
        }
    };
    
    var privateMethods = {              
        initRotateActivateButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolRotate');
            if (!data) methods['init'].apply($this,[]);
            data.button.click(function(){
                if (data.imageEditor.dmImageEditorPlugin('hasImage')) data.imageEditor.dmImageEditorPlugin('openSettingsBar', 'rotate');
                else data.imageEditor.dmImageEditorPlugin('noImageAlert');
            });
        },
        initRotateCancelButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolRotate');
            if (!data) methods['init'].apply($this,[]);
            $this.find('button.cancel_button').click(function(){
                data.imageEditor.dmImageEditorPlugin('closeSettingsBar');
            });
        },
        initRotateApplyButton: function(){
            var $this = $(this), data = $this.data('dmImageEditorPluginToolRotate');
            if (!data) methods['init'].apply($this,[]);  
            $this.find('button.apply_button').click(function(){
                if (privateMethods['isFormValid'].apply($this,[])) {
                    var actionSettings = {
                        angle: $this.find('select.rotate').val()
                    };
                    data.imageEditor.dmImageEditorPlugin('execute', 'rotate', actionSettings);                
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
    
    $.fn.dmImageEditorPluginToolRotate = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.dmImageEditorPluginToolRotate' );
        };   
    };
     
})(jQuery);