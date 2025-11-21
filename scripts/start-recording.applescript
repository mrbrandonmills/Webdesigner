tell application "QuickTime Player"
	activate
	new screen recording
	delay 1
end tell

tell application "System Events"
	tell process "QuickTime Player"
		click button 1 of window 1
	end tell
end tell
