{

  // Create script undo group

  app.beginUndoGroup("Create Square");

  // create project if necessary

  var proj = app.project;
  if(!proj) proj = app.newProject();

  // create new comp named 'my comp'

  var compW = 160; // comp width
  var compH = 120; // comp height
  var compL = 15;  // comp length (seconds)
  var compRate = 24; // comp frame rate
  var compBG = [48/255,63/255,84/255] // comp background color

  var myItemCollection = app.project.items;
  var myComp = myItemCollection.addComp('my comp',compW,compH,1,compL,compRate);
  myComp.bgColor = compBG;

  // create new solid named "my square"

  var mySolid = myComp.layers.addSolid([1.0,1.0,0], "my square", 50, 50, 1);

  // create square mask

  var newMask = mySolid.Masks.addProperty("Mask");
  newMask.inverted = true;
  var myMaskShape = newMask.property("maskShape");
  var myShape = myMaskShape.value;
  myShape.vertices = [[5,5],[5,45],[45,45],[45,5]];
  myShape.closed = true;
  myMaskShape.setValue(myShape);

  // set postition keyframes

  var myPosition = mySolid.property("position");
  myPosition.setValueAtTime(0,[80,30]);
  myPosition.setValueAtTime(1,[130,60]);
  myPosition.setValueAtTime(2,[80,90]);
  myPosition.setValueAtTime(3,[30,60]);
  myPosition.setValueAtTime(4,[80,30]);

  // set rotation keyframes

  var myRotation = mySolid.property("rotation");
  myRotation.setValueAtTime(0,0);
  myRotation.setValueAtTime(4,720);

  // set scale keyframes

  var myScale = mySolid.property("scale");
  myScale.setValueAtTime(0,[100,100]);
  myScale.setValueAtTime(1,[50,50]);
  myScale.setValueAtTime(2,[100,100]);
  myScale.setValueAtTime(3,[50,50]);
  myScale.setValueAtTime(4,[100,100]);

  // set opacity keyframes

  var myOpacity = mySolid.property("opacity");
  myOpacity.setValueAtTime(0,100);
  myOpacity.setValueAtTime(1,50);
  myOpacity.setValueAtTime(2,100);
  myOpacity.setValueAtTime(3,50);
  myOpacity.setValueAtTime(4,100);

  app.endUndoGroup();

}
