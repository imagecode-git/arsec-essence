function Calendar(ow, o, d)
{
	/**---private properties---**/
	var monthTitles = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	var c = new Container(ow, o, System.SCREEN_X/2-380/2, System.SCREEN_Y/2-240/2, 0, 0); //fix XY pos!
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		dayButtons: [],
		prevMonthBtn: null,
		nextMonthBtn: null,
		prevYearBtn: null,
		nextYearBtn: null,
		monthLbl: null,
		yearLbl: null,
		fontSize: TextLabel.SIZE_LARGE,
		pinSize: 11,
		spacing: 0, //quarter of font size
		padding: 1, //distance between day buttons
		curDate: d || new Date(),
		curDay: 1, //used only to switch between dates, to get actual day number use getDay() instead
		pickedIdx: -1,
		holder: null,
		
		/**---public methods---**/
		build: function()
		{
			var px = 0;
			var py = 0;
			
			var maxwidth = 7*(CalendarButton.WIDTH+c.padding)/*+c.padding+CalendarButton.WIDTH/2*/;
			var maxheight = 6*(CalendarButton.HEIGHT+c.padding);

			py+=2*c.fontSize-c.spacing;
			maxheight += py;
			
			py = py/2-c.pinSize/2-1;
			
			//month switcher
			c.monthLbl = c._osd.addLabel(2*c.pinSize, c.spacing, "Month", false, Osd.COLOR_TEXT, c.fontSize);
			c.prevMonthBtn = c._osd.addImageButton(c.spacing, py, c.pinSize, c.pinSize, Calendar.BTN_LF, Calendar.CMD_PREV_MONTH);
			c.nextMonthBtn = c._osd.addImageButton(c.spacing+94, py, c.pinSize, c.pinSize, Calendar.BTN_RG, Calendar.CMD_NEXT_MONTH);
			
			//year switcher
			c.yearLbl = c._osd.addLabel(maxwidth-2*c.pinSize-40, c.spacing, "Year", false, Osd.COLOR_TEXT, c.fontSize);
			c.prevYearBtn = c._osd.addImageButton(maxwidth-c.spacing-c.pinSize-56, py, c.pinSize, c.pinSize, Calendar.BTN_LF, Calendar.CMD_PREV_YEAR);
			c.nextYearBtn = c._osd.addImageButton(maxwidth-c.spacing-c.pinSize, py, c.pinSize, c.pinSize, Calendar.BTN_RG, Calendar.CMD_NEXT_YEAR);

			py+=c.fontSize+c.spacing-c.padding;
			py++;
			
			c.holder = new Rectangle(null, px, py, 0, 0, Osd.COLOR_WINDOW);
			c.getContainer().append(c.holder.getHtml());
			
			var procIdx = 0;
			var dlt = 0;
			
			for(var i=0; i<6; i++)
			{
				for(var j=0; j<7; j++)
				{
					px = ((CalendarButton.WIDTH+1)*j)+1;
					/*if(j>4) dlt = CalendarButton.WIDTH/2;
					else dlt = 0;*/
					c.dayButtons.push(new CalendarButton(c, c._osd, px+dlt, py, procIdx));
					procIdx++;
				}

				py+=CalendarButton.HEIGHT+1;
			}
			
			//c.setBackground(Osd.COLOR_WINDOW);
			c.holder.setWidth(maxwidth);
			c.holder.setHeight(maxheight);
			
			c.setWidth(maxwidth);
			c.setHeight(maxheight);
		},
		
		rebuild: function()
		{
			var past = 0;
			var present = 0;
			var future = 0;
			
			var dlt = c.getWeekDay(new Date(c.getYear(), c.getMonth(), 1));
			var daysPast = c.getDays(c.getPast(true).getMonth());
			var daysPresent = c.getDays(c.getMonth());
			
			var procDate;
			var dayNum;
			var weekNum = 0;
			var btnType;
			
			procIdx = 0;
			c.pickedIdx = -1;
			var picked = false;
			
			for(var i=0; i<c.dayButtons.length; i++)
			{
				if(past < dlt)
				{
					btnType = CalendarButton.TYPE_PAST;
					
					dayNum = daysPast-dlt+past+1;
					procDate = new Date(c.getPast(true).getFullYear(), c.getPast(true).getMonth(), daysPast-dlt+past+1);
					past++;
				}
				else
				{
					if(present < daysPresent)
					{
						btnType = CalendarButton.TYPE_PRESENT;
						
						dayNum = present+1;
						procDate = new Date(c.getYear(), c.getMonth(), dayNum);
						present++;
						
						if(!picked)
						{
							if(procDate.getDate() == c.getDay()) c.pickedIdx = procIdx;
						}
					}
					else
					{
						btnType = CalendarButton.TYPE_FUTURE;
						
						dayNum = future+1;
						procDate = new Date(c.getFuture(true).getFullYear(), c.getFuture(true).getMonth(), dayNum);
						future++;
					}
				}
				
				var btn = c.dayButtons[i];
				btn.setDay(dayNum);
				btn.setType(btnType);
				
				if(btn.selected && btn.idx != c.pickedIdx) btn.select(false);
				
				if(c.pickedIdx >= 0 && procIdx == c.pickedIdx)
				{
					if (!picked)
					{
						btn.select(true);
						picked = true;
					}
				}
				
				procIdx++;
				if(!(procIdx%7)) weekNum++;
			}
			
			c.curDay = c.getDay(); //prevents bugs while switching between past and future
		},
		
		compareDate: function(date)
		{
			var e = 0;
			
			if(c.getDay() == date.getDate())		e++;
			if(c.getMonth() == date.getMonth())		e++;
			if(c.getYear() == date.getFullYear())	e++;
			
			if(e == 3) return true;
			return false;
		},
		
		setDate: function(val)
		{
			c.curDate.setFullYear(val.getFullYear());
			c.curDate.getMonth(val.getMonth());
			c.curDate.setDate(val.getDate());
		},
		
		setMonth: function(val)
		{
			c.monthLbl.setText(monthTitles[val]);
			
			//additionally centering month label
			var pivot = c.prevMonthBtn.getPos()[0];
			var len = c.nextMonthBtn.getPos()[0]-pivot;
			var center = pivot+len/2;
			var newx = center-c.monthLbl.getWidth()/2+1;
			
			c.monthLbl.setPos(parseInt(pivot+newx), c.monthLbl.getPos()[1]);
		},
		
		setYear: function(val)
		{
			c.yearLbl.setText(val);
			
			//more specific centering
			var pivot = c.prevYearBtn.getPos()[0];
			var len = c.nextYearBtn.getPos()[0]-pivot;
			var center = len/2;
			var newx = center-c.yearLbl.getWidth()/2+c.pinSize/2;
			
			c.yearLbl.setPos(parseInt(pivot+newx), c.yearLbl.getPos()[1]);
		},
		
		setDay: function(val)
		{
			c.curDate = new Date(c.getYear(), c.getMonth(), val);
		},
		
		getYear: function()
		{
			return c.curDate.getFullYear();
		},
		
		getMonth: function()
		{
			return c.curDate.getMonth();
		},
		
		getDay: function()
		{
			return c.curDate.getDate();
		},
		
		getWeekDay: function(date)
		{
			var day = date.getDay();
			
			if(day == 0) day = 6;
			else day--;
			
			return day;
		},
		
		//total days in month
		getDays: function(m)
		{
			var result = 0;
			
			if(m == 3 || m == 5 || m == 8 || m == 10) return 30;
			else
			{
				if(m == 1)
				{
					if(!(c.curDate.getFullYear() % 4)) result = 29;
					else result = 28;
				}
				else result = 31;
			}
			
			return result;
		},
		
		getPast: function(bypass) //bypass will force to get past anyway, even if switching to the previous year is not allowed
		{
			var y = c.getYear();
			var m = c.getMonth();
			
			if(m == 0)
			{
				if(y > Calendar.MIN_YEAR)
				{
					y--;
					m = 11;
				}
				else
				{
					if(bypass)
					{
						y--;
						m = 11;
					}
					else return null;
				}
			}
			else
			{
				m--;
			}
			
			return new Date(y, m);
		},
		
		getFuture: function(bypass) //same bypass functionality for the future
		{
			var y = c.getYear();
			var m = c.getMonth();
			
			if(m == 11)
			{
				if(y < Calendar.MAX_YEAR)
				{
					y++;
					m = 0;
				}
				else
				{
					if(bypass)
					{
						y++;
						m = 0;
					}
					else return null;
				}
			}
			else m++;
			
			return new Date(y, m);
		},
		
		osdCommand: function(cmd)
		{
			var year = c.curDate.getFullYear();
			var newDate = null;
			
			switch(cmd)
			{
				case(Calendar.CMD_PREV_MONTH):
					newDate = c.getPast();

					if(newDate)
					{
						var maxdays = c.getDays(newDate.getMonth());
						if(c.curDay > maxdays) newDate.setDate(maxdays);
						else newDate.setDate(c.curDay);
						
						c.curDate = newDate;
						c.setMonth(newDate.getMonth());
						
						if(c.getYear() != year)
						{
							c.curDate.setYear(c.getYear()+1); //fixing year, since osdCommand will check it once again and attempt to apply a double increase
							c.osdCommand(Calendar.CMD_PREV_YEAR);
						}
						else c.rebuild();
					}
					break;
					
				case(Calendar.CMD_NEXT_MONTH):
					newDate = c.getFuture();

					if(newDate)
					{
						var maxdays = c.getDays(newDate.getMonth());
						if(c.curDay > maxdays)
						{
							newDate.setDate(maxdays);
							c.curDay = maxdays;
						}
						else newDate.setDate(c.curDay);
					
						c.curDate = newDate;
						c.setMonth(newDate.getMonth());
						
						if(c.getYear() != year)
						{
							c.curDate.setYear(c.getYear()-1); //same year value fix here
							c.osdCommand(Calendar.CMD_NEXT_YEAR);
						}
						else c.rebuild();
					}
					break;
					
				case(Calendar.CMD_PREV_YEAR):
					if(year > Calendar.MIN_YEAR)
					{
						year--;
						c.curDate.setFullYear(year);
						c.setYear(year);
						
						c.rebuild();
					}
					break;
					
				case(Calendar.CMD_NEXT_YEAR):
					if(year < Calendar.MAX_YEAR)
					{
						year++;
						c.curDate.setFullYear(year);
						c.setYear(year);
						
						c.rebuild();
					}
					break;
			}
			
			if(cmd >= Calendar.CMD_DATE_PICK)
			{
				var newIdx = cmd - Calendar.CMD_DATE_PICK;
				if(c.dayButtons)
				{
					c.pickedIdx = newIdx;
					c.curDay = c.dayButtons[c.pickedIdx].getDay();
				
					switch(c.dayButtons[c.pickedIdx].type)
					{
						case(CalendarButton.TYPE_PAST): //date from past month has been picked
							c.osdCommand(Calendar.CMD_PREV_MONTH);
							break;
							
						case(CalendarButton.TYPE_PRESENT):
							c.setDay(c.curDay);
							c.rebuild();
							break;
							
						case(CalendarButton.TYPE_FUTURE): //some date from the future is picked
							c.osdCommand(Calendar.CMD_NEXT_MONTH);
							break;
					}
				}
			}
		}
	});
	
	c.spacing = parseInt(c.fontSize/4);
	c.build();
	c.rebuild();
	
	c.setMonth(c.curDate.getMonth());
	c.setYear(c.curDate.getFullYear());
	c.curDay = c.getDay();
	
	c.setAlpha(System.DEF_ALPHA);
	
	return c;
}

/**---static variables---**/
Calendar.CMD_PREV_MONTH	= 200;
Calendar.CMD_NEXT_MONTH	= 201;
Calendar.CMD_PREV_YEAR	= 202;
Calendar.CMD_NEXT_YEAR	= 203;
Calendar.CMD_DATE_PICK	= 300;

Calendar.MIN_YEAR = 2000;
Calendar.MAX_YEAR = 2038;

Calendar.REBUILD_PAST	= 0;
Calendar.REBUILD_FUTURE	= 1;

Calendar.BTN_LF	= ["pinLeft_normal.png", "pinLeft_hover.png", "pinLeft_press.png"];
Calendar.BTN_RG	= ["pinRight_normal.png", "pinRight_hover.png", "pinRight_press.png"];