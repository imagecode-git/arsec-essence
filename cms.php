<!doctype html>

<html>
	<head>
		<meta charset="windows-1251">
		<title>NESA ESSENCE</title>
		<link rel="stylesheet" href="styles/global.css">
		
		<script src="scripts/js/system/Class.js"></script>
		<script src="scripts/js/system/System.js"></script>
		<script src="scripts/js/system/AX.js"></script>
		<script src="scripts/js/system/CGI.js"></script>
		<script src="scripts/js/system/Plugin.js"></script>
		<script src="scripts/js/system/Channel.js"></script>
		<script src="scripts/js/system/ChannelManager.js"></script>
		
		<script src="scripts/js/ui/Osd.js"></script>
		<script src="scripts/js/ui/Gadget.js"></script>
		<script src="scripts/js/ui/GadgetEvent.js"></script>
		<script src="scripts/js/ui/Rectangle.js"></script>
		<script src="scripts/js/ui/Hotspot.js"></script>
		<script src="scripts/js/ui/HotspotRectangle.js"></script>
		<script src="scripts/js/ui/TextLabel.js"></script>
		<script src="scripts/js/ui/TextButton.js"></script>
		<script src="scripts/js/ui/Image.js"></script>
		<script src="scripts/js/ui/ImageButton.js"></script>
		<script src="scripts/js/ui/SVG.js"></script>
		<script src="scripts/js/ui/CheckBox.js"></script>
		<script src="scripts/js/ui/Slider.js"></script>
		<script src="scripts/js/ui/TextBox.js"></script>
		<script src="scripts/js/ui/TextInput.js"></script>
		<script src="scripts/js/ui/Container.js"></script>
		<script src="scripts/js/ui/Window.js"></script>
		<script src="scripts/js/ui/Grid.js"></script>
		<script src="scripts/js/ui/Accordion.js"></script>
		<script src="scripts/js/ui/AccordionItem.js"></script>
		<script src="scripts/js/ui/Tree.js"></script>
		<script src="scripts/js/ui/TreeItem.js"></script>
		<script src="scripts/js/ui/Scroller.js"></script>
		<script src="scripts/js/ui/ScrollerButton.js"></script>
		<script src="scripts/js/ui/TabBar.js"></script>
		<script src="scripts/js/ui/TabButton.js"></script>
		<script src="scripts/js/ui/Rating.js"></script>
		<script src="scripts/js/ui/RatingItem.js"></script>
		<script src="scripts/js/ui/LogFilter.js"></script>
		<script src="scripts/js/ui/DateTimePicker.js"></script>
		<script src="scripts/js/ui/Calendar.js"></script>
		<script src="scripts/js/ui/CalendarButton.js"></script>
		<script src="scripts/js/ui/Clock.js"></script>

		<script src="scripts/js/ui/section/LoginMenu.js"></script>
		<script src="scripts/js/ui/section/MainMenu.js"></script>
		<script src="scripts/js/ui/dialog/TestControls.js"></script>
		
		<script src="scripts/js/ui/panels/Panel.js"></script>
		<script src="scripts/js/ui/panels/ShortcutPanel.js"></script>
		<script src="scripts/js/ui/panels/NavigationPanel.js"></script>
		<script src="scripts/js/ui/panels/NotificationPanel.js"></script>
		<script src="scripts/js/ui/panels/DeviceSettingsPanel.js"></script>
		
		<script src="scripts/js/ui/dialog/LoginDialog.js"></script>
		<script src="scripts/js/ui/dialog/LoadingDialog.js"></script>
		
		<script src="scripts/js/ui/effects/Vignette.js"></script>
		
		<script src="scripts/js/util/Keys.js"></script>
		<script src="scripts/js/util/Math.js"></script>
		
		<script src="scripts/js/lib/jquery-2.0.3.min.js"></script>
		<script src="scripts/js/lib/modernizr.custom.76302.js"></script>
		<script src="scripts/js/lib/jQueryRotate.js"></script>
		<script src="scripts/js/lib/jquery.easing.1.3.js"></script>
		<script src="scripts/js/lib/jquery.mousewheel.js"></script>
	</head>
	
	<body>
		<script>
			var rootObject = $("body");
			var system = new System();
			
			function UIPluginEventSource(m_nEventType, m_strEventMsg)
			{
				var m = m_strEventMsg;
				
				switch(m_nEventType)
				{
					case(0x9913):
						System.plugins[0].execute(m);
						//some callback here?
						break;
				}
			}
			
			system.init(rootObject);
		</script>
	</body>
</html>