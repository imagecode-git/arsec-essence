//parent object for all interface elements

function Gadget(ow, o)
{
	/**---private properties---**/
	var actor;
	var cmd = Osd.CMD_INVALID;
	
	var clazz = new Class(
	{
		/**---protected properties---**/
		owner: ow,
		osd: o,
		
		disabled: false,
		focused: false,
		drg: false,
		hld: false,
		dragndrop: false,
		enableDoubleClick: false,
		enableScroll: false,
		dblClickDelay: 200, //in milliseconds
		clicks: 0, //click counter for double click
		dragPos: [0, 0],
		dragPivot: [0, 0],
		visible: true,
		link: null,
		con: null, //a "mirror" gadget, all event handler response (press, release, focus, unfocus, etc.) is redirected to it, if it's defined
		locker: null,
	
		/**---public methods---**/
		setActor: function(act)
		{
			actor = act;
			
			//TODO: touch events (system can detect touch support now, but events will be assigned in a wrong way)
			//if(System.useTouch)
			//{
				actor.mouseup(function(e)
				{
					clazz.handleMouseUp(e);
				});
				
				actor.mousedown(function(e)
				{
					clazz.handleMouseDown(e);
				});
				
				actor.mousemove(function(e)
				{
					clazz.handleMouseMove(e);
				});
				
				actor.mouseleave(function(e)
				{
					clazz.handleMouseLeave(e);
				});
				
				if(clazz.enableScroll)
				{
					actor.mousewheel(function(e, dlt)
					{
						clazz.handleMouseWheel(e, dlt);
					});
				}
				/*
			}
			else
			{
				actor.on("touchstart", function(e)
				{
					clazz.handleMouseDown(e);
				});
				
				actor.on("touchend", function(e)
				{
					clazz.handleMouseUp(e);
				});
				
				actor.on("touchmove", function()
				{
					clazz.handleMouseMove(e);
				});
				
				actor.on("touchleave", function()
				{
					clazz.handleMouseLeave(e);
				});
			}*/
			
			if(clazz.osd && clazz.osd === "Osd") clazz.osd.addEventListenter(GadgetEvent.ET_DEFAULT, osd.handleEvent);
		},
		
		getActor: function()
		{
			return actor;
		},
		
		handleMouseUp: function()
		{
			if(clazz.con) clazz.con.release();
			else clazz.release();
		},
		
		handleMouseDown: function()
		{
			if(clazz.enableDoubleClick)
			{
				clazz.clicks++;
				if(clazz.clicks == 1)
				{
					setTimeout(function()
					{
						if(clazz.clicks == 1)
						{
							if(clazz.con) clazz.con.press();
							else clazz.press();
						}
						else
						{
							if(clazz.con) clazz.con.doubleclick();
							else clazz.doubleclick();
						}

						clazz.clicks = 0;
					}, clazz.dblClickDelay);
				}
			}
			else
			{
				if(clazz.con) clazz.con.press();
				else clazz.press();
			}
		},
		
		handleMouseMove: function(e)
		{
			if(!clazz.disabled)
			{
				if(clazz.dragndrop)
				{
					if(clazz.hld)
					{
						if(!clazz.drg)
						{
							if(clazz.con) clazz.con.dragBegin();
							else clazz.dragBegin();
						}
						else
						{
							if(clazz.con) clazz.con.drag();
							else clazz.drag();
						}
					}
				}
				
				if(clazz.con) clazz.con.hover();
				else clazz.hover();
			}
		},
		
		handleMouseLeave: function()
		{
			if(clazz.con) clazz.con.unfocus();
			else clazz.unfocus();
		},
		
		handleMouseWheel: function(e, dlt)
		{
			if(!clazz.disabled)
			{
				if(clazz.con) clazz.con.scroll(e, dlt);
				else clazz.scroll(e, dlt);
			}
		},
		
		setLinkage: function(lnk)
		{
			clazz.link = lnk;
		},
		
		focus: function()
		{
			if(!clazz.focused)
			{
				clazz.focused = true;
				if(clazz.link) clazz.link(clazz.focused, cmd);
			}
		},
		
		unfocus: function()
		{
			if(clazz.focused)
			{
				clazz.focused = false;
				if(clazz.link) clazz.link(clazz.focused, cmd);
			}
		},
		
		press: function()
		{
			if(!clazz.disabled)
			{
				clazz.hold();
				clazz.sendMessage();
			}
		},
		
		scroll: function(e, dlt)
		{
			//child classes must _extend_ this method, otherwise input data will be lost
		},
		
		doubleclick: function()
		{
			//stays empty, child classes override this and define their own double click behaviour
		},
		
		release: function()
		{
			if(!clazz.disabled) clazz.unhold();
		},
		
		hover: function()
		{
			if(!clazz.disabled) clazz.focus();
		},
		
		dragBegin: function()
		{
			if(!clazz.drg)
			{
				clazz.dragPivot = [System.mouseX, System.mouseY];
				clazz.drg = true;
				System.dragTarget = clazz;
			}
		},
		
		drag: function()
		{
			clazz.dragPos = [System.mouseX-clazz.dragPivot[0], System.mouseY-clazz.dragPivot[1]];
		},
		
		dragEnd: function()
		{
			if(clazz.drg)
			{
				System.dragTarget = null;
				
				clazz.dragPivot = [0, 0];
				clazz.drg = false;
			}
		},
		
		hold: function()
		{
			if(!clazz.hld) clazz.hld = true;
		},
		
		unhold: function()
		{
			if(clazz.hld) clazz.hld = false;
		},
		
		sendMessage: function()
		{
			if(clazz.osd)
			{
				clazz.osd.handleEvent(new GadgetEvent(GadgetEvent.ET_DEFAULT, cmd));
			}
		},
		
		getCommand: function()
		{
			return cmd;
		},
		
		setCommand: function(val)
		{
			cmd = val;
		},
		
		enable: function()
		{
			clazz.disabled = false;
		},
		
		disable: function()
		{
			clazz.disabled = true;
		},
		
		finalize: function()
		{
			if(clazz.osd && clazz.osd === "Osd") clazz.osd.removeEventListener(GadgetEvent.ET_DEFAULT, osd.handleEvent);
		}
	});
	
	System.gadgets++;
	return clazz;
}

/**---static variables---**/
Gadget.STATE_INVALID	= -1;
Gadget.STATE_DEFAULT	= 0;
Gadget.STATE_FOCUSED	= 1;
Gadget.STATE_PRESSED	= 2;
Gadget.STATE_DISABLED	= 3;