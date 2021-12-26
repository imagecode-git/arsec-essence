function NotificationPanel(ow, o, cbk)
{
	/**---private properties---**/
	var p = new Panel(ow, o, Panel.LENGHTS[Panel.TOP-1], Panel.TOP, cbk, MainMenu.CMD_LOCK_NOTIF);
	
	/**---extends Panel---**/
	p.extend(
	{
		/**---protected properties---**/
		labels: [],
		icons: [],
		rollHotspot: null, //to unroll notifications
		panelHolder: null, //local container, we use it to prevent remapping osd commands from child elements to main menu (since it's actual hanlder for local osd and we can't modify it)
		notifHolder: null,
		logHolder: null,
		entryHolder: null,
		topBtn: null,
		unrolled: false,
		loadingLbl: null,
		headingLbl: null,
		logInput: null,
		logLabels: [],
		logScroller: null,
		logTab: null,
		logRating: null,
		logFiltersEnabled: false,
		logFilters: [],
		logSpacing: 18,
		logFontSize: TextLabel.SIZE_LARGE,
		logSepThickness: 2, //thickness for log separator rectangles
		lfBtn: [],
		lfBtnStates: ["filter_normal.png", "filter_hover.png", "filter_press.png"],
		
		/**---public methods---**/
		abortLogLoad: function()
		{
			if(p.loadingLbl) p.loadingLbl.finalize();
			
			for(var i=0; i<p.logLabels.length; i++) p.logLabels[i].finalize();
			p.logLabels = [];
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(NotificationPanel.CMD_ROLLOUT):
					var dir = "+";
					
					if(p.unrolled)
					{
						dir = "-";
						
						p.panelHolder.fadeIn();
						p.notifHolder.fadeOut();
						p.activate(true);
					}
					
					p.holder.getObject().animate(
					{
						marginTop: dir + "=" + (System.SCREEN_Y-Panel.LENGHTS[Panel.BOTTOM-1]-p.h) + "px"
					},
					{
						step: function()
						{
							p.holder.updatePos();
						},
						
						complete: function()
						{
							if(!p.unrolled)
							{
								var lblSize = TextLabel.SIZE_MODERATE;
								var spacing = parseInt(lblSize*1.35); //distance between log lines
								
								p.loadingLbl = p.notifHolder._osd.addLabel(p.logHolder.x+spacing, p.logHolder.y+spacing, "Loading log entries...", false, Osd.COLOR_TEXT, lblSize);
							
								p.panelHolder.fadeOut();
								p.notifHolder.fadeIn();
								p.activate(false); //prevents panel from sliding
								
								p.unrolled = true;
								System.ax.getLog(function(data)
								{
									p.loadingLbl.finalize();
								
									var log = eval(data);
									for(var i=0; i<data.length; i++)
									{
										if(log[i]) p.logLabels.push(p.entryHolder._osd.addLabel(spacing, spacing*(i+1), log[i].time + " " + log[i].result, false, Osd.COLOR_TEXT, lblSize));
									}
									
									var obj = p.logLabels[p.logLabels.length-1].getObject();
									p.entryHolder.setHeight(obj.offset().top + obj.height() + p.logLabels[0].y/2); //detecting height for absolutely positioned elements
									p.logScroller.updateLinkage(); //sending info about new height to scroller
								});
							}
							else
							{
								//auto-resetting scroller (sometimes may lead to freezing the scroller!)
								p.entryHolder.setHeight(0);
								p.logScroller.updateLinkage();
								p.logScroller.scrollTo(0);
								
								p.abortLogLoad();
								p.unrolled = false;
							}
						}
					});
					break;
					
				case(NotificationPanel.CMD_LOG_RATE):
					//console.log("rate " + p.logRating.getRate()); //temp, coming from p.logRating
					break;
					
				case(NotificationPanel.CMD_LOG_SEARCH):
					break;
					
				case(NotificationPanel.CMD_LOG_TOGGLE_FILTER):
					p.logFiltersEnabled = !p.logFiltersEnabled;
					
					var arr = p.lfBtnStates;
					var obj = p.lfBtn[1];
					if(p.logFiltersEnabled)
					{
						arr = [p.lfBtnStates[1], p.lfBtnStates[1], p.lfBtnStates[2]]; //swap hover state image with a normal one
						p.addLogFilter();
					}
					else
					{
						var done = 0;
						
						if(p.logFilters.length)
						{
							var len = (p.logFilters[0].getHeight()+p.logSpacing)*p.logFilters.length;
						
							for(var i=0; i<p.logFilters.length; i++)
							{
								$(function()
								{
									p.logFilters[i].fadeOut();
								});
							}
							
							p.resizeLog(1, len, function()
							{
								done++;
								p.logFilters = [];
								
								p.logScroller.setLength(p.logHolder.h);
								p.logScroller.updateCondition();
								p.logScroller.updateLinkedPos();
							});
						}
						else done++;
						
						if(done) arr = p.lfBtnStates; //swap images back to return normal button state
					}
					
					obj.updateImages(arr, obj.w, obj.h);
					break;
			}
		},
		
		addLogFilter: function(sid)
		{
			var lf = new LogFilter(p.notifHolder, p._osd, p.logSpacing, p.logHolder.h-p.logSpacing-p.logSepThickness, p.logHolder.w, p.logSpacing, function(cbk, data)
			{
				switch(cbk)
				{
					case(LogFilter.CBK_ADD):
						p.addLogFilter(data);
						break;
					
					case(LogFilter.CBK_DEL):
						p.logFilters[data].destroyInterface();
						
						if(data != p.logFilters.length-1)
						{
							$(function()
							{
								for(var i=p.logFilters.length-1; i>data; i--)
								{
									p.logFilters[i].getObject().animate(
									{
										marginTop: "+=" + parseInt(p.logFilters[data].getHeight()+p.logSpacing) + "px"
									},
									{
										step: function()
										{
											if(p.logFilters[i]) p.logFilters[i].updatePos();
										},
										
										queue: false
									});
								}
							});
						}

						p.resizeLog(1, p.logFilters[data].getHeight()+p.logSpacing, function()
						{
							p.logScroller.setLength(p.logHolder.h);
							p.logScroller.updateCondition();
							p.logScroller.updateLinkedPos();
							
							var arr = [];
							for(var i=0; i<p.logFilters.length; i++)
							{
								if(i != data)
								{
									arr.push(p.logFilters[i]);
									p.logFilters[i].stackID = arr.length-1;
								}
							}
							p.logFilters = arr;
							
							if(p.logFilters.length == 0) p.osdCommand(NotificationPanel.CMD_LOG_TOGGLE_FILTER);
						});
						break;
					
					case(LogFilter.CBK_EDIT):
						if(!data) lf.showInterface();
						else
						{
							p.resizeLog(-1, data, function()
							{
								p.logScroller.setLength(p.logHolder.h);
								p.logScroller.updateCondition();
								p.logScroller.updateLinkedPos();
								
								lf.showInterface();
							});
						}
						break;
						
					case(LogFilter.CBK_COLLAPSE):
						break;
				}
			});
			
			lf.stackID = p.logFilters.length;
			lf.hide();
			
			p.resizeLog(-1, lf.getHeight()+p.logSpacing, function()
			{
				p.logScroller.setLength(p.logHolder.h);
				p.logScroller.updateCondition();
				p.logScroller.updateLinkedPos();
				
				lf.fadeIn();
			});
			
			if(sid != p.logFilters.length-1 && sid != undefined)
			{
				p.logFilters[sid].updatePos(); //sometimes filters come with mismatching script pos and css pos, so we fix them here
				
				var pos = p.logFilters[sid].getPos();
				lf.setPos(pos[0], pos[1]-lf.getHeight()-p.logSpacing);

				$(function()
				{
					for(var i=sid+1; i<p.logFilters.length; i++)
					{
						p.logFilters[i].getObject().animate(
						{
							marginTop: "-=" + parseInt(lf.getHeight()+p.logSpacing) + "px"
						},
						{
							step: function()
							{
								if(p.logFilters[i]) p.logFilters[i].updatePos();
							},
							
							queue: false
						});
					}
				});
				
				p.logFilters.splice(sid+1, 0, lf);
				for(var i=0; i<p.logFilters.length; i++) p.logFilters[i].stackID = i;
			}
			else p.logFilters.push(lf);
		},
		
		resizeLog: function(dir, length, oncomplete)
		{
			if(dir > 0) dir = "+";
			else dir = "-";
			
			p.logHolder.getContainer().stop().animate(
			{
				height: dir + "=" + length + "px"
			});
			
			p.logHolder.getObject().animate(
			{
				height: dir + "=" + length + "px"
			},
			{
				step: function()
				{
					p.logHolder.updateDimensions();
				},
				
				complete: oncomplete
			});
		}
	});
	
	//---begin building top panel
	p.panelHolder = new Container(p.holder, p._osd, 0, 0, p.w, p.h);
	p.panelHolder.extend(
	{
		osdCommand: function(cmd)
		{
			p.osdCommand(cmd);
		}
	});
	
	var ttl = ["PM 1:35", "1024Gb", "100Kb/s", "3 tasks pending", "Uploading... (76%)"];
	var data = ["clock.png", "storage.png", "network.png", "calendar.png", "cloud.png"];
	
	var iconWH = parseInt(p.h*0.75);
	var padding = 64;
	var textSize = TextLabel.SIZE_MODERATE;
	
	var len = p.w - 2*padding;
	var dlt = (p.w-(iconWH*data.length))/data.length;
	
	var holderHeight = System.SCREEN_Y-Panel.LENGHTS[Panel.BOTTOM-1];
	var pos = p.panelHolder.getPos();
	p.panelHolder.setPos(pos[0], pos[1]+holderHeight-p.h);
	
	p.holder.setHeight(holderHeight);
	p.bar.setHeight(holderHeight);
	
	pos = p.holder.getPos();
	p.holder.setPos(pos[0], pos[1]-holderHeight+p.h);
	
	var xpos = padding;
	var ypos = (p.h-iconWH)/2;
	
	for(var i=0; i<data.length; i++)
	{
		p.icons.push(p.panelHolder._osd.addImage(xpos, ypos, iconWH, iconWH, data[i]));
		p.labels.push(p.panelHolder._osd.addLabel(xpos+padding/8+iconWH, ypos+(iconWH-textSize-padding/(8*2))/2, ttl[i], false, Osd.COLOR_TEXT, textSize));
		xpos += dlt;
	}
	
	p.labels[1].insertTip("100Kb left", "#FF0000"); //temp!
	
	p.rollHotspot = p.panelHolder._osd.addHotspot(0, 0, p.w, p.h, NotificationPanel.CMD_ROLLOUT);
	//---eof building top panel
	
	//---all unrolled notification controls goes below
	p.notifHolder = new Container(p.holder, p._osd, 0, 0, p.w, p.h+holderHeight);
	p.notifHolder.extend(
	{
		osdCommand: function(cmd)
		{
			p.osdCommand(cmd);
		}
	});
	
	var fontSize = TextLabel.SIZE_XXXL;
	xpos = p.logSpacing;
	ypos = p.notifHolder.h-3*p.logSpacing-fontSize;
	p.headingLbl = p.notifHolder._osd.addLabel(xpos, ypos, "Events", false, Osd.COLOR_TEXT, fontSize);
	
	ypos -= p.logSpacing/2;
	addSeparator(p.notifHolder, p.logSpacing, ypos);
	
	ypos -= p.logSpacing+p.logFontSize-p.logSepThickness; //this is incorrect, set font size to 22 or higher and you'll find out some crazy margins from top
	p.logTab = p.notifHolder._osd.addTabBar(xpos, ypos, ["User", "System", "Alarm", "Misc"], NotificationPanel.CMD_LOG_TAB, p.logFontSize, p.logSpacing);
	p.logTab.extend(
	{
		osdCommand: function(set)
		{
			var cmd = set-NotificationPanel.CMD_LOG_TAB;
			switch(cmd)
			{
				case 0:
					//tab action here
					break;
					
				case 1:
					//tab action here
					break;
					
				case 2:
					//tab action here
					break;
					
				case 3:
					//tab action here
					break;
			}
		}
	});
	
	xpos += p.logSpacing+p.logTab.w;
	p.logRating = p.notifHolder._osd.addRating(xpos, ypos+parseInt(p.logFontSize/4)-p.logSepThickness/2, p.logFontSize, 5, NotificationPanel.CMD_LOG_RATE);
	
	xpos += p.logSpacing+p.logRating.w;
	p.logInput = p.notifHolder._osd.addTextInput(xpos, ypos, 200, "Search...", TextInput.TYPE_DEFAULT, p.logFontSize);
	p.logInput.setPos(xpos, ypos+p.logTab.h/2-p.logInput.getHalfHeight());

	ypos -= p.logFontSize+p.logSpacing/2;
	
	//---begin building log container
	var logHolderHeight = ypos;
	
	p.logHolder = new Container(p.notifHolder, p._osd, p.logSpacing, p.logSpacing, p.w-2*p.logSpacing-2, logHolderHeight);
	p.logHolder.setBackground(Osd.COLOR_HILITE);
	
	p.entryHolder = new Container(p.logHolder, p._osd, 0, 0, p.w-2*p.logSpacing, logHolderHeight);
	
	//scroller for log
	p.logScroller = p._osd.addScroller(p.w-p.logSpacing+2, p.logSpacing, logHolderHeight);
	p.logScroller.setLinkage(p.entryHolder, p.logHolder);
	
	iconWH = 30;
	xpos = p.w/2-iconWH/2;
	ypos = p.notifHolder.h-p.h-iconWH-iconWH/4;
	p.topBtn = p.notifHolder._osd.addImageButton(xpos, ypos, iconWH, iconWH, ["top_normal.png", "top_hover.png", "top_press.png"], NotificationPanel.CMD_ROLLOUT);
	
	iconWH = 36;
	dlt = iconWH+p.logSpacing/2;
	xpos = p.notifHolder.w-dlt;
	ypos = p.notifHolder.h-2*iconWH-p.logSpacing/2;
	
	var data = [["bulb_normal.png", "bulb_hover.png", "bulb_press.png"], ["settings_normal.png", "settings_hover.png", "settings_press.png"], ["info_normal.png", "info_hover.png", "info_press.png"]];
	var cmd;
	
	for(var i=0; i<data.length; i++)
	{
		p.notifHolder._osd.addImageButton(xpos, ypos, iconWH, iconWH, data[i]); xpos -= dlt;
	}
	
	iconWH = 24;
	dlt = iconWH+p.logSpacing;
	xpos = p.notifHolder.w-dlt;
	ypos -= iconWH+p.logSpacing+p.logSpacing/2-p.logSepThickness;
	
	data = [["search_normal.png", "search_hover.png", "search_press.png"], p.lfBtnStates];
	cmd = [NotificationPanel.CMD_LOG_SEARCH, NotificationPanel.CMD_LOG_TOGGLE_FILTER];
	
	p.logInput.setWidth(xpos-p.logInput.getPos()[0]-2*iconWH-p.logSpacing);
	
	for(var i=0; i<data.length; i++)
	{
		p.lfBtn[i] = p.notifHolder._osd.addImageButton(xpos, ypos, iconWH, iconWH, data[i], cmd[i]); xpos -= dlt;
	}
	//--eof building log container
	
	p.notifHolder.hide();
	
	//builds centered wide separator line into a given container according to defined XY offset
	function addSeparator(cont, xoff, yoff)
	{
		var r = new Rectangle(null, xoff, yoff, p.w-2*p.logSpacing-2, p.logSepThickness, Osd.COLOR_DISABLED)
		cont.getObject().append(r.getHtml());
		
		return r;
	}
	
	return p;
}

NotificationPanel.CMD_ROLLOUT			= 200;
NotificationPanel.CMD_LOG_RATE			= 250;
NotificationPanel.CMD_LOG_TAB			= 300;
NotificationPanel.CMD_LOG_TOGGLE_FILTER	= 350;
NotificationPanel.CMD_LOG_SEARCH		= 351;