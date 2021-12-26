//generally describes attached Neon ActiveX plugins
function Plugin(ow, width, height, typ, params, uid)
{
	var clazz = new Class(
	{
		/**---private properties---**/
		owner: ow,
		id: uid || "plugin_pid_" + System.addons,
		w: width || 0,
		h: height || 0,
		type: typeof typ !== 'undefined' ? typ : Plugin.TYPE_INVALID,
		clsid: null,
		eventSource: null, //must be defined globally (see cms.php)
		queue: [],
		
		/**---public methods---**/
		getHtml: function()
		{
			var html = '<object clsid="{';
			var ax_type = "application/x-itst-activex";
			var style = '"width: ' + clazz.w + 'px; height: ' + clazz.h + 'px;"';

			switch(clazz.type)
			{
				case(Plugin.TYPE_UI):
					clazz.clsid = "0D478150-845A-4E51-9C96-D87873DE9CB0";
					clazz.eventSource = "UIPluginEventSource";
					break;
					
				case(Plugin.TYPE_VIEWER):
					break;
					
				case(Plugin.TYPE_SUBSCREEN):
					break;
					
				case(Plugin.TYPE_IPC):
					break;
			}
			
			html += clazz.clsid + '}" id="' + clazz.id + '" type="' + ax_type + '" event_eventsource="' + clazz.eventSource + '" ' + params + ' style=' + style + '></object>';
			
			return html;
		},
		
		getObject: function()
		{
			return $("#" + clazz.id);
		},
		
		addCallback: function(cbk)
		{
			clazz.queue.push(cbk);
		},
		
		execute: function(str)
		{
			if(clazz.queue.length)
			{
				var cbk = clazz.queue[0];
				eval(cbk(str));
				
				clazz.queue.slice(0);
			}
		}
	});
	
	clazz.owner.root.append(clazz.getHtml());
	
	return clazz;
}

/**---static variables---**/
Plugin.TYPE_INVALID		= -1;
Plugin.TYPE_UI			= 0;
Plugin.TYPE_VIEWER		= 1;
Plugin.TYPE_SUBSCREEN	= 2;
Plugin.TYPE_IPC			= 3; //direct IP viewer with software renderer