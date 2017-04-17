{

  // Create script undo group

  app.beginUndoGroup("Add Hex Animations");

  var composition = app.project.activeItem;
  var randomCount = 3;
  var maxTime = 30;
  var intervalTime = 2;
  var keyframe_1 = 0;
  var keyframe_2 = 0.5;
  var keyframe_3 = intervalTime;
  var keyframe_4 = intervalTime + 0.5;
  var scaleHide = 0;
  var scaleShow = 18.8;
  var scaleValue;

  if(composition instanceof CompItem) {

    var hexagons = composition.selectedLayers;

    /* If layers are selected */
    if(hexagons.length > 0){

      var keyframeFunctions = [];
      // var keyframeFunctionArguments = [];

      /* for each interval */
      for (var i = 0; i < maxTime; i = i + intervalTime) {

        keyframe_1 = i;
        keyframe_2 = i + 0.5;
        keyframe_3 = i + intervalTime;
        keyframe_4 = i + intervalTime + 0.5;


        /* get random layers */
        var randomLayers = selectRandomLayers(3, hexagons);

        /* for each random layer */
        for (var j = 0; j < randomLayers.length; j++) {
          var keyframeFunction = makeKeyframeFunction(randomLayers[j], keyframe_1, keyframe_2, keyframe_3, keyframe_4);
          keyframeFunctions.push( keyframeFunction );

          // keyframeFunctionArguments.push( {
          //   element: randomLayers[j],
          //   keyframe_1: keyframe_1,
          //   keyframe_2: keyframe_2,
          //   keyframe_3: keyframe_3,
          //   keyframe_4: keyframe_4,
          // } );

        }

      }

      for (var i = 0; i < keyframeFunctions.length; i++) {
        keyframeFunctions[i]();
      }

      // for (var k = 0; k < keyframeFunctionArguments.length; k++) {
      //   keyframeFunction( keyframeFunctionArguments[k] )
      // }

    } else {
       alert("select at least one layer");
    }
  } else {
    alert("please select a composition");
  }

  function selectRandomLayers(numberOfLayers, array) {

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


  // Close script undo group

  app.endUndoGroup();

}
