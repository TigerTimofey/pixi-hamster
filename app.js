const Application = PIXI.Application;

const Container = PIXI.Container;

const app = new Application({});

const mediaQueryMenu = window.matchMedia("(max-width: 400px)");

const menuContainer = new Container();
app.stage.addChild(menuContainer);

app.renderer.backgroundColor = 0x0000ff;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.width = "100%";
app.renderer.view.style.height = "100%";

// Logotype style for text
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
let numberCoin = 0;
const logoText = new PIXI.Text(`FOREST RUN`, style);
logoText.anchor.set(0.5);
logoText.position.set(app.screen.width / 2, app.screen.height / 2 - 300);

//Start Button in menu Container
const startButton = new PIXI.Sprite(
  PIXI.Texture.from("./images/startgame.png")
);
startButton.anchor.set(0.5);
startButton.position.set(app.screen.width / 2, app.screen.height / 2 - 200);
startButton.interactive = true;
startButton.buttonMode = true;
startButton.on("pointertap", startGame);

document.body.appendChild(app.view);

//Menu container Clounds and Ground animation
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

//Adding child to menuContainer with correct position of them
menuContainer.addChild(cloudsMenuSprite);
menuContainer.addChild(groundenuSprite);
menuContainer.addChild(startButton);
menuContainer.addChild(logoText);

//Adding child to menuContainer with correct position of them for Phone version
if (mediaQueryMenu.matches) {
  const groundMenuMobileTexture = PIXI.Texture.from("./images/ground.png");
  const groundenuMobileSprite = new PIXI.TilingSprite(
    groundMenuMobileTexture,
    app.screen.width,
    app.screen.height
  );
  groundenuMobileSprite.tileScale.set(0.3, 0.35);
  app.ticker.add(function () {
    groundenuMobileSprite.tilePosition.x -= 1;
  });
}

// Function to start the game
function startGame() {
  // Remove the menu container from the stage
  app.stage.removeChild(menuContainer);
  // Start the main game logic, below
  startMainGame();
}
function startMainGame() {
  //Additional rules for Mobile
  const mediaQuery = window.matchMedia("(max-width: 400px)");

  //Game Audio
  const bonus = new Audio("./audio/bonus.wav");
  const audioCoin = new Audio("./audio/coin.wav");
  const gameOver = new Audio("./audio/gameover.wav");
  const fontMusicBg = new Audio("./audio/bgmusic.mp3");
  fontMusicBg.loop = true;
  fontMusicBg.play();

  const app = new Application({
    transparent: false,
    antialias: true,
  });

  app.renderer.backgroundColor = 0x0000ff;
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.renderer.view.style.position = "absolute";
  document.body.appendChild(app.view);
  const loader = PIXI.Loader.shared;

  //ANIMATION CHARACTER
  loader
    .add("tileset", "./images/spritesheet.json")

    .load(setup);

  const gsap = window.gsap;

  function setup(loader, resources) {
    // Running right animation
    const textures = [];
    for (let i = 1; i < 4; i++) {
      const texture = PIXI.Texture.from(`RunRight0${i}.png`);
      textures.push(texture);
    }
    const drag = new PIXI.AnimatedSprite(textures);
    drag.position.set(0, 760);
    drag.scale.set(1.7, 1.7);
    app.stage.addChild(drag);
    drag.play();
    drag.animationSpeed = 0.2;
    if (mediaQueryMenu.matches) {
      drag.width = 90;
      drag.height = 90;
      drag.position.set(0, 760);
    }

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
      let tolerance = 50;

      return (
        Math.abs(firstObj.x - secondObj.x) <= tolerance &&
        Math.abs(firstObj.y - secondObj.y) <= tolerance
      );
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        gsap.to(drag, { x: "+=50", duration: 0.3, ease: "power2.out" });
        if (drag.x >= window.innerWidth - drag.width) {
          resetDragPosition();
          function resetDragPosition() {
            gsap.to(drag, {
              x: window.innerWidth - drag.width,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      }

      if (e.key === "ArrowLeft") {
        gsap.to(drag, { x: "-=50", duration: 0.3, ease: "power2.out" });
        if (drag.x <= window.innerWidth - window.innerWidth - 1 + drag.width) {
          resetDragPosition();
          function resetDragPosition() {
            gsap.to(drag, {
              x: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      }

      if (e.key === "ArrowUp" || e.key === " ") {
        const originalY = drag.y;
        const jumpHeight = 120;
        const jumpDuration = 0.5;
        gsap.to(drag, {
          y: originalY - jumpHeight,
          duration: jumpDuration,
          ease: "power2.out",
          onComplete: function () {
            gsap.to(drag, {
              y: 760,
              x: "+=0",
              duration: jumpDuration,
              ease: "power1.in",
            });
            if (
              drag.y <=
              window.innerWidth - window.innerWidth + 120 + drag.width
            ) {
              resetDragPosition();
              function resetDragPosition() {
                gsap.to(drag, {
                  y: 200 + jumpHeight,
                  duration: 0.1,
                  ease: "power2.out",
                });
              }
            }
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
      const jumpDuration = 0.32;

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
    // numberCoin = 0;
    app.ticker.add(function () {
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
        dropShadowAngle: Math.PI / 2,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: "round",
      });
      const richText = new PIXI.Text(`COUNT: ${numberCoin}`, style);
      richText.x = 100;
      richText.y = 300;

      app.stage.addChild(richText);

      // Check collision between drag and Bonus 100
      if (collision(drag, bonusSprite)) {
        console.log("Collision detected between drag and Bonus");
        setTimeout(() => {
          numberCoin += 100;
          bonusSprite.width = 1;
          bonusSprite.height = 1;
          bonus.play();
          app.ticker.add(() => {
            bonusSprite.position.x -= 9;
            app.ticker.add(function (delta) {
              bonusSprite.anchor.set(0.5, 0.5);
              bonusSprite.pivot.set(
                bonusSprite.width / 2 - bonusSprite.width / 2,
                bonusSprite.height / 2 - bonusSprite.height / 2
              );
              bonusSprite.rotation -= 0.0001 * delta;
            });
          });
        }, 100);
        if (bonusSprite.width == 1) {
          bonusSprite.x = 6400;
        }
        const min = 100;
        const max = 650;
        const randomCoinPosition = Math.random() * (max - min + 1) + min;
        bonusSprite.y = randomCoinPosition;
      }

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
      function gameOverAnimation() {
        const gameOverTexture = PIXI.Texture.from(`./images/gameovertxt.png`);
        const gameOverTSprite = new PIXI.Sprite(gameOverTexture);
        gameOverTSprite.anchor.set(-0.5, -0.3);

        gameOverTSprite.width = 800;
        gameOverTSprite.height = 800;
        if (mediaQuery.matches) {
          gameOverTSprite.anchor.set(1.25, -0.8);
          gameOverTSprite.x = window.innerHeight / 2;
          gameOverTSprite.y = window.innerWidth / 2;
          gameOverTSprite.width = 200;
          gameOverTSprite.height = 200;
        }
        app.stage.addChild(gameOverTSprite);
        fontMusicBg.pause();
        gameOver.play();
      }
      // Check collision between drag and rock
      if (collisionRocks(drag, rockSprite)) {
        console.log("Collision detected between drag and moneySprite");
        drag.stop();
        app.stage.removeChild(drag);
        drag.width = 150;
        drag.height = 120;
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            x: "+=900",
            duration: 3.3,
            ease: "power2.out",
          });
          // Game over animation
          gameOverAnimation();

          setTimeout(() => {
            location.reload();
          }, 3000);
        }, 100);
      }
      // Check collision between drag and rockSecond
      if (collisionRocks(drag, rockSecondSprite)) {
        console.log("Collision detected between drag and ROCK");
        drag.stop();
        app.stage.removeChild(drag);
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            duration: 3.3,
            ease: "power2.out",
          });
          // Game over animation
          gameOverAnimation();

          setTimeout(() => {
            location.reload();
          }, 3000);
        }, 100);
      }
      // Check collision between drag and rockFourth
      if (collisionRocks(drag, rockFourthSprite)) {
        console.log("Collision detected between drag and ROCK");
        drag.stop();
        app.stage.removeChild(drag);
        // drag.texture = PIXI.Texture.from(`./images/gameover.png`);
        // drag.width = 150;
        // drag.height = 120;
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            duration: 3.3,
            ease: "power2.out",
          });
          // Game over animation
          gameOverAnimation();

          setTimeout(() => {
            location.reload();
          }, 3000);
        }, 100);
      }
      // Check collision between drag and whisper1 (enemySprite)
      if (collisionRocks(drag, enemySprite)) {
        console.log("Collision detected between drag and Whisper");

        drag.stop();
        app.stage.removeChild(drag);
        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            duration: 3.3,
            ease: "power2.out",
          });
          // Game over animation
          gameOverAnimation();

          setTimeout(() => {
            location.reload();
          }, 3000);
        }, 100);
      }
      // Check collision between drag and whisper1 (enemySecondSprite)
      if (collisionRocks(drag, enemySecondSprite)) {
        console.log("Collision detected between drag and Whisper");
        drag.stop();
        app.stage.removeChild(drag);

        setTimeout(() => {
          gsap.to(drag, {
            y: "-=300",
            duration: 3.3,
            ease: "power2.out",
          });
          // Game over animation
          gameOverAnimation();

          setTimeout(() => {
            location.reload();
          }, 3000);
        }, 100);
      }
    });
    return numberCoin;
  }

  //Cone enemy first
  const enemyTexture = PIXI.Texture.from("./images/coneOne.png");
  const enemySprite = new PIXI.Sprite(enemyTexture);
  enemySprite.width = 160;
  enemySprite.height = 160;

  if (mediaQueryMenu.matches) {
    enemySprite.width = 90;
    enemySprite.height = 90;
  }

  enemySprite.interactive = true;
  enemySprite.x = 2600;
  enemySprite.y = 700;

  app.ticker.add(function () {
    enemySprite.x -= 8;
    if (mediaQueryMenu.matches) {
      enemySprite.x += 2;
    }

    app.ticker.add(function (delta) {
      enemySprite.anchor.set(0.5, 0.5);
      enemySprite.pivot.set(
        enemySprite.width / 2 - enemySprite.width / 2,
        enemySprite.height / 2 - enemySprite.height / 2
      );
      enemySprite.rotation -= 0.0001 * delta;
    });

    if (enemySprite.x < -190) {
      resetRockPosition();
      function resetRockPosition() {
        enemySprite.x = 2000;
        const min = 200;
        const max = 550;
        const randomEnemyPosition = Math.random() * (max - min + 1) + min;
        enemySprite.y = randomEnemyPosition;
      }
    }
  });
  //Cone enemy Second
  const enemySecondTexture = PIXI.Texture.from("./images/coneSecond.png");
  const enemySecondSprite = new PIXI.Sprite(enemySecondTexture);

  enemySecondSprite.width = 190;
  enemySecondSprite.height = 190;

  if (mediaQueryMenu.matches) {
    enemySecondSprite.width = 70;
    enemySecondSprite.height = 70;
  }

  enemySecondSprite.interactive = true;
  enemySecondSprite.x = 3600;
  enemySecondSprite.y = 300;

  app.ticker.add(function () {
    enemySecondSprite.x -= 9;
    if (mediaQueryMenu.matches) {
      enemySecondSprite.x += 2;
    }
    app.ticker.add(function (delta) {
      enemySecondSprite.anchor.set(0.5, 0.5);
      enemySecondSprite.pivot.set(
        enemySecondSprite.width / 2 - enemySecondSprite.width / 2,
        enemySecondSprite.height / 2 - enemySecondSprite.height / 2
      );
      enemySecondSprite.rotation -= 0.0001 * delta;
    });

    if (enemySecondSprite.x < -190) {
      resetRockPosition();
      function resetRockPosition() {
        enemySecondSprite.x = 4200;
        const min = 200;
        const max = 550;
        const randomEnemyPosition = Math.random() * (max - min + 1) + min;
        enemySecondSprite.y = randomEnemyPosition;
      }
    }
  });
  // Gift
  const bonusTexture = PIXI.Texture.from("./images/100point.png");
  const bonusSprite = new PIXI.Sprite(bonusTexture);
  bonusSprite.interactive = true;
  bonusSprite.x = 2000;
  bonusSprite.y = 450;
  bonusSprite.width = 120;
  bonusSprite.height = 90;
  app.ticker.add(function () {
    bonusSprite.position.x -= 4;
    if (bonusSprite.x < -100) {
      resetRockPosition();
      function resetRockPosition() {
        bonusSprite.x = 10000;
      }
    }
  });

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

  //Clouds logic for Mobile
  if (mediaQuery.matches) {
    const cloudsTextureMobile = PIXI.Texture.from("./images/clouds.png");
    const cloudsSpriteMobile = new PIXI.TilingSprite(
      cloudsTextureMobile,
      (app.screen.width += 50),
      (app.screen.height += 50)
    );
    cloudsSpriteMobile.tileScale.set(0.5, 0.6);
    app.ticker.add(function () {
      cloudsSpriteMobile.tilePosition.x += 1;
    });
    app.stage.removeChild(cloudsSprite);
    app.stage.addChild(cloudsSpriteMobile);
  }

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
          houseSprite.x = 4600;
        }
      }
    });
    app.stage.addChild(houseSprite);
  }
  house();
  //House Second
  function houseSecond() {
    const houseSecondTexture = PIXI.Texture.from("./images/houseSecond.png");
    const houseSecondSprite = new PIXI.Sprite(houseSecondTexture);

    houseSecondSprite.interactive = true;
    houseSecondSprite.x = 2900;
    houseSecondSprite.y = 510;
    houseSecondSprite.animationSpeed = 100;
    houseSecondSprite.width = 500;
    houseSecondSprite.height = 400;

    app.ticker.add(function () {
      houseSecondSprite.position.x -= 3;
      if (houseSecondSprite.x < -600) {
        resetRockPosition();
        function resetRockPosition() {
          houseSecondSprite.x = 7100;
        }
      }
    });
    app.stage.addChild(houseSecondSprite);
  }
  //House Third
  function houseThird() {
    const houseThirdTexture = PIXI.Texture.from("./images/houseThird.png");
    const houseThirdSprite = new PIXI.Sprite(houseThirdTexture);

    houseThirdSprite.interactive = true;
    houseThirdSprite.x = 3900;
    houseThirdSprite.y = 480;
    houseThirdSprite.animationSpeed = 100;
    houseThirdSprite.width = 500;
    houseThirdSprite.height = 400;

    app.ticker.add(function () {
      houseThirdSprite.position.x -= 3;
      if (houseThirdSprite.x < -600) {
        resetRockPosition();
        function resetRockPosition() {
          houseThirdSprite.x = 3200;
        }
      }
    });
    app.stage.addChild(houseThirdSprite);
  }
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

  //Ground logic for mobile
  if (mediaQuery.matches) {
    app.ticker.add(function () {
      groundSpriteMobile.tilePosition.x -= 3;
    });
    const groundSpriteMobile = new PIXI.TilingSprite(
      groundTexture,
      app.screen.width,
      app.screen.height
    );
    groundSpriteMobile.tileScale.set(0.3, 0.49);
    app.stage.removeChild(groundSprite);
    app.stage.addChild(groundSpriteMobile);
  }
  houseSecond();
  houseThird();

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

  app.stage.addChild(moneySprite);
  app.stage.addChild(bonusSprite);

  app.stage.addChild(enemySprite);
  app.stage.addChild(enemySecondSprite);
}
