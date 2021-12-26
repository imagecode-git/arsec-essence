//TODO: parametric build (i.e. according to some matrix presets)
function Grid(ow, o)
{
	var clazz = new Class(
	{
		/**---protected properties---**/
		owner: ow,
		osd: o,
		thickness: Grid.THICKNESS,
		holder: new Rectangle(null, 0, 0, System.SCREEN_X, System.SCREEN_Y, Osd.COLOR_DEFAULT, 0.0),
		gridLinesV: [],
		gridLinesH: [],
		
		/**---public methods---**/
		drawLineV: function(offset)
		{
			return new Rectangle(null, offset, 0, clazz.thickness, System.SCREEN_Y, Osd.COLOR_GRIDLINE, Grid.LINE_ALPHA);
		},
		
		drawLineH: function(offset)
		{
			return new Rectangle(null, 0, offset, System.SCREEN_X, clazz.thickness, Osd.COLOR_GRIDLINE, Grid.LINE_ALPHA);
		},
		
		build: function()
		{
			clazz.gridLinesH[0] = clazz.drawLineH(System.SCREEN_Y/2-clazz.thickness);
			clazz.gridLinesV[0] = clazz.drawLineV(System.SCREEN_X/2-clazz.thickness);
			clazz.owner.root.append(clazz.gridLinesV[0].getHtml());
			clazz.owner.root.append(clazz.gridLinesH[0].getHtml());
			
			clazz.owner.root.append(clazz.holder.getHtml());
			
			for(var i=0; i<clazz.gridLinesH.length; i++) clazz.gridLinesH[i].fadeIn();
			for(var j=0; j<clazz.gridLinesV.length; j++) clazz.gridLinesV[j].fadeIn();
		}
	});
	
	return clazz;
}

/**---static variables---**/
Grid.THICKNESS = 2;
Grid.LINE_ALPHA = 1.0;