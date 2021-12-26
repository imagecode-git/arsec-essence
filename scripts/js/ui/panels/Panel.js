function Panel(ow, o, t, l, cbk, lc)
{
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		w: 0,
		h: 0,
		active: true,
		visible: false,
		locked: false,
		hotspot: null,
		lockBtnRect: null,
		holder: null,
		bar: null,
		thickness: t,
		layout: l,
		timeout: null,
		reversePeriod: 1000,
		animDuration: 200,
		rect: null,
		callback: cbk,
		lockCmd: lc,
		lockBtn: null,
		lockBtnWH: [12, 12],
		scroller: null,
	
		/**---public methods---**/
		buildInterface: function()
		{
			//---panel container
			var x, y, w, h, r0, r1;
			switch(g.layout)
			{
				case(Panel.LEFT):
					x = -g.thickness;
					y = 0;
					w = g.thickness;
					h = System.SCREEN_Y;
					break;
					
				case(Panel.RIGHT):
					x = System.SCREEN_X;
					y = 0;
					w = g.thickness;
					h = System.SCREEN_Y;
					break;
					
				case(Panel.TOP):
					x = Panel.LENGHTS[Panel.LEFT-1];
					y = -g.thickness;
					w = System.SCREEN_X-2*x;
					h = g.thickness;
					break;
					
				case(Panel.BOTTOM):
					x = 0;
					y = System.SCREEN_Y;
					w = System.SCREEN_X;
					h = g.thickness;
					break;
			};
			
			g.holder = new Container(ow, o, x, y, w, h, 0);
			g._osd = g.holder._osd;
			
			g.w = w;
			g.h = h;
			
			//---panel bar
			switch(g.layout)
			{
				case(Panel.LEFT):
					x = 0;
					break;
					
				case(Panel.RIGHT):
					x = 0;
					break;
					
				case(Panel.TOP):
					x = 0;
					y = 0;
					break;
					
				case(Panel.BOTTOM):
					y = 0;
					break;
			};
			
			g.bar = new Rectangle(null, x, y, w, h, Osd.COLOR_WINDOW);
			g.holder.root.append(g.bar.getHtml());
			
			//---panel hotspot
			switch(g.layout)
			{
				case(Panel.LEFT):
					x = 0;
					break;
					
				case(Panel.RIGHT):
					x = System.SCREEN_X-g.thickness;
					break;
					
				case(Panel.TOP):
					x = Panel.LENGHTS[Panel.LEFT-1];
					y = 0;
					break;
					
				case(Panel.BOTTOM):
					y = System.SCREEN_Y-g.thickness;
					break;
			};

			g.hotspot = g.osd.addHotspot(x, y, w, h);
			g.hotspot.attach(g);
			
			//---panel hold locker hotspot rectangle
			switch(g.layout)
			{
				case(Panel.LEFT):
					x = 0;
					y = 0;
					w = g.thickness;
					h = System.SCREEN_Y;
					break;

				case(Panel.RIGHT):
					x = System.SCREEN_X-g.thickness;
					y = 0;
					w = g.thickness;
					h = System.SCREEN_Y;
					break;

				case(Panel.TOP):
					x = Panel.LENGHTS[Panel.LEFT-1];
					y = 0;
					w = System.SCREEN_X-2*x;
					h = g.thickness;
					break;
				
				case(Panel.BOTTOM):
					x = 0;
					y = System.SCREEN_Y-g.thickness;
					w = System.SCREEN_X;
					h = g.thickness;
					break;
			};
			g.rect = g.osd.addHotspotRectangle(x, y, w, h);
			g.rect.setLinkage(function(foc)
			{
				if(foc)
				{
					if(g.visible)
					{
						if(g.timeout)
						{
							clearTimeout(g.timeout);
							g.timeout = null;
						}
					}
				}
				else
				{
					if(g.visible && !g.locked)
					{
						if(g.timeout)
						{
							clearTimeout(g.timeout);
							g.timeout = null;
						}
						
						g.timeout = setTimeout(function()
						{
							if(g.active)
							{
								g.slidePanel(Panel.DIR_REV);
								g.hotspot.show();
								g.visible = false;
							}
						}, g.reversePeriod);
					}
				}
			});
			
			//---lock button
			if(g.layout != Panel.TOP)
			{
				w = g.lockBtnWH[0];
				h = g.lockBtnWH[1];
				
				switch(g.layout)
				{
					case(Panel.LEFT):
						x = g.thickness-1.5*w;
						y = System.SCREEN_Y/2-h/2-1;
						break;
						
					case(Panel.RIGHT):
						x = 0.5*w;
						y = System.SCREEN_Y/2-h/2-1;
						break;
						
					case(Panel.BOTTOM):
						x = System.SCREEN_X/2-w/2-1;
						y = 0.5*h;
						break;
				};
				
				g.lockBtn = g._osd.addImageButton(x, y, w, h, ["LockNormal.png", "LockHover.png", "LockPress.png"], g.lockCmd);
				g.lockBtn.hide();
				
				//---lock button hotspot rectangle
				switch(g.layout)
				{
					case(Panel.LEFT):
						y -= System.SCREEN_Y/6;
						w *= 2;
						x -= w/4;
						h = System.SCREEN_Y/3;
						break;
						
					case(Panel.RIGHT):
						y -= System.SCREEN_Y/6;
						w *= 2;
						x = System.SCREEN_X-g.thickness;
						h = System.SCREEN_Y/3;
						break;
						
					case(Panel.BOTTOM):
						y = System.SCREEN_Y-g.thickness;
						x -= System.SCREEN_X/6;
						w = System.SCREEN_X/3;
						h *= 2;
						break;
				};

				if(g.layout != Panel.TOP)
				{
					//use normal hotspot to debug this rectangle
					g.lockBtnRect = g.osd.addHotspotRectangle(x, y, w, h);
					g.lockBtnRect.setLinkage(function(foc)
					{
						if(foc)
						{
							if(!g.locked)
							{
								g.lockBtn.getObject().stop().fadeIn();
							}
						}
						else
						{
							if(!g.locked)
							{
								g.lockBtn.getObject().stop().fadeOut();
							}
						}
					});
				}
				
				var l; //scroller length
				var p = 3; //padding
				//---scroller
				switch(g.layout)
				{
					case(Panel.LEFT):
						x = p;
						y = 60;
						l = System.SCREEN_Y-y-p;
						
						break;
						
					case(Panel.RIGHT):
						x = g.thickness-p-Scroller.DEF_THICKNESS;
						y = p;
						l = System.SCREEN_Y-y-p;
						
						break;
				};
				
				g.scroller = g._osd.addScroller(x, y, l);
			}
		},
		
		activate: function(state)
		{
			g.active = state;
		},
		
		lock: function()
		{
			g.locked = !g.locked;
			
			var arr = ["LockNormal.png", "LockHover.png", "LockPress.png"];
			if(g.locked == true) arr = ["LockHover.png", "LockHover.png", "LockHover.png"];
			
			g.lockBtn.updateImages(arr, g.lockBtnWH[0], g.lockBtnWH[1]);
		},
		
		slidePanel: function(dir)
		{
			var mt, ml;
			var amount = g.getDirection(dir) + g.thickness;
			if(g.layout == Panel.TOP || g.layout == Panel.BOTTOM) mt = amount;
			if(g.layout == Panel.LEFT || g.layout == Panel.RIGHT) ml = amount;
			
			var cpt = null;
			if(dir == Panel.DIR_REV) cpt = g.callback;
			
			g.holder.getObject().animate(
			{
				marginTop:	mt + "px",
				marginLeft:	ml + "px",
			},
			{
				duration: g.animDuration,
				complete: cpt
			});
		},
		
		springPanel: function(val, lck)
		{
			g.springBefore(val, lck);
			
			lck = typeof lck !== 'undefined' ? lck : g.locked;
			
			if(lck) dir = "-";
			else dir = "+";
			
			g.bar.getObject().animate(
			{
				height: dir + "=" + val + "px"
			}, g.animDuration);
			
			g.hotspot.area.getObject().animate(
			{
				height: dir + "=" + val + "px"
			}, g.animDuration);
			
			g.holder.getObject().animate(
			{
				height: dir + "=" + val + "px"
			}, g.animDuration);
		},
		
		springBefore: function(val, lck)
		{
		},
		
		getDirection: function(dir)
		{
			var result;
			
			if(g.layout == Panel.TOP || g.layout == Panel.LEFT)
			{
				if(dir == Panel.DIR_FWD) result = "+=";
				else result = "-=";
			}
			else
			{
				if(dir == Panel.DIR_FWD) result = "-=";
				else result = "+=";
			}
			
			return result;
		}
	});
	
	/**---override methods---**/
	g.override(
	{
		focus: function()
		{
			if(!g.visible)
			{
				System.panelDepth++;
				g.holder.setDepth(System.panelDepth);
				g.hotspot.setDepth(System.panelDepth);
				
				g.slidePanel(Panel.DIR_FWD);
				clearTimeout(g.timeout);
				g.timeout = null;
				g.hotspot.hide();
				g.visible = true;
			}
		}
	});
	
	g.buildInterface();
	
	g.holder.setAlpha(System.DEF_ALPHA);
	
	return g;
}

/**---static variables---**/
Panel.LEFT		= 1;
Panel.RIGHT		= 2;
Panel.TOP		= 3;
Panel.BOTTOM	= 4;

Panel.DIR_FWD	= 0;
Panel.DIR_REV	= 1;

Panel.LENGHTS = [350, 350, 32, 77];