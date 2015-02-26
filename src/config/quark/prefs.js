const ShortcutKeycode = 30 // right square bracket ]
    , ShortcutModifier = 1572864; // cmd + alt

// default pop-over global
quark.addKeyboardShortcut({
    keycode: ShortcutKeycode,
    modifierFlags: ShortcutModifier,
    callback: function () {
        quark.openPopup()
    }
})

quark.setupPreferences([
  {
    "label": "Data", "identifier": "data", "icon": "NSPreferencesGeneral", "height": 280,
  },
  {
    "label": "Shortcuts", "identifier": "shortcut", "icon": "NSAdvanced", "height": 250,
    "nativeComponents": [{
        type: "ShortcutRecorder",
        options: {
            x: 140,
            y: 40,
            keycode: ShortcutKeycode,
            modifierFlags: ShortcutModifier,
            onChange: function (keycode, modifierFlags) {
                console.log("New shortcut:", keycode, modifierFlags)
                quark.clearKeyboardShortcut()
                quark.addKeyboardShortcut({
                    keycode: keycode,
                    modifierFlags: modifierFlags,
                    callback: function () {
                        quark.openPopup()
                    }
                })
            }
        }
    }]
  }
]);