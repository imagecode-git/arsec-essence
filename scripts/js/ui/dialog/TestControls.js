function TestControls(ow, o, xpos, ypos, width, height)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, width, height, null, 1.0);
	var hs = c._osd.addHotspot(0, 0, c.w, c.h);
	
	c.setDraggable(hs); //attaching hotspot as a drag source, will move entire container if dragged
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		nvrList: [],
		ipcList: [],
		cameras: [],
		bcshSld: [],
		nvrSearchBtn: null,
		ipcSearchBtn: null,
		infoLbl: null,
		nvrUID: 0,
	
		/**---public methods---**/
		loading: function(val)
		{
			var str = "Ready";
			if(val) str = "Loading...";
			
			c.info(str);
		},
		
		info: function(str)
		{
			c.infoLbl.setText(str);
		},
		
		buildSettings: function(ch)
		{
			c.info("Accessing IPC " + c.ipcList[ch].IP + "...");
			System.cgi.proxy_request("video_source.cgi",
			{
				uid: c.nvrUID,
				channel: "1",
				cmd: "set",
				source: "IP",
				index: "1",
				address: c.ipcList[ch].IP,
				port: c.ipcList[ch].port,
				username: "admin",
				password: "123456",
			}, function(data)
			{
				c.info("Loading image settings for IPC " + c.ipcList[ch].IP + "...");
				System.cgi.proxy_request("video_tune.cgi",
				{
					uid: c.cameras[ch].uid,
					cmd: "get",
					channel: "1"
				}, function(data)
				{
					console.log(eval(data));
					var res = eval(data);
					
					var xpos = 50+(150+15+80)*ch;
					var ypos = 310;
					var dlt = 25;
					var data = ["Bri", "Con", "Sat", "Hue"];

					var sld = [];
					for(var i=0; i<data.length; i++)
					{
						c._osd.addLabel(15+(150+15+80)*ch, ypos-TextLabel.SIZE_MEDIUM/2, data[i]);
						var lbl = c._osd.addLabel(xpos+150+15, ypos-TextLabel.SIZE_MEDIUM/2);
						sld.push(c._osd.addSlider(xpos, ypos, 150, 0, 100, Osd.CMD_INVALID, res[i].attribute[0].now, lbl));
						ypos += dlt;
					}

					c._osd.addTextButton(xpos, ypos, "Apply image settings", TestControls.CMD_APPLY_BCSH+ch); ypos+=dlt;
					c.bcshSld.push(sld);
					
					c.info("IPC connected: " + c.ipcList[ch].IP);
				});
			});
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(TestControls.CMD_SEARCH_NVR):
					c.loading(true);
					System.cgi.proxy_request("jsTree.cgi",
					{
						action: "get_marks",
						source_table: "nvr_tree",
						parent_id: "0"
					}, function(data)
					{
						if(!c.nvrList.length)
						{
							c.nvrList = eval(data);
							
							var nvr = c.nvrList[0];
							c.nvrUID = nvr.nvr_uid;
							
							c.ipcSearchBtn = c._osd.addTextButton(15, 40, nvr.name + " (" + c.nvrUID + ")", TestControls.CMD_SEARCH_IPC);
							c.nvrSearchBtn.hide();
							
							c.info(c.nvrList.length + " NVR found, press again for IPC scan");
						}
					});
					break;
					
				case(TestControls.CMD_SEARCH_IPC):
					c.loading(true);
					System.cgi.proxy_request("DeviceSearch.cgi",
					{
						key: "abcd",
						uid: c.nvrUID,
						target: "nvr"
					}, function(data)
					{
						if(!c.ipcList.length)
						{
							if(!data) c.info("Nothing found! Check IPC connection or restart service");
							else
							{
								c.ipcSearchBtn.labelMode(true);
								
								c.ipcList = eval(data);
								console.log(c.ipcList);
								
								var xpos = 15;
								var ypos = 65;
								var dlt = 25;
								xpos += dlt;
								
								for(var i=0; i<c.ipcList.length; i++)
								{
									var ipc = c.ipcList[i];
									c._osd.addTextButton(xpos, ypos, "> " + ipc.IP + " (" + ipc.uid + ")", TestControls.CMD_CONNECT_IPC+i);
									ypos += dlt;
								}
								
								c.info(c.ipcList.length + " IP cameras found, click to connect");
							}
						}
					});
					break;
			}
			
			if(cmd >= TestControls.CMD_CONNECT_IPC && cmd < TestControls.CMD_APPLY_BCSH)
			{
				var ipc = cmd-TestControls.CMD_CONNECT_IPC;
				var str = "ipc_" + ipc;
				
				var xpos = 15+(20+225)*ipc;
				var ypos = 150;
				var html = '<object id="' + str + '" type="application/x-itst-activex" events="True" progid="setup.cab#Version=0,0" clsid="{5C5FC380-2145-4458-8469-CCB7D7EF4743}" style="width: 225px; height: 135px; margin-top: ' + ypos + 'px; margin-left: ' + xpos + 'px; position: absolute;"></object>';
				c.getObject().append(html);
				
				var cam = $("#" + str)[0];
				cam.StartAutoSwitch(JSON.stringify(
				{
					uid: c.ipcList[ipc].uid,
					ch: '2',
					time: '999'
				}));

				c.cameras.push(cam);
				c.buildSettings(ipc);
			}
			
			if(cmd >= TestControls.CMD_APPLY_BCSH)
			{
				var ipc = cmd-TestControls.CMD_APPLY_BCSH;
				
				c.info("Accessing IPC " + c.ipcList[ipc].IP + "...");
				System.cgi.proxy_request("video_source.cgi",
				{
					uid: c.nvrUID,
					channel: "1",
					cmd: "set",
					source: "IP",
					index: "1",
					address: c.ipcList[ipc].IP,
					port: c.ipcList[ipc].port,
					username: "admin",
					password: "123456",
				}, function(data)
				{
					c.info("Processing image adjust...");
					System.cgi.proxy_request("video_tune.cgi",
					{
						brightness: c.bcshSld[ipc][0].getValue(),
						contrast: c.bcshSld[ipc][1].getValue(),
						saturation: c.bcshSld[ipc][2].getValue(),
						hue: c.bcshSld[ipc][3].getValue(),
						
						uid: c.nvrUID,
						cmd: "set",
						channel: "1"
					}, function(data)
					{
						c.info("Saving image settings...");
						System.cgi.proxy_request("video_tune.cgi",
						{
							brightness: c.bcshSld[ipc][0].getValue(),
							contrast: c.bcshSld[ipc][1].getValue(),
							saturation: c.bcshSld[ipc][2].getValue(),
							hue: c.bcshSld[ipc][3].getValue(),
							
							uid: c.nvrUID,
							cmd: "save",
							channel: "1"
						}, function(data)
						{
							c.info("Image adjust OK");
						});
					});
				});
			}
		}
	});
	
	c.setBackground(Osd.COLOR_WINDOW);
	c._osd.addLabel(215, 15, "Device tester", false, Osd.COLOR_SELECTED);
	c.infoLbl = c._osd.addLabel(15, c.h-TextLabel.SIZE_MEDIUM-15, "Ready", false, Osd.COLOR_SELECTED);
	c.nvrSearchBtn = c._osd.addTextButton(15, 40, "NVR search", TestControls.CMD_SEARCH_NVR);

	c._osd.setHandler(c);
	
	return c;
}

TestControls.CMD_SEARCH_NVR		= 200;
TestControls.CMD_SEARCH_IPC		= 201;
TestControls.CMD_CONNECT_IPC	= 300;
TestControls.CMD_APPLY_BCSH		= 350;