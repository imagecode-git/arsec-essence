function MainMenu(ow, o)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);

	g._osd = new Osd(ow);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		manager: new ChannelManager(g.owner, g._osd),
		panelCallback: null,
		panels: null,

		/**---public methods---**/
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(MainMenu.CMD_LOCK_SC):
					g.panels[0].lock();
					g.panels[2].springPanel(g.panels[0].thickness, g.panels[0].locked);
					g.panels[3].springPanel(g.panels[0].thickness, g.panels[0].locked);
					break;
					
				case(MainMenu.CMD_LOCK_NOTIF):
					g.panels[1].lock();
					break;
					
				case(MainMenu.CMD_LOCK_NAV):
					g.panels[2].lock();
					break;
					
				case(MainMenu.CMD_LOCK_DEVST):
					g.panels[3].lock();
					break;
			}
		}
	});
	
	g.manager.init();
	
	g.panels =
	[
		new ShortcutPanel(g.owner, g._osd, panelCallback),
		new NotificationPanel(g.owner, g._osd, panelCallback),
		new NavigationPanel(g.owner, g._osd, panelCallback),
		new DeviceSettingsPanel(g.owner, g._osd, panelCallback)
	];
	
	g._osd.setHandler(g);

	for(var i=0; i<g.panels.length; i++) g.panels[i]._osd.setHandler(g);
	
	//this method is being called each time panels slide back
	function panelCallback()
	{
		var closed = 0;
		for(var i=0; i<g.panels.length; i++) if(!g.panels[i].visible) closed++;
		
		if(closed == g.panels.length-1) System.panelDepth = 0; //top panel has no lock, so we strip it out from calculation
	}
	
	//debug!
	//var dtp = new DateTimePicker(g.owner, g.panels, System.SCREEN_X/2-380/2, System.SCREEN_Y/2-240/2, 380, 240);
	new Calendar(g.owner, g._osd);
	new Clock(g.owner, g._osd);
	//new TestControls(g.owner, g._osd, 700, 150, 500, 700);

	return g;
}

/**---static variables---**/
MainMenu.CMD_LOCK_SC	 = 200;
MainMenu.CMD_LOCK_NOTIF	 = 201;
MainMenu.CMD_LOCK_NAV	 = 202;
MainMenu.CMD_LOCK_DEVST	 = 203;