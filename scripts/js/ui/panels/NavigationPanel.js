function NavigationPanel(ow, o, cbk)
{
	/**---private properties---**/
	var p = new Panel(ow, o, Panel.LENGHTS[Panel.LEFT-1], Panel.LEFT, cbk, MainMenu.CMD_LOCK_NAV);
	
	/**---extends Panel---**/
	p.extend(
	{
		/**---protected properties---**/
		accHolder: null,
		acc: null,
		displays: null,
		quickBox: null,
		network: null,
		gridPresets: null,
		scheduler: null,
		cloudStorage: null,
		logo: null,
		
		/**---public methods---**/
		update: function() //update requests coming from child objects
		{
			p.scroller.updateCondition();
		},
		
		springBefore: function(val, lck)
		{
			var dir;
			var l = p.accHolder.h;
			
			if(lck) dir = "-";
			else dir = "+";
			
			p.accHolder.getContainer().animate(
			{
				height: dir + "=" + val + "px"
			},
			{
				complete: function()
				{
					p.accHolder.setHeight(p.accHolder.getContainer().height());
					
					l = p.scroller.length;
					
					if(lck) l-=val;
					else l+=val;
					
					p.scroller.setLength(l);
					p.scroller.updateCondition();
				}
			});
		},
		
		osdCommand: function(cmd)
		{
		}
	});
	
	p.logo = p._osd.addImage(10, 11, 230, 19, "essence_logo.png");
	p.logo.relative(false); //setting absolute position

	p.accHolder = new Container(p.holder, p._osd, 20, 60, p.w-45, System.SCREEN_Y-65);
	p.holder.clip(true);
	
	p.acc = new Accordion(p.accHolder, p.accHolder._osd, 0, 0, p.w-45);
	p.acc.setReflector(p);
	
	p.scroller.setLinkage(p.acc, p.accHolder);
	
	//recieving osdCommand from accordion here
	p.accHolder.extend(
	{
		osdCommand: function(cmd)
		{
			p.osdCommand(cmd);
		}
	});
	
	var itemNames = ["Displays", "Quick Box", "Network", "Grid Presets", "Scheduler", "Cloud Storage"];
	for(var i=0; i<itemNames.length; i++)
	{
		p.acc.addItem(itemNames[i], p.w-50);
	
		p.acc.items[i].content.relative(true);
		p.acc.items[i].content.setHeight("auto");
	}
	
	//TEMP STUFF!!
	//display tree
	p.displays = new Tree(p.acc.items[0].content, p.osd, 0, 0, p.w-45);
	p.displays.addItem("Display 1", TreeItem.TYPE_DISPLAY).addChild("Grid 2x2 Auto", TreeItem.TYPE_GRID).addChild("Cam 1", TreeItem.TYPE_CAMERA).setTip("Full HD");
	p.displays.items[0].addChild("Cam 2", TreeItem.TYPE_CAMERA).setTip("No video", TreeItem.TIP_HIGH);
	p.displays.addItem("Display 2", TreeItem.TYPE_DISPLAY).addChild("Grid 4x4", TreeItem.TYPE_GRID);
	p.displays.addItem("Display 3", TreeItem.TYPE_DISPLAY);
	p.displays.addItem("Display 5", TreeItem.TYPE_DISPLAY);
	p.displays.addItem("Display 6", TreeItem.TYPE_DISPLAY);
	p.displays.addItem("Display 7", TreeItem.TYPE_DISPLAY);
	p.displays.addItem("Display 8", TreeItem.TYPE_DISPLAY);
	p.displays.setReflector(p);
	
	//quickbox tree
	p.quickBox = new Tree(p.acc.items[1].content, p.osd, 0, 0, p.w-45);
	p.quickBox.addItem("Display 1", TreeItem.TYPE_DISPLAY);
	p.quickBox.addItem("Cam 2", TreeItem.TYPE_CAMERA);
	p.quickBox.addItem("Cam 9", TreeItem.TYPE_CAMERA);
	p.quickBox.setReflector(p);
	
	p.network = new Tree(p.acc.items[2].content, p.osd, 0, 0, p.w-45);
	p.network.addItem("Server 1", TreeItem.TYPE_SERVER).addChild("Cam 15", TreeItem.TYPE_CAMERA);
	p.network.items[0].addChild("NVR 44", TreeItem.TYPE_NVR).addChild("Cam 11", TreeItem.TYPE_CAMERA);
	p.network.items[0].children[1].addChild("Cam 35", TreeItem.TYPE_CAMERA);
	p.network.items[0].children[1].addChild("Cam 10", TreeItem.TYPE_CAMERA);
	p.network.addItem("Server 2", TreeItem.TYPE_SERVER);
	p.network.setReflector(p);
	
	p.cloudStorage = new Tree(p.acc.items[5].content, p.osd, 0, 0, p.w-45);
	p.cloudStorage.addItem("cloud.nesagroup.com", TreeItem.TYPE_WEBPAGE);
	p.cloudStorage.addItem("Google Drive", TreeItem.TYPE_WEBPAGE);
	p.cloudStorage.addItem("Microsoft SkyDrive", TreeItem.TYPE_WEBPAGE);
	
	for(var i=0; i<15; i++) p.cloudStorage.addItem("Microsoft SkyDrive", TreeItem.TYPE_WEBPAGE); //test
	p.cloudStorage.setReflector(p);
	
	//p.acc.items[0].content._osd.addTextButton(20, 0, "Display 1");
	
	return p;
}