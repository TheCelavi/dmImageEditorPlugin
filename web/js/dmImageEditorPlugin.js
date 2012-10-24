;
(function($) {
    var methods = {
        init: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (data) return;            
            $this.data('dmImageEditorPlugin', {
                canvas              :               $this.find('div.canvas'),
                statusBar           :               $this.find('div.status-bar'),
                toolbox             :               $this.find('div.toolbox'),
                imageId             :               null,
                image               :               null,
                changesApplied      :               false,
                undoStack           :               new Array(),
                redoStack           :               new Array(),
                sessionId           :               '',
                errorDialog         :               null,
                saveDialog          :               null,
                saveAsDialog        :               null,
                imageQuality        :               90
            });
            privateMethods['initTools'].apply($this, []);
            privateMethods['initImageQuality'].apply($this, []);
            privateMethods['initDroppableCanvas'].apply($this, []);
            privateMethods['initCancelButton'].apply($this, []);
            privateMethods['initViewportButton'].apply($this, []);
            privateMethods['initUndoRedo'].apply($this, []);
            privateMethods['initSaveButton'].apply($this, []);
            privateMethods['initSaveAsCopyButton'].apply($this, []);  
        },
        setStatusBarText: function(message) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            switch(message){
                case 'ready': {
                        data.statusBar.text('Ready...');
                }break;
                case undefined: {
                        data.statusBar.text('Drag & drop image from IMAGE bar to start with editing...')
                }break;
                default: {
                        data.statusBar.text(message);
                }break;
            };
        },
        getStatusBarText: function(){
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            return data.statusBar.text();
        },
        openSettingsBar: function(which) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            var $settings = data.toolbox.find('div.toolbox-settings');
            if ($settings.hasClass('working')) return;
            $settings.addClass('working');
            if ($settings.is(':visible')) {
                if ($settings.find('> .' + which).css('display') == 'block') {
                    $settings.removeClass('working');
                    return;
                };
                $settings.slideUp('fast', function(){
                    $settings.find('> div').css('display', 'none');
                    $settings.removeClass('working');                    
                    $this.trigger('dmImageEditorPlugin.onSettingsBarClosed');
                    methods['openSettingsBar'].apply($this,[which]);
                });
            } else {
                $settings.find('> .' + which).css('display', 'block');
                $settings.slideDown('fast', function(){
                    $settings.removeClass('working');                    
                    $this.trigger('dmImageEditorPlugin.onSettingsBarOpen', [which]);
                });
            };
        },
        closeSettingsBar: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            var $settings = data.toolbox.find('div.toolbox-settings');
            $settings.addClass('working');
            $settings.slideUp('fast', function(){
                $settings.find('> div').css('display', 'none');
                $settings.removeClass('working');                
                $this.trigger('dmImageEditorPlugin.onSettingsBarClosed');
            });
        },
        execute: function(action, settings) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            methods['closeSettingsBar'].apply($this,[]);
            data.undoStack.push({
                action: action,
                settings: settings
            });
            privateMethods['loadImage'].apply($this,[data.imageId]);
            privateMethods['updateUndoRedoSaveSaveascopy'].apply($this,[]);
        },
        hasImage: function(){
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            return (data.image == null) ? false : true; 
        },
        getImage: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            return data.image; 
        },
        getCanvas: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            return data.canvas;
        },
        noImageAlert: function(){
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            methods['openErrorDialog'].apply($this,['No image', 'Please, first choose image to edit.']);
        },
        openErrorDialog: function(title, message) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data) methods['init'].apply($this,[]);
            if (!data.errorDialog) {
                data.errorDialog = $this.find('div.dmImageEditorPluginDialog.errorDialog').dialog({                    
                    resizable       :       false,
                    draggable       :       false,
                    modal           :       true,
                    autoOpen        :       false, 
                    position        :       { of: data.canvas },
                    buttons         :       {
                        Ok: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
                data.errorDialog.parent().addClass('dm');
            };
            if (data.errorDialog.dialog('isOpen')) data.errorDialog.dialog('close');
            data.errorDialog.dialog('option', 'title', title);
            data.errorDialog.find('.message').html(message);
            data.errorDialog.dialog('open');            
            $this.data('dmImageEditorPlugin', data);
        }
    };
    
    var privateMethods = {
        initTools: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            var tools = $this.metadata();
            $.each(tools.loadedTools, function(index){
                var tool = tools.loadedTools[index];
                var options = {
                    imageEditor     :   $this,   
                    button          :   $this.find('div.toolbox-tools button.tool.' + tool.key),
                    settings        :   tool.settings
                };
                var $tool = $this.find('div.toolbox-settings div.' + tool.key);
                try {
                    ($tool[tool.name])(options);
                } catch(e) {
                    if (dm_configuration.debug) throw e;
                    else {
                        $this.find('div.toolbox-tools button.tool.' + tool.key).remove();
                        $this.find('div.toolbox-settings div.' + tool.key).remove();
                    };
                };
            })
        },
        initImageQuality: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $this.find('div.toolbox-tools select.tool.image_quality').change(function(){
                data.imageQuality = $(this).val();
                $this.data('dmImageEditorPlugin', data);
                privateMethods['loadImage'].apply($this,[data.imageId]);
            });
            if ($this.find('div.toolbox-tools select.tool.image_quality').length) {
                data.imageQuality = $this.find('div.toolbox-tools select.tool.image_quality').metadata().settings.default_quality;
                $this.data('dmImageEditorPlugin', data);
            };
        },
        initViewportButton: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $this.find('div.toolbox-tools select.tool.viewport').change(function(){
                var sizes = $(this).val().split('_');
                privateMethods['setViewportSize'].apply($this,[sizes[0],sizes[1]]);
            });
        },
        setViewportSize: function(width, height) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $this.css('width', width);
            $this.find('.canvas').css('height', height);
        },
        initCancelButton: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $this.find('.actionbox button.cancel').click(function(){
                if (data.image && data.changesApplied) {
                    if (confirm('Do you want to discard the changes?')) { 
                        privateMethods['clearImage'].apply($this,[]);
                    };
                } else {
                    privateMethods['clearImage'].apply($this,[]);
                };
            });
        },
        initSaveButton: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $this.find('.actionbox button.save').click(function(){
                if (data.undoStack.length) {
                    privateMethods['openSaveDialog'].apply($this, []);
                } else {
                    methods['openErrorDialog'].apply($this, ['No image', 'There is no image to save.']);
                };
            });
        },
        openSaveDialog: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data.saveDialog) {
                data.saveDialog = $this.find('div.dmImageEditorPluginDialog.saveDialog').dialog({                    
                    resizable       :       false,
                    draggable       :       false,
                    modal           :       true,
                    autoOpen        :       false, 
                    title           :       'Save image',
                    position        :       {of  :   data.canvas},
                    buttons         :       {
                        Save: function() {
                            privateMethods['loadImage'].apply($this,[data.imageId, true]);                                
                            $( this ).dialog( "close" );
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
                data.saveDialog.parent().addClass('dm');
            };            
            if (data.saveDialog.dialog('isOpen')) data.saveDialog.dialog('close');
            data.saveDialog.dialog('open');            
            $this.data('dmImageEditorPlugin', data);
        },
        initSaveAsCopyButton: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            $this.find('.actionbox button.save-as-copy').click(function(){
                if (data.undoStack.length) {
                    privateMethods['openSaveAsDialog'].apply($this, []);
                } else {
                    methods['openErrorDialog'].apply($this, ['No image', 'There is no image to save.']);
                };
            });
        },
        openSaveAsDialog: function() {
            function getFileExtension(filename){
                var ext = /^.+\.([^.]+)$/.exec(filename);
                return ext == null ? "" : ext[1];
            }
            
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            if (!data.saveAsDialog) {
                data.saveAsDialog = $this.find('div.dmImageEditorPluginDialog.saveAsDialog').dialog({                    
                    resizable       :       false,
                    draggable       :       false,
                    modal           :       true,
                    autoOpen        :       false, 
                    title           :       'Save image as copy',
                    position        :       {of  :   data.canvas},
                    buttons         :       {
                        Save: function() {
                            // TODO validation
                            var filename = data.saveAsDialog.find('input.filename').val() +  data.saveAsDialog.find('select.extension').val();
                            var copy = {
                                legend: data.saveAsDialog.find('input.legend').val(),
                                author: data.saveAsDialog.find('input.author').val(),
                                license: data.saveAsDialog.find('input.license').val()
                            };
                            privateMethods['loadImage'].apply($this,[data.imageId, true, filename, copy]);
                            $( this ).dialog( "close" );
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
                data.saveAsDialog.parent().addClass('dm');
            };            
            if (data.saveAsDialog.dialog('isOpen')) data.saveAsDialog.dialog('close');
            var filename = data.image.prop('src').split('?')[0];
            data.saveAsDialog.find('select.extension').val('.' + getFileExtension(filename));
            
            filename = filename.replace(/^.*[\\\/]/, '');
            filename = filename.split('_');
            filename.pop();
            data.saveAsDialog.find('input.filename').val(filename.join(''));
            data.saveAsDialog.dialog('open');            
            $this.data('dmImageEditorPlugin', data);
        },
        clearImage: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            methods['closeSettingsBar'].apply($this,[]);
            data.canvas.empty();
            data.image = null;
            data.imageId = null;
            data.sessionId = '';
            data.changesApplied = false;
            data.undoStack = new Array();
            data.redoStack = new Array();           
            privateMethods['updateUndoRedoSaveSaveascopy'].apply($this,[]);
            methods['setStatusBarText'].apply($this,[]);
            $this.data('dmImageEditorPlugin', data);
        },
        initUndoRedo: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');            
            $this.find('button.tool.undo').click(function(){
                if (data.undoStack.length) {
                    data.redoStack.push(data.undoStack.pop());
                    $this.data('dmImageEditorPlugin', data);
                    privateMethods['loadImage'].apply($this, [data.imageId]);
                } else {
                    alert('Nothing to Undo!');
                };
            });
            $this.find('button.tool.redo').click(function(){
                if (data.redoStack.length) {
                    data.undoStack.push(data.redoStack.pop());
                    $this.data('dmImageEditorPlugin', data);
                    privateMethods['loadImage'].apply($this, [data.imageId]);
                } else {
                    alert('Nothing to Redo!');
                };
            });
            privateMethods['updateUndoRedoSaveSaveascopy'].apply($this,[]);
        },
        updateUndoRedoSaveSaveascopy: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');       
            if (data.undoStack.length) {
                $this.find('button.tool.undo').addClass('enabled').removeClass('disabled').prop('disabled', false);
                $this.find('.actionbox button.save').addClass('enabled').removeClass('disabled').prop('disabled', false);
                $this.find('.actionbox button.save-as-copy').addClass('enabled').removeClass('disabled').prop('disabled', false);
            } else {
                $this.find('button.tool.undo').addClass('disabled').removeClass('enabled').prop('disabled', true);
                $this.find('.actionbox button.save').addClass('disabled').removeClass('enabled').prop('disabled', true);
                $this.find('.actionbox button.save-as-copy').addClass('disabled').removeClass('enabled').prop('disabled', true);
            };
            if (data.redoStack.length) {
                $this.find('button.tool.redo').addClass('enabled').removeClass('disabled').prop('disabled', false);
            } else {
                $this.find('button.tool.redo').addClass('disabled').removeClass('disabled').prop('disabled', true);
            };         
        },
        initDroppableCanvas: function() {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            data.canvas.droppable({
                accept      :       '#dm_media_bar li.file.image',
                tolerance   :       'touch',
                greedy      :       false,
                drop        :       function(event, ui) {
                    $(this).removeClass('hover-state').addClass('ready-state');
                    var imageId = ui.draggable.attr('id').replace(/dmm/, '');
                    if (data.image && data.changesApplied) {
                        if (confirm('Do you want to discard the changes and load different picture?')) {                            
                            privateMethods['clearImage'].apply($this,[]);
                            methods['setStatusBarText'].apply($this,[]);
                            privateMethods['loadImage'].apply($this,[imageId]);
                        };
                    } else {                        
                        privateMethods['clearImage'].apply($this,[]);
                        methods['setStatusBarText'].apply($this,[]);
                        privateMethods['loadImage'].apply($this,[imageId]);
                    };
                },
                over        :       function(event, ui) {
                    $(this).addClass('hover-state').removeClass('ready-state');
                },
                out         :       function(event, ui) {
                    $(this).removeClass('hover-state').addClass('ready-state');
                }
            });
        },
        loadImage: function(imageId, doSave, fileName, copyrights) {
            var $this = $(this), data = $this.data('dmImageEditorPlugin');
            
            var getData = $.extend({}, {
                imageId         :       'media:' + imageId,
                sessionId       :       data.sessionId,
                imageQuality    :       data.imageQuality
            });
            if (data.undoStack.length) {
                getData = $.extend({}, getData, {actions: data.undoStack});
            };
            if (doSave) getData.doSave = doSave;
            if (fileName) getData.fileName = fileName;
            if (copyrights) getData.copyrights = copyrights;
            
            $this.block();
            
            $.ajax(dm_configuration.script_name + '+/dmImageEditorAdmin/loadImage', { 
                type        :           'get',
                dataType    :           'json',
                data        :           getData,
                error       :      function(xhr, textStatus, errorThrown) {                    
                    $this.unblock();                    
                    methods['openErrorDialog'].apply($this, ['Error when loading image', xhr.responseText]);
                },
                success: function(response) {                    
                    if (response.error) {
                        methods['openErrorDialog'].apply($this, ['Error when loading image', response.message]);                        
                        $this.unblock();
                    } else {                        
                        data.sessionId = response.sessionId;
                        data.imageId = imageId;
                        if (!data.image) {
                            data.image = $('<img class="master" />');
                            data.canvas.append(data.image);
                        }
                        data.image.prop('src', response.src + '?' + Math.random());
                        data.image.attr('style','');
                        data.image.load(function(){                            
                            $this.trigger('dmImageEditorPlugin.onImageLoaded', [$(this)]);
                            if (doSave) {
                                data.undoStack = new Array();
                                data.redoStack = new Array();
                                if (fileName) {
                                    $.dm.coreMediaBar.reload($('#dm_media_browser').metadata().folder_id);
                                }
                                $this.data('dmImageEditorPlugin', data);
                            };
                            privateMethods['updateUndoRedoSaveSaveascopy'].apply($this,[]);
                            $this.unblock();
                        });                         
                        $this.data('dmImageEditorPlugin', data);
                        methods['setStatusBarText'].apply($this,['ready']);                        
                    };
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