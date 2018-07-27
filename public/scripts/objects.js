
//Introducing Mr. Sprite Object!
var spriteObject =
{
    //Source image dimensions
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 0,
    sourceHeight: 0,
            
    //Positions and dimensions on canvas
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    vx: 0,
    vy: 0,
    vRot: 0,
    visible: true,
    rotation: 0, 
    alpha: 1,
    shadow: false,
    image: null,
    dir: 0,
    name: "gameSprite",
    //life: 0,
    
    //Colission detection
    centerX: function()
    {
        return this.x + (this.width / 2);
    },
    centerY: function()
    {
        return this.y + (this.height / 2);
    },
    halfWidth: function()
    {
        return this.width / 8;
    },
    halfHeight: function()
    {
        return this.height / 8;
    },
    
    //resets all variables
};

//camera object
var camera =
{
  x: 154, //should maintain proportion.  
  y: 74,
  width: 340,
  height: 343
};


