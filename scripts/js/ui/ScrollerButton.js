function ScrollerButton(s)
{
	/**---private properties---**/
	var g = new Gadget(s.owner, s.osd);
	var state = Gadget.STATE_DEFAULT;

	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		scroller: s,
		holder: new Rectangle(null, s.border, s.border, s.w-s.border*2, s.h-s.border*2, Osd.COLOR_SCROLLER_BTN, 1, 0, null, 20-s.border),
		dragOffset: [],
		
		/**---public methods---**/
		update: function(st)
		{
			var col;
			state = st;
			
			switch(state)
			{
				case(Gadget.STATE_DEFAULT):
					col = Osd.COLOR_SCROLLER_BTN;
					break;
					
				case(Gadget.STATE_FOCUSED):
					col = Osd.COLOR_SELECTED;
					break;
					
				case(Gadget.STATE_PRESSED):
					col = Osd.COLOR_DEFAULT;
					break;
			}
			
			g.holder.setColor(col);
		},
		
		getLength: function()
		{
			return g.scroller.style = Scroller.STYLE_VERTICAL ? g.holder.h : g.holder.w;
		},
		
		setLength: function(val)
		{
			if(g.scroller.style == Scroller.STYLE_VERTICAL) g.holder.setHeight(val);
			else g.holder.setWidth(val);
		}
	});
	
	/**---override methods---**/
	g.override(
	{
		focus: function()
		{
			if(!g.drg) g.update(Gadget.STATE_FOCUSED);
			else g.update(Gadget.STATE_PRESSED);
		},
		
		unfocus: function()
		{
			if(!g.drg) g.update(Gadget.STATE_DEFAULT);
		},
		
		press: function()
		{
			g.update(Gadget.STATE_PRESSED);
		},
		
		release: function()
		{
			if(!g.drg)
			{
				if(g.focused) g.update(Gadget.STATE_FOCUSED);
				else g.update(Gadget.STATE_DEFAULT);
			}
		},
		
		dragBegin: function()
		{
			g.dragPivot = [g.holder.x, g.holder.y];
			g.dragOffset = [System.mouseX-g.dragPivot[0], System.mouseY-g.dragPivot[1]]; //distance between pick point and drag pivot
		},
		
		dragEnd: function()
		{
			g.release();
		},
		
		drag: function()
		{
			var dir = g.scroller.style;
			var obj = g.holder.getObject();

			var pos = g.dragPivot;
			pos[dir] += g.dragPos[dir]-g.dragOffset[dir];
			
			var dlt = dir ? g.holder.h : g.holder.w;
			var lim = [g.scroller.border, g.scroller.length-g.scroller.border-dlt];
	
			//locking axle for inverse direction
			var idir = (dir == 0) ? false : true;
			idir = !idir ? 1 : 0;
			pos[idir] = undefined;
			
			if(pos[dir] < lim[0]) pos[dir] = lim[0];
			if(pos[dir] > lim[1]) pos[dir] = lim[1];
			
			g.holder.setPos(pos[0], pos[1]);
			g.scroller.updateLinkedPos();
		}
	});
	
	g.scroller.holder.getObject().append(g.holder.getHtml());
	g.setActor(g.holder.getObject());
	g.dragndrop = true;
	
	return g;
}