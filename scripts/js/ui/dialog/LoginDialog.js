function LoginDialog(ow, o, m)
{
	/**---private properties---**/
	var wnd = new Window(ow, o, 0, 0, 525, 300, true);
	
	var saveUser = false;
	var autoLogin = false;
	
	/**---extends Window---**/
	wnd.extend(
	{
		/**---protected properties---**/
		loginMenu: m,
	
		/**---public methods---**/
		buildInterface: function()
		{
			var xpos = 131;
			var ypos = 25;
			wnd.logo = wnd._osd.addImage(xpos, ypos, 262, 20, "essence_logo.png");
			
			var data = ["User", "Password", "IP", "Port"];
			var dlt = 45;
			xpos = 20;
			ypos = 75;
			wnd.mainLbl = [];
			for(var i=0; i<data.length; i++)
			{
				wnd.mainLbl[i] = wnd._osd.addLabel(xpos, ypos, data[i]);
				ypos += dlt;
			}
			
			xpos = 110;
			ypos = 70;
			dlt = 45;
			data = ["admin", "123456", "localhost", "8080"];
			wnd.mainTInput = [];
			for(var i=0; i<data.length; i++)
			{
				var type = TextInput.TYPE_DEFAULT;
				var size = size = TextLabel.SIZE_MEDIUM;
				var width = 310;
				
				if(i==1) type = TextInput.TYPE_PASSWORD;
			
				wnd.mainTInput[i] = wnd._osd.addTextInput(xpos, ypos, width, data[i], type, size);
				ypos += dlt;
			}
			
			var states = [saveUser, autoLogin];
			xpos = 125;
			ypos = 248;
			dlt = 25;
			data = ["Save user", "Auto login"];
			wnd.mainCBox = [];
			for(var i=0; i<data.length; i++)
			{
				wnd.mainCBox[i] = wnd._osd.addCheckBox(xpos, ypos, LoginDialog.CMD_SAVE_USER+i, data[i]);
				wnd.mainCBox[i].check(states[i]);
				ypos += dlt;
			}
			
			wnd.mainTBtn = wnd._osd.addTextButton(340, 257, "Login", LoginDialog.CMD_LOGIN);
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(LoginDialog.CMD_SAVE_USER):
					saveUser = wnd.mainCBox[0].checked;
					break;
					
				case(LoginDialog.CMD_AUTO_LOGIN):
					autoLogin = wnd.mainCBox[1].checked;
					break;
					
				case(LoginDialog.CMD_LOGIN):
					System.serverIP = wnd.mainTInput[2].getValue();
					System.serverPort = wnd.mainTInput[3].getValue();
					saveUser = wnd.mainCBox[0].checked;
					autoLogin = wnd.mainCBox[1].checked;
					
					System.loading = new LoadingDialog(ow, o);
					System.loading.show();
					
					System.cgi.login(System.serverIP, System.serverPort, wnd.mainTInput[0].getValue(), wnd.mainTInput[1].getValue(), autoLogin, saveUser, "en-us", function(data)
					{
						if(eval(data)[0])
						{
							System.cgi.getUID(function(data)
							{
								System.loading.hide();
								
								wnd.loginMenu.vignette.finalize();
								wnd.fadeOut();
								
								System.uid = data;
								System.mainMenu = new MainMenu(ow, o);
							});
						}
						else
						{
							System.loading.hide();
							alert("login FAILED");
						}
					});
					
					break;
			}
		}
	});
	
	wnd.buildInterface();
	wnd.center();
	
	wnd.osdCommand(LoginDialog.CMD_LOGIN); //debug autologin
}

/**---static variables---**/
LoginDialog.CMD_SAVE_USER	= 200;
LoginDialog.CMD_AUTO_LOGIN	= 201;
LoginDialog.CMD_LOGIN		= 202;