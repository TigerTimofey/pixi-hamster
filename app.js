const Application = PIXI.Application;
const Container = PIXI.Container;

const app = new Application({
  // ... your app configuration
});

const menuContainer = new Container();
app.stage.addChild(menuContainer);
app.renderer.backgroundColor = 0x0000ff;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.width = "100%";
app.renderer.view.style.height = "100%";

const style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 45,
  fontWeight: "bold",
  fill: ["#00ddff", "#00ff04"],
  stroke: "#4a1850",
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: "round",
});

const logoText = new PIXI.Text("FOREST RUN", style);
logoText.anchor.set(0.5);
logoText.position.set(app.screen.width / 2, app.screen.height / 2 - 300);

const startButton = new PIXI.Sprite(
  PIXI.Texture.from("./images/startgame.png")
);
startButton.anchor.set(0.5);
startButton.position.set(app.screen.width / 2, app.screen.height / 2 - 200);

startButton.interactive = true;
startButton.buttonMode = true;
startButton.on("pointertap", startGame);

document.body.appendChild(app.view);

const cloudsMenuTexture = PIXI.Texture.from("./images/clouds.png");
const cloudsMenuSprite = new PIXI.TilingSprite(
  cloudsMenuTexture,
  app.screen.width,
  app.screen.height
);
app.ticker.add(function () {
  cloudsMenuSprite.tilePosition.x += 1;
});
cloudsMenuSprite.tileScale.set(0.5);

const groundMenuTexture = PIXI.Texture.from("./images/ground.png");

const groundenuSprite = new PIXI.TilingSprite(
  groundMenuTexture,
  app.screen.width,
  app.screen.height
);
groundenuSprite.tileScale.set(0.55);

menuContainer.addChild(cloudsMenuSprite);
menuContainer.addChild(groundenuSprite);
menuContainer.addChild(startButton);
menuContainer.addChild(logoText);

// Function to start the game
function startGame() {
  // Remove the menu container from the stage
  app.stage.removeChild(menuContainer);

  // Start the main game logic
  startMainGame();
}
function startMainGame() {
  const audioCoin = new Audio("./audio/coin.wav");
  const gameOver = new Audio("./audio/gameover.wav");

  const fontMusicBg = new Audio("./audio/bgmusic.mp3");
  fontMusicBg.loop = true;
  fontMusicBg.play();

  const app = new Application({
    // width: 500,
    // height: 500,
    transparent: false,
    antialias: true,
  });

  app.renderer.backgroundColor = 0x0000ff;
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.renderer.view.style.position = "absolute";
  document.body.appendChild(app.view);
  const loader = PIXI.Loader.shared;

  //ANIMATION CHARACTER

  loader.add("tileset", "./images/spritesheet.json").load(setup);
  const gsap = window.gsap;

  function setup(loader, resources) {
    const textures = [];
    for (let i = 1; i < 4; i++) {
      const texture = PIXI.Texture.from(`RunRight0${i}.png`);
      textures.push(texture);
    }

    const drag = new PIXI.AnimatedSprite(textures);

    drag.position.set(0, 750);
    drag.scale.set(2, 2);
    app.stage.addChild(drag);
    drag.play();
    drag.animationSpeed = 0.2;

    //Collision for Coins and Count
    function collision(a, b) {
      let firstObj = a.getBounds();
      let secondObj = b.getBounds();
      let tolerance = 100;
      return (
        Math.abs(firstObj.x - secondObj.x) <= tolerance &&
        Math.abs(firstObj.y - secondObj.y) <= tolerance
      );
    }
    //Collision for Rocks
    function collisionRocks(a, b) {
      let firstObj = a.getBounds();
      let secondObj = b.getBounds();
      let tolerance = 70;
      return (
        Math.abs(firstObj.x - secondObj.x) <= tolerance &&
        Math.abs(firstObj.y - secondObj.y) <= tolerance
      );
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        gsap.to(drag, { x: "+=50", duration: 0.3, ease: "power2.out" });
        if (drag.x > 1800) {
          resetRockPosition();
          function resetRockPosition() {
            drag.x = -106;
          }
        }
      }

      if (e.key === "ArrowLeft") {
        gsap.to(drag, { x: "-=50", duration: 0.3, ease: "power2.out" });
        if (drag.x < -105) {
          resetRockPosition();
          function resetRockPosition() {
            drag.x = 1800;
          }
        }
      }

      if (e.key === "ArrowUp" || e.key === " ") {
        const originalY = drag.y;
        const jumpHeight = 200;
        const jumpDuration = 0.32; // in seconds

        gsap.to(drag, {
          y: originalY - jumpHeight,
          duration: jumpDuration,
          ease: "power2.out",
          onComplete: function () {
            gsap.to(drag, {
              y: 750,
              x: "+=0",
              duration: jumpDuration,
              ease: "power1.in",
            });
          },
        });
      }
    });
    //Mobile
    app.renderer.view.addEventListener("touchstart", onScreenTouch);
    function onScreenTouch(event) {
      event.preventDefault();
      jumpPlayer();
    }

    function jumpPlayer() {
      const originalY = drag.y;
      const jumpHeight = 200;
      const jumpDuration = 0.32; // in seconds

      gsap.to(drag, {
        y: originalY - jumpHeight,
        duration: jumpDuration,
        ease: "power2.out",
        onComplete: function () {
          gsap.to(drag, {
            y: 750,
            x: "+=0",
            duration: jumpDuration,
            ease: "power1.in",
          });
        },
      });
    }
    //Add Collision drag and money
    let numberCoin = 0;
    app.ticker.add(function () {
      drag.position.x += 0;

      //Text for count
      const style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fontStyle: "italic",
        fontWeight: "bold",
        fill: ["#ffffff", "#00ff99"], // gradient
        stroke: "#4a1850",
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: "round",
      });
      const richText = new PIXI.Text(`COUNT: ${numberCoin}`, style);
      richText.x = 50;
      richText.y = 100;

      app.stage.addChild(richText);
      // Check collision between drag and moneySprite
      if (collision(drag, moneySprite)) {
        console.log("Collision detected between drag and moneySprite");
        setTimeout(() => {
          moneySprite.width = 10;
          moneySprite.height = 10;
          audioCoin.play();
          numberCoin++;
          richText.text = `COUNT: ${numberCoin}`;
          if (moneySprite.width == 10) {
            moneySprite.x = 2400;
            moneySprite.width = 150;
            moneySprite.height = 150;
          }

          const min = 200;
          const max = 550;
          const randomCoinPosition = Math.random() * (max - min + 1) + min;
          moneySprite.y = randomCoinPosition;
        }, 100);
      }
      // Check collision between drag and rock
      if (collisionRocks(drag, rockSprite)) {
        console.log("Collision detected between drag and moneySprite");
        drag.stop();

        drag.texture = PIXI.Texture.from(`./images/gameover.png`);
        drag.width = 150;
        drag.height = 120;
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            // x: "+=500",
            duration: 3.3,
            ease: "power2.out",
          });

          gameOver.play();

          document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowUp" || e.key === " ") {
              const fart = new Audio("./audio/fart.mp3");
              fart.play();
            }
          });

          setTimeout(() => {
            location.reload();
          }, 5000);
        }, 100);
      }
      // Check collision between drag and rockSecond
      if (collisionRocks(drag, rockSecondSprite)) {
        console.log("Collision detected between drag and ROCK");
        drag.stop();

        drag.texture = PIXI.Texture.from(`./images/gameover.png`);
        drag.width = 150;
        drag.height = 120;
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            duration: 3.3,
            ease: "power2.out",
          });
          gameOver.play();

          document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowUp" || e.key === " ") {
              const fart = new Audio("./audio/fart.mp3");
              fart.play();
            }
          });

          setTimeout(() => {
            location.reload();
          }, 5000);
        }, 100);
      }
      // Check collision between drag and rockFourth
      if (collisionRocks(drag, rockFourthSprite)) {
        console.log("Collision detected between drag and ROCK");
        drag.stop();

        drag.texture = PIXI.Texture.from(`./images/gameover.png`);
        drag.width = 150;
        drag.height = 120;
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            duration: 3.3,
            ease: "power2.out",
          });
          gameOver.play();

          document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowUp" || e.key === " ") {
              const fart = new Audio("./audio/fart.mp3");
              fart.play();
            }
          });

          setTimeout(() => {
            location.reload();
          }, 5000);
        }, 100);
      }
    });
  }
  //Money
  const moneyTexture = PIXI.Texture.from("./images/money.png");
  const moneySprite = new PIXI.Sprite(moneyTexture);
  moneySprite.interactive = true;
  moneySprite.x = 1200;
  moneySprite.y = 550;

  moneySprite.animationSpeed = 100;
  moneySprite.width = 150;
  moneySprite.height = 150;

  app.ticker.add(function () {
    moneySprite.position.x -= 6;
    console.log(moneySprite.getGlobalPosition());
    if (moneySprite.x < -100) {
      resetRockPosition();
      function resetRockPosition() {
        moneySprite.x = 2000;
      }
    }
  });
  //Clouds
  const cloudsTexture = PIXI.Texture.from("./images/clouds.png");
  const cloudsSprite = new PIXI.TilingSprite(
    cloudsTexture,
    app.screen.width,
    app.screen.height
  );
  cloudsSprite.tileScale.set(0.5, 0.5);
  app.ticker.add(function () {
    cloudsSprite.tilePosition.x += 1;
  });
  app.stage.addChild(cloudsSprite);

  //House
  function house() {
    const houseTexture = PIXI.Texture.from("./images/house.png");
    const houseSprite = new PIXI.Sprite(houseTexture);

    houseSprite.interactive = true;
    houseSprite.x = 1600;
    houseSprite.y = 484;
    houseSprite.animationSpeed = 100;
    houseSprite.width = 500;
    houseSprite.height = 400;

    app.ticker.add(function () {
      houseSprite.position.x -= 3;
      if (houseSprite.x < -600) {
        resetRockPosition();
        function resetRockPosition() {
          houseSprite.x = 2600;
        }
      }
    });
    app.stage.addChild(houseSprite);
  }
  house();

  // Ground
  const groundTexture = PIXI.Texture.from("./images/ground.png");
  const groundSprite = new PIXI.TilingSprite(
    groundTexture,
    app.screen.width,
    (app.screen.height += 180)
  );
  app.ticker.add(function () {
    groundSprite.tilePosition.x -= 3;
  });
  groundSprite.tileScale.set(0.4, 0.5);

  app.stage.addChild(groundSprite);

  //Rock
  const rockTexture = PIXI.Texture.from("./images/rock.png");
  const rockSprite = new PIXI.Sprite(rockTexture);

  rockSprite.interactive = true;
  rockSprite.x = 1600;
  rockSprite.y = 790;
  rockSprite.width = 100;
  rockSprite.height = 100;

  app.ticker.add(function () {
    rockSprite.position.x -= 3;
    if (rockSprite.x < -90) {
      resetRockPosition();
      function resetRockPosition() {
        rockSprite.x = 4100;
      }
    }
  });
  app.stage.addChild(rockSprite);
  house();

  //Rock Second
  const rockSecondTexture = PIXI.Texture.from("./images/rockSecond.png");
  const rockSecondSprite = new PIXI.Sprite(rockSecondTexture);

  rockSecondSprite.interactive = true;
  rockSecondSprite.x = 1000;
  rockSecondSprite.y = 790;
  rockSecondSprite.width = 120;
  rockSecondSprite.height = 120;

  app.ticker.add(function () {
    rockSecondSprite.position.x -= 3;
    if (rockSecondSprite.x < -90) {
      resetRockPosition();
      function resetRockPosition() {
        rockSecondSprite.x = 3900;
      }
    }
  });
  app.stage.addChild(rockSecondSprite);

  //Rock Fouth
  const rockFourthTexture = PIXI.Texture.from("./images/rockFourth.png");
  const rockFourthSprite = new PIXI.Sprite(rockFourthTexture);

  rockFourthSprite.interactive = true;
  rockFourthSprite.x = 2000;
  rockFourthSprite.y = 790;
  rockFourthSprite.width = 120;
  rockFourthSprite.height = 100;

  app.ticker.add(function () {
    rockFourthSprite.position.x -= 3;
    if (rockFourthSprite.x < -90) {
      resetRockPosition();
      function resetRockPosition() {
        rockFourthSprite.x = 3600;
      }
    }
  });
  app.stage.addChild(rockFourthSprite);

  //Sun
  const sunTexture = PIXI.Texture.from("./images/sun.png");
  const sunSprite = new PIXI.Sprite(sunTexture);
  sunSprite.interactive = true;
  sunSprite.x = 0;
  sunSprite.y = 90;
  sunSprite.animationSpeed = 100;
  sunSprite.width = 550;
  sunSprite.height = 400;

  app.ticker.add(function () {
    sunSprite.position.x += 0.6;
    if (sunSprite.x > 1600) {
      resetRockPosition();
      function resetRockPosition() {
        sunSprite.x = -2500;
        app.renderer.backgroundColor = 0x333333;
      }
    }
  });
  app.stage.addChild(sunSprite);
  //Moon
  const moonTexture = PIXI.Texture.from("./images/moon.png");
  const moonSprite = new PIXI.Sprite(moonTexture);
  //d
  moonSprite.interactive = true;
  moonSprite.x = -1900;
  moonSprite.y = 200;
  moonSprite.animationSpeed = 100;
  moonSprite.width = 350;
  moonSprite.height = 180;

  app.ticker.add(function () {
    moonSprite.position.x += 0.6;

    if (moonSprite.x > 1600) {
      resetRockPosition();
      function resetRockPosition() {
        moonSprite.x = -2500;
        app.renderer.backgroundColor = 0x0000ff;
      }
    }
  });
  app.stage.addChild(moonSprite);

  app.stage.addChild(moneySprite);
}
