{
  // animateRandomHexagons.jsx
	//
	// This script selects a random 3 layers from a list of selected layers, and adds scaling keyframes every interval


  function AnimateHexagons(thisObj){

    var scriptName = "Scale Composition";
    var composition = app.project.activeItem;
    var randomCount = 3;
    var maxTime = 1.0;
    var intervalTime = 1.0;
    var keyframe_1 = 0;
    var keyframe_2 = 0.5;
    var keyframe_3 = intervalTime;
    var keyframe_4 = intervalTime + 0.5;
    var scaleHide = 0;
    var scaleShow = 18.8;
    var scaleValue;

    function onConfirmClick() {

      // $.writeln("onConfirmClick initiated");

      app.beginUndoGroup("Add Hex Animations");

      if(composition instanceof CompItem) {

        var hexagons = composition.selectedLayers;

        /* If layers are selected */
        if(hexagons.length > 0){
          // $.writeln("hexagons found");

          // Validate the input field, in case the user didn't defocus it first (which often can be the case).
  				this.parent.parent.optsRow.duration_input.notify("onChange");
  				this.parent.parent.optsRow.interval_input.notify("onChange");

          // $.writeln("maxTime: " + maxTime);
          // $.writeln("intervalTime: " + intervalTime);

          composition.workAreaDuration = maxTime;
          app.executeCommand(app.findMenuCommandId("Trim Comp to Work Area"));

          var keyframeFunctions = [];
          // var keyframeFunctionArguments = [];

          /* for each interval */
          for (var i = 0; i < maxTime; i = i + intervalTime) {
            // $.writeln("interval: " + i);

            keyframe_1 = i;
            keyframe_2 = i + 0.5;
            keyframe_3 = i + intervalTime;
            keyframe_4 = i + intervalTime + 0.5;


            /* get random layers */
            var randomLayers = selectRandomLayers(3, hexagons);

            /* for each random layer */
            for (var j = 0; j < randomLayers.length; j++) {
              // $.writeln("random layer:" + randomLayers[j].name);
              var keyframeFunction = makeKeyframeFunction(randomLayers[j], keyframe_1, keyframe_2, keyframe_3, keyframe_4);
              keyframeFunctions.push( keyframeFunction );
            }

          }

          for (var i = 0; i < keyframeFunctions.length; i++) {
            // $.writeln("keyframeFuntion: " + i);
            keyframeFunctions[i]();
          }

        } else {
           alert("select at least one layer");
        }
      } else {
        alert("please select a composition");
      }

      function selectRandomLayers(numberOfLayers, array) {
        // $.writeln("selectRandomLayer initiated");

        var randomElements = [];

        var indexArray = []
        while(indexArray.length < numberOfLayers){
          var randomIndex = Math.floor( Math.random() * array.length );
          if( indexArray.indexOf(randomIndex) > -1 ) continue;
          indexArray[indexArray.length] = randomIndex;
          randomElements.push( array[randomIndex] );
        }

        return randomElements;

      }

      function makeKeyframeFunction(randomElement, keyframe_1, keyframe_2, keyframe_3, keyframe_4) {
        // $.writeln("makeKeyframeFunction initiated");
        $.writeln(randomElement.name);

        return function keyframeFunction() {

          hexScale = randomElement.property("scale");
          scaleValue = hexScale.valueAtTime(keyframe_1, false);

          /* if the first keyframe in this interval is not 0, don't add a 0 scale keyframe */
          if (scaleValue[0] !== 0) {
            hexScale.setValueAtTime(keyframe_1, [scaleShow, scaleShow]);
          } else {
            hexScale.setValueAtTime(keyframe_1, [scaleHide, scaleHide]);
          }
          hexScale.setValueAtTime(keyframe_2, [scaleShow, scaleShow]);
          hexScale.setValueAtTime(keyframe_3, [scaleShow, scaleShow]);
          hexScale.setValueAtTime(keyframe_4, [scaleHide, scaleHide]);

          /* add easing to all the keyframes */
          hexScale.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
          hexScale.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
          hexScale.setInterpolationTypeAtKey(3, KeyframeInterpolationType.BEZIER);
          hexScale.setInterpolationTypeAtKey(4, KeyframeInterpolationType.BEZIER);

        }
      }

      app.endUndoGroup();

    }


		//
		// This function is called when the user enters text for the scale.
		//
		function on_duration_change() {
      // $.writeln("duration change initiated");
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				// Set the maxTime based on the text.
				var value = this.text;
				if (isNaN(value)) {
					alert(value + " is not a number. Please enter a number.", scriptName);
				} else {
					maxTime = parseInt(value);
				}
			}
      $.writeln(maxTime);
		}
		//
		// This function is called when the user enters text for the scale.
		//
		function on_interval_change() {
      // $.writeln("interval change initiated");
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				// Set the maxTime based on the text.
				var value = this.text;
				if (isNaN(value)) {
					alert(value + " is not a number. Please enter a number.", scriptName);
				} else {
					intervalTime = parseInt(value);
				}
			}
      $.writeln(intervalTime);
		}


    //
		// This function puts up a modal dialog asking for a maxTime.
		// Once the user enters a value, the dialog closes, and the script scales the comp.
		//
		function BuildAndShowUI(thisObj) {
			// Create and show a floating palette.
			var duration_palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable:true});
			if (duration_palette != null)
			{
				var res =
					"group { \
						orientation:'column', alignment:['fill','top'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
						introStr: StaticText { text:'Hexagon Animation Settings', alignment:['left','center'] }, \
						optsRow: Group { \
							orientation:'column', alignment:['fill','top'], \
							duration_title: StaticText { text:'Duration (s)', alignment:['fill','top'], value:'true' }, \
							duration_input: EditText { text:'1.0', alignment:['left','top'], preferredSize:[80,20] }, \
							interval_title: StaticText { text:'Interval (s)', alignment:['fill','top'], value:'true' }, \
							interval_input: EditText { text:'1.0', alignment:['left','top'], preferredSize:[80,20] }, \
						}, \
						cmds: Group { \
							alignment:['fill','top'], \
							okButton: Button { text:'Create Keyframes', alignment:['fill','center'] }, \
						}, \
					}";

				duration_palette.margins = [10,10,10,10];
				duration_palette.grp = duration_palette.add(res);

				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels.
				var winGfx = duration_palette.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				duration_palette.grp.optsRow.duration_input.graphics.foregroundColor = darkColorBrush;
				duration_palette.grp.optsRow.interval_input.graphics.foregroundColor = darkColorBrush;

				// Set the callback. When the user enters text, this will be called.
				duration_palette.grp.optsRow.duration_input.onChange = on_duration_change;
				duration_palette.grp.optsRow.interval_input.onChange = on_interval_change;

				duration_palette.grp.cmds.okButton.onClick = onConfirmClick;

				duration_palette.onResizing = duration_palette.onResize = function () {this.layout.resize();}
			}

			return duration_palette;
		}


    //
		// The main script.
		//
		if (parseFloat(app.version) < 8) {
			alert("This script requires After Effects CS3 or later.", scriptName);
			return;
		}

		var duration_palette = BuildAndShowUI(thisObj);
		if (duration_palette != null) {
			if (duration_palette instanceof Window) {
				duration_palette.center();
				duration_palette.show();
			} else {
				duration_palette.layout.layout(true);
				duration_palette.layout.resize();
			}
		} else {
			alert("Could not open the user interface.", scriptName);
		}

  }

  AnimateHexagons(this);
}
