function Scroller(ow, o, xpos, ypos, len, depth, sty)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		x: xpos,
		y: ypos,
		z: depth || System.DEF_DEPTH,
		w: 0,
		h: 0,
		border: 2,
		length: len,
		thickness: Scroller.DEF_THICKNESS,
		style: typeof sty !== 'undefined' ? sty : Scroller.STYLE_VERTICAL, //this parameter may come with zero value, so we apply special check for it
		holder: null,
		bar: null,
		link: null,
		boundary: null,
		linkRatio: 0,
		hidden: false,
		
		/**---public methods---**/
		build: function()
		{
			if(g.style == Scroller.STYLE_HORIZONTAL)
			{
				g.w = g.length;
				g.h = g.thickness;
			}
			else
			{
				g.h = g.length;
				g.w = g.thickness;
			}
			
			g.holder = new Rectangle(null, g.x, g.y, g.w, g.h, Osd.COLOR_SCROLLER_BCK, 1, 0, null, 20);
			g.owner.root.append(g.holder.getHtml());
			
			g.bar = new ScrollerButton(g);
		},
		
		update: function(st)
		{
			var col;
			state = st;
			
			switch(state)
			{
				case(Gadget.STATE_DEFAULT):
					col = Osd.COLOR_SCROLLER;
					break;
					
				case(Gadget.STATE_FOCUSED):
					col = Osd.COLOR_SELECTED;
					break;
					
				case(Gadget.STATE_PRESSED):
					col = Osd.COLOR_DEFAULT;
					break;
			}
				
			g.bar.setColor(col);
		},
		
		//converts scroll button pos to the units of linked container
		updateLinkedPos: function()
		{
			if(g.link)
			{
				var k = g.link.getContainer().height()/g.boundary.getContainer().height();
				var pos = g.link.getPos();
				
				pos[g.style] = parseInt((g.bar.holder.getPos()[g.style]-g.border)*(-k));
				g.link.setPos(pos[0], pos[1]);
			}
		},
		
		//instantly scroll to desired segment of container length
		scrollTo: function(val)
		{
			//input value range: [0.0, 1.0]
			if(val < 0) val = 0;
			if(val > 1) val = 1;
		
			var len = g.length-g.border;
			if(g.style == Scroller.STYLE_VERTICAL) len -= g.bar.holder.h;
			else len -= g.bar.holder.w;
			
			var pos = g.bar.holder.getPos();
			pos[g.style] = val*len;
			
			var lim = [g.border, len];
			if(pos[g.style] < lim[0]) pos[g.style] = lim[0];
			if(pos[g.style] > lim[1]) pos[g.style] = lim[1];
			
			g.bar.holder.setPos(pos[0], pos[1]);
			g.updateLinkedPos();
		},
		
		setLinkage: function(lnk, bounds)
		{
			var k = bounds.getContainer().height()/lnk.getContainer().height();
			if(g.style == Scroller.STYLE_HORIZONTAL) k = bounds.getContainer().width()/lnk.getContainer().width();
			
			g.linkRatio = k;
			g.boundary = bounds;
			
			if(!g.link)
			{
				g.link = lnk;
				g.link.setScrollable(true);
				g.link.extend(
				{
					scroll: function(e, dlt)
					{
						if(g.linkRatio < 1 && !g.hidden)
						{
							var len = g.length-g.border;
							if(g.style == Scroller.STYLE_VERTICAL) len -= g.bar.holder.h;
							else len -= g.bar.holder.w;
							
							var lim = [g.border, len];
							var step = Scroller.STEP_SIZE;
							var pos = g.bar.holder.getPos();
							var mul = (dlt<0) ? 1 : -1;
							
							pos[g.style] += step*mul;
							
							if(pos[g.style] < lim[0]) pos[g.style] = lim[0];
							if(pos[g.style] > lim[1]) pos[g.style] = lim[1];
							
							g.bar.holder.setPos(pos[0], pos[1]);
							g.updateLinkedPos();
							
							//TODO: animation for button/link movement
						}
					}
				}, true);
			}
			
			var len = parseInt(g.length*k)-g.border*2;
			var maxlen = g.length-g.border*2; //maximum scroller button length
			
			if(len > maxlen) len = maxlen;
			if(len == maxlen || isNaN(len)) //hiding scrollbar completely, if maximum length is reached, i.e. if there is nothing to scroll
			{
				g.hidden = true;
				
				g.holder.fadeOut();
				g.bar.holder.fadeOut(
				{
					complete: function()
					{
						g.bar.setLength(len);
					}
				});
			}
			else
			{
				//showing up scrollbar again, if we got some scrollable content
				g.bar.setLength(len);
				g.hidden = false;
				
				g.holder.fadeIn();
				g.bar.holder.fadeIn();
			}
			
			//the following code calculate and applies bottom align for scrollable content
			var dlt, offset;
			var idir = (g.style == Scroller.STYLE_VERTICAL) ? 1 : 0;
			var pos = g.link.getPos();
			var anim = ["+=0px", "+=0px"];
			var newpos = g.bar.holder.getPos();
			
			//dlt shows how far is our content from the bottommost position
			if(g.style == Scroller.STYLE_VERTICAL)
			{
				k = g.h/g.link.getContainer().height();
				dlt = g.boundary.getContainer().height()-(g.link.getContainer().height()+g.link.getPos()[idir]);
			}
			else
			{
				k = g.w/g.link.getContainer().width();
				dlt = g.boundary.getContainer().width()-(g.link.getContainer().width()+g.link.getPos()[idir]);
			}
			
			if(g.link.getPos()[idir] < -dlt && dlt > 0)
			{
				anim[g.style] = "+=" + dlt + "px";
				
				offset = -parseInt((pos[idir]+dlt)*k)+2*g.border;
				newpos[idir] = offset;
				
				g.bar.holder.setPos(newpos[0], newpos[1]);
				g.link.getObject().animate(
				{
					marginLeft: anim[0],
					marginTop: anim[1]
				},
				{
					step: function()
					{
						g.link.updatePos()
					}
				});
			}
			else
			{
				offset = -parseInt(pos[1]*k)+g.border;
				newpos[idir] = offset;
				
				g.bar.holder.setPos(newpos[0], newpos[1]);
			}
		},
		
		updateCondition: function()
		{
			if(g.link && g.boundary)
			{
				var l, comp;
				var anim = ["+=0px", "+=0px"];

				if(g.style == Scroller.STYLE_VERTICAL)
				{
					l = [g.link.getContainer().height(), g.boundary.getContainer().height()];
					comp = g.link.y;
				}
				else
				{
					l = [g.link.getContainer().width(), g.boundary.getContainer().width()];
					comp = g.link.x;
				}
				
				var idx = (g.style == Scroller.STYLE_VERTICAL) ? 1 : 0;
				anim[idx] = "+=" + -comp + "px";
				
				if(l[1] >= l[0] && comp < 0)
				{
					g.hidden = true;
					
					g.holder.fadeOut();
					g.bar.holder.fadeOut();
					
					g.link.getObject().stop(true, true).animate(
					{
						marginTop: anim[1],
						marginLeft: anim[0]
					},
					{
						step: function()
						{
							g.link.updatePos();
						}
					});
				}
				else g.setLinkage(g.link, g.boundary); //this must refresh current scroller position/length
			}
		},
		
		//self-update at changing link container dimensions
		updateLinkage: function()
		{
			if(g.boundary)
			{
				var obj = g.boundary.getContainer()[0];
				g.setLinkage(g.link, g.boundary);
				
				return true;
			}
			
			return false;
		},
		
		setLength: function(val)
		{	
			g.length = val;
			
			if(g.style == Scroller.STYLE_VERTICAL)
			{
				g.holder.setHeight(val);
				g.h = val;
			}
			else
			{
				g.holder.setWidth(val);
				g.w = val;
			}
			
			g.bar.setLength((val*g.linkRatio)-2*g.border);
		},
		
		setPos: function(_x, _y)
		{
			g.x = _x;
			g.y = _y;
			
			g.holder.setPos(g.x, g.y);
		},
		
		getPos: function()
		{
			return [g.x, g.y];
		}
	});
	
	g.build();
	
	return g;
}

/**---static variables---**/
Scroller.STYLE_HORIZONTAL	= 0;
Scroller.STYLE_VERTICAL		= 1;

Scroller.DEF_THICKNESS = 13;
Scroller.STEP_SIZE = 25;
Scroller.MAX_STEPS = 10;