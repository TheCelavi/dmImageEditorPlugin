;
(function($) {
    var methods = {
        init: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (data) return;
            
            $this.data('dmImageEditorPlugin', {
                canvas              :               $this.find('div.image_canvas'),
                statusBar           :               $this.find('div.status_bar_help'),
                image               :               null,
                changesApplied      :               false,
                undoStack           :               new Array(),
                redoStack           :               new Array(),
                sessionId           :               ''
            });
            
        //methods['deserialize'].apply($this,[]);
        },
        registerTools: function() {
            
        },
        loadImage: function(imageId, actions) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $.ajax(dm_configuration.script_name + '+/dmImageEditorAdmin/loadImage', { 
                type        :           'get',
                dataType    :           'json',
                data        :           $.extend({}, {
                    dm_image_id     :       'media:' + imageId,
                    sessionId       :       data.sessionId  
                }, actions),
                error       :      function(xhr, textStatus, errorThrown) {                    
                    $.dm.ctrl.errorDialog('Error when loading image', xhr.responseText);
                },
                success: function(response) {
                    if (response.error) {
                        $.dm.ctrl.errorDialog('Error when loading image', xhr.responseText);
                    } else {
                        if (data.image) {
                            data.image.prop('src', response.src);
                        } else {
                            data.image = $('<img />').prop('src', response.src);
                            data.canvas.append(data.image);
                        };
                        data.sessionId = response.sessionId;
                        $this.data('dmImageEditorPlugin', data);
                        methods['setStatusBar'].apply($this,['ready']);
                    };
                }
            });
        },
        setStatusBar: function(message) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            switch(message){
                case 'ready': {
                        data.statusBar.text('Ready...');
                }break;
                case undefined: {
                        data.statusBar.text('Drag & drop image from IMAGE bar to start with editing.')
                }break;
                default: {
                        data.statusBar.text(message);
                }break;
            };
        },
        executeAction: function(action) {
            // TODO
        }
    };
    
    var privateMethods = {
        clearImage: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            data.image = null;
            data.changesApplied = false;
            data.undoStack = new Array();
            data.redoStack = new Array();
            data.canvas.children().remove();
            $this.data('dmImageEditorPlugin', data);
        },
        initDroppableCanvas: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            data.canvas.droppable({
                accept      :       '#dm_media_bar li.file.image',
                tolerance   :       'touch',
                greedy      :       true,
                drop        :       function(event, ui) {
                    $(this).removeClass('dm_image_editor_drag_image_over').addClass('transparent_background');
                    var imageId = ui.draggable.attr('id').replace(/dmm/, '');
                    if (data.image && data.changesApplied) {
                        
                    } else {
                        
                    };
                    
                    
                    
//                    function doLoad() {
//                        self.loadImage(ui.draggable.attr('id').replace(/dmm/, ''));                   
//                        $(this).removeClass('empty');
//                        self._context.find('.status_bar_help').text('Ready...'); // TODO translation
//                    };
//                    
//                    if (!$(this).hasClass('empty')) {
//                        if (self._changesApplied) {
//                            if (confirm('Do you want to discard the changes and load different picture?')) { // TODO translation
//                                doLoad();
//                            };
//                        } else {
//                            doLoad();
//                        };
//                    } else {
//                        doLoad();
//                    };
                },
                over        :       function(event, ui) {
                    $(this).addClass('dm_image_editor_drag_image_over').removeClass('transparent_background');
                },
                out         :       function(event, ui) {
                    $(this).removeClass('dm_image_editor_drag_image_over').addClass('transparent_background');
                }
            });
        }
    };
    
    $.fn.dmImageEditorPlugin = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.dmImageEditorPlugin' );
        };   
    };
     
})(jQuery);



$.dm.imageEditor = {
    _context: null,
    _changesApplied: false,
    _canvas: null,
    init: function(context) {
        var self = this;
        self._context = $(context);
        self._canvas = self._context.find('div.image_canvas');        
        self._canvas.droppable({
            accept      :       '#dm_media_bar li.file.image',
            tolerance   :       'touch',
            greedy      :       true,
            drop        :       function(event, ui) {
                $(this).removeClass('dm_image_editor_drag_image_over').addClass('transparent_background');
                    
                function doLoad() {
                    self.loadImage(ui.draggable.attr('id').replace(/dmm/, ''));                   
                    $(this).removeClass('empty');
                    self._context.find('.status_bar_help').text('Ready...'); // TODO translation
                };
                    
                if (!$(this).hasClass('empty')) {
                    if (self._changesApplied) {
                        if (confirm('Do you want to discard the changes and load different picture?')) { // TODO translation
                            doLoad();
                        };
                    } else {
                        doLoad();
                    };
                } else {
                    doLoad();
                };
            },
            over        :       function(event, ui) {
                $(this).addClass('dm_image_editor_drag_image_over').removeClass('transparent_background');
            },
            out         :       function(event, ui) {
                $(this).removeClass('dm_image_editor_drag_image_over').addClass('transparent_background');
            }
        });
        
        self._context.find('.action_cancel').click(function(){
            function doClear() {
                self._canvas.addClass('empty').find('img').remove();
                self._changesApplied = false;
                self._context.find('.status_bar_help').text('Drag & drop image from IMAGE bar to start with editing.'); // TODO translation
                self.closeSettingsBar();
            };
            if (self._changesApplied) {
                if (confirm('Do you want to discard the changes?')) doClear(); // TODO translation
            } else {
                doClear();
            };
        });
        // TODO Canvas loads image
        self._context.find('div.toolbar .tools.tool_resize').click(function(){
            if (self._canvas.find('img').length > 0) self.imageActions.resize();
        });
        self._context.find('div.toolbar .tools.tool_crop').click(function(){
            if (self._canvas.find('img').length > 0) self.imageActions.crop();
        });
        self._context.find('div.toolbar .tools.tool_rotate').click(function(){
            if (self._canvas.find('img').length > 0) self.imageActions.rotate();
        });
        self._context.find('div.toolbar .tools.tool_watermark').click(function(){
            if (self._canvas.find('img').length > 0) self.imageActions.watermark();
        });
    },
    loadImage: function(id, actions) {
        var $canvas = this._canvas;
        $.ajax(dm_configuration.script_name + '+/dmImageEditorAdmin/loadImage', { 
            type        :           'get',
            dataType    :           'json',
            data        :           $.extend({}, {
                dm_image_id: 'media:' + id
            }, actions),
            error       :      function(xhr, textStatus, errorThrown) {                    
                $.dm.ctrl.errorDialog('Error when loading image', xhr.responseText);
            },
            success: function(data) {
                if (data.error) {
                    $.dm.ctrl.errorDialog('Error when loading image', xhr.responseText);
                } else {
                    if ($canvas.find('img.master').length != 0) $canvas.find('img.master').prop('src', data.src);
                    else $canvas.append($('<img class="master" data-image-width="' + data.width + '" data-image-height="' + data.height + '" src="' + data.src + '" />'));
                };
            }
        });
    },
    openSettingsBar: function(which) {
        var self = this, $bar = self._context.find('div.tools_settings_bar');        
        if ($bar.hasClass('working')) return; // Prevent thread lock... :)
        $bar.addClass('working');
        if ($bar.hasClass('open')) {
            if ($bar.find('.' + which + '_settings').css('display') == 'block') {
                $bar.removeClass('working');
                return;
            }; 
            $bar.removeClass('open');  
            $bar.slideUp('fast', function(){
                $bar.find('> div').css('display', 'none');
                $bar.addClass('close');
                $bar.removeClass('working');
                self.openSettingsBar(which);
            });            
        } else {            
            $bar.removeClass('close');
            $bar.find('.' + which + '_settings').css('display','block');
            $bar.slideDown('fast');
            $bar.addClass('open');
            $bar.removeClass('working');
        };        
    },
    closeSettingsBar: function() {
        var self = this, $bar = self._context.find('div.tools_settings_bar');
        $bar.removeClass('open');  
        $bar.slideUp('fast', function(){
            $bar.find('> div').css('display', 'none');
            $bar.addClass('close');
            $bar.removeClass('working');
        });            
    },
    imageActions: {
        resize: function() {
            var self = $.dm.imageEditor;
            self._context.find('.resize_settings input.width').val(self._canvas.find('img.master').data('image-width'));
            self._context.find('.resize_settings input.height').val(self._canvas.find('img.master').data('image-height'));
            self.openSettingsBar('resize');
        },
        crop: function() {
            var self = $.dm.imageEditor;
            self.openSettingsBar('crop');
        },
        rotate: function() {
            var self = $.dm.imageEditor;
            self.openSettingsBar('rotate');
        },
        watermark: function() {
            var self = $.dm.imageEditor;
            self.openSettingsBar('watermark');
        }
    }
    
}