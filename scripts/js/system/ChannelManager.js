function ChannelManager(ow, o)
{
	var clazz = new Class(
	{
		/**---protected properties---**/
		owner: ow,
		osd: o,
		grid: null,
		channel: [],
		channels: 4,
		
		/**---public methods---**/
		init: function()
		{
			var mul = 1;
			var xpos = 0;
			var ypos = 0;
			
			for(var i=0; i<clazz.channels; i++)
			{
				clazz.channel[i] = new Channel(ow, o, clazz, xpos, ypos, System.SCREEN_X/2, System.SCREEN_Y/2, i);
				
				xpos += clazz.channel[i].w*mul;
				if(i%2) ypos += clazz.channel[i].h*(-mul);
				if(i%3) xpos == 0;
				mul = -mul;
				
				clazz.channel[i].build();
			}
			
			clazz.grid = new Grid(clazz.owner, clazz.osd);
			clazz.grid.build();
		}
	});
	
	return clazz;
}