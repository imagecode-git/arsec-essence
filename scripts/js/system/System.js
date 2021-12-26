//entry point for javascript, loads interface for user
function System()
{
	/**---private properties---**/
	var osd;
	var debugLbl;
	var loginMenu;
	var mainMenu;
	
	var clazz = new Class(
	{
		/**---protected properties---**/
		root: null,
	
		/**---public methods---**/
		init: function(input)
		{
			//global drag handler, fixing lost focus issue
			$(document).mouseup(function()
			{
				if(System.dragTarget) System.dragTarget.dragEnd();
			});
			
			$(document).mousemove(function()
			{
				if(System.dragTarget) System.dragTarget.drag();
			});
		
			if(Modernizr.touch) System.useTouch = true; //detecting touchscreen support
		
			clazz.root = input;
			
			osd = new Osd(clazz);
			
			if(System.useDebug)
			{
				debugLbl = osd.addLabel(10, 10, "Debugger launched", false, "#FF0000", TextLabel.SIZE_MEDIUM, "debugText");
				debugLbl.setDepth(System.MAX_DEPTH);
			};
			
			//init fullscreen toggle
			document.addEventListener("keydown", function(e)
			{
				if(e.keyCode == KEY_RETURN)
				{
					if(!document.mozFullScreen && !document.webkitFullScreen)
					{
						var dom = input[0];
							 if(dom.requestFullscreen)			dom.requestFullscreen();
						else if(dom.msRequestFullscreen)		dom.msRequestFullscreen();
						else if(dom.mozRequestFullScreen)		dom.mozRequestFullScreen();
						else if(dom.webkitRequestFullscreen)	dom.webkitRequestFullscreen(input[0].ALLOW_KEYBOARD_INPUT);
					}
					else
					{
							 if(document.cancelFullscreen)			document.cancelFullscreen();
						else if(document.msCancelFullscreen)		document.msCancelFullscreen();
						else if(document.mozCancelFullScreen)		document.mozCancelFullScreen();
						else if(document.webkitCancelFullscreen)	document.webkitCancelFullScreen();
					}
				};
			}, false);
			
			if(System.usePlugins)
			{
				System.plugins.push(new Plugin(clazz, 0, 0, Plugin.TYPE_UI, 'param_version="2.0.0.1" events="true"'));
			}
			
			loginMenu = new LoginMenu(clazz, clazz.osd);
			//mainMenu = new MainMenu(clazz, clazz.osd);
		},
		
		include: function(src)
		{
		   var script = document.createElement('script');

		   script.type = 'text/javascript';
		   script.src = src;
		   
		   document.getElementsByTagName('head')[0].appendChild(script);
		},
		
		addRect: function(rect)
		{
			System.rects.push(rect);
			return System.rects.length-1;
		},
		
		//removes hotspot rectangle from global notify queue
		remRect: function(rect)
		{
			var rid;
			for(var i=0; i<System.rects.length; i++)
			{
				if(rect.id == System.rects[i].id) rid = i;
			}
		
			var a0 = System.rects.slice(0, rid);
			var a1 = System.rects.slice(rid+1, System.rects.length);
			
			System.rects = a0.concat(a1);
		},
		
		loading: null,
		
		debug: function(str)
		{
			if(System.useDebug) debugLbl.setText(str);
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(Osd.CMD_INVALID):
				break;
			}
		}
	});
	
	$(window).mousemove(function(e)
	{
		var event = e || window.event;
		
		System.mouseX = event.clientX;
		System.mouseY = event.clientY;
		
		//global hotspot rectangle handling
		if(System.rects && System.rects.length)
		{
			for(var i=0; i<System.rects.length; i++) System.rects[i].notify();
		}
	});
	
	/**---externally accessible objects---**/
	System.debug = clazz.debug;
	System.include = clazz.include;
	System.dragTarget = null;
	System.osd = clazz.osd;
	System.loading = clazz.loading;
	System.addRect = clazz.addRect;
	System.remRect = clazz.remRect;
	System.serverIP = null;
	System.serverPort = null;
	System.uid = null; //UID of this NVR, being recieved at successful login
	
	System.cgi = new CGI();
	System.ax = new AX();
	System.date = null;
	
	$.fx.interval = 5; //lower value - smoother animation
	
	return clazz;
}

/**---static variables---**/
System.SCREEN_X	= 1920;
System.SCREEN_Y	= 1080;

System.DEF_FONT = "'Square 721 BT Condensed'";

System.DEF_ALPHA = 1.0;

System.DEF_DEPTH = 0;
System.MAX_DEPTH = 9999;

System.gadgets	= 0;
System.texts	= 0;
System.images	= 0;
System.shapes	= 0;
System.addons	= 0;

System.mouseX = 0;
System.mouseY = 0;

System.useDebug		= true;
System.useTouch		= false;
System.usePlugins	= true;

System.rects = [];
System.plugins = [];

System.panelDepth = 0;