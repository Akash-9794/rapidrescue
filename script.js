// first page animation
function firstPageAnimation(){
  var tl = gsap.timeline();
  var tt = gsap.timeline();
  tl.from('.navElement li ',{
      y:-50,
      opacity:0,
      duration:0.4,
      stagger:0.2,
  });
  tt.from('.contnt h1 ',{
      x:-1100,
      opacity:0,
      duration:0.5,
      stagger:0.2,
  });
  tt.from('.contnt h2',{
      x:1100,
      opacity:0,
      duration:0.5,
      stagger:0.2,
  })
  tt.from('.contnt p',{
    x:1100,
    opacity:0,
    duration:0.5,
    stagger:0.2,
  })
  tl.from('.contnt button',{
    y:1100,
    opacity:0,
    duration:0.5,
    stagger:0.2,
  })
  tt.from('.contnt h3',{
    x:-1100,
    opacity:0,
    duration:0.5,
    stagger:0.2,
  })
  tl.from('#map',{
    z:-500 ,
    opacity:0,
    duration:0.5,
    stagger:0.2,
})
  tt.from('.page2 h2',{
      x:100,
      opacity:0,
      duration:0.5,
      stagger:0.2,
  });
  };

// script.js
function locoScroll(){
  gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#hero"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#hero" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#hero", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#hero").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

  
  };

function vedio(){
  document.addEventListener("DOMContentLoaded", function() {
    const videos = document.querySelectorAll(".video");
    const videoDurations = [10, 10, 10, 10, 10, 10]; // Duration in seconds for each video
    const playbackRate = 0.5; // Slow motion effect (0.5 means half the normal speed)
    let currentVideoIndex = 0;
    let timer;
  
    function playNextVideo() {
      videos[currentVideoIndex].classList.remove("active");
      videos[currentVideoIndex].playbackRate = 1; // Reset to normal speed for fade-out
      setTimeout(() => {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        videos[currentVideoIndex].classList.add("active");
        videos[currentVideoIndex].play();
        videos[currentVideoIndex].playbackRate = playbackRate; // Set to slow motion speed
        setVideoTimer();
      }, 1000); // Delay to allow fade out before switching
    }
  
    function setVideoTimer() {
      clearTimeout(timer);
      timer = setTimeout(playNextVideo, (videoDurations[currentVideoIndex] * 1000 / playbackRate) - 1000); // Adjust for slow motion and fade out time
    }
  
    // Start with the first video
    videos[currentVideoIndex].classList.add("active");
    videos[currentVideoIndex].play();
    videos[currentVideoIndex].playbackRate = playbackRate; // Set to slow motion speed
    setVideoTimer();
  });
}
function mapUser(){
  function handleLocationError(browserHasGeolocation) {
    const map = L.map('map').setView([51.505, -0.09], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    
    const popup = L.popup()
      .setLatLng([51.505, -0.09])
      .setContent(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.")
      .openOn(map);
  }

  function showUserLocation(map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // Add a marker for the user's location
        var marker = L.marker([lat, lng]).addTo(map);

        // Add a popup to the marker
        marker.bindPopup('Your Location').openPopup();

        // Set the map view to the user's location
        map.setView([lat, lng], 15);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const map = L.map('map').setView([lat, lng], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          const marker = L.marker([lat, lng]).addTo(map)
            .bindPopup('Your Location')
            .openPopup();

          // Call the showUserLocation function when the user clicks on the map
          map.on('click', function() {
            showUserLocation(map);
          });
        },
        () => {
          handleLocationError(true);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false);
    }
  });
}
// find 
function findNearestHospital(){
  document.addEventListener('DOMContentLoaded', () => {
    const findHospitalsButton = document.getElementById('find-hospitals');
    const hospitalForm = document.getElementById('hospital-form');
    const resultsDiv = document.getElementById('results');
  
    findHospitalsButton.addEventListener('click', async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`/find-hospitals?lat=${latitude}&lng=${longitude}`);
            const data = await response.json();
            resultsDiv.innerHTML = '<h3>Nearest Hospitals:</h3>';
            if (data.hospitals.length > 0) {
              data.hospitals.forEach(hospital => {
                resultsDiv.innerHTML += `<p><strong>${hospital.name}</strong> - ${hospital.phone}</p>`;
              });
            } else {
              resultsDiv.innerHTML += '<p>No hospitals found nearby.</p>';
            }
          } catch (error) {
            console.error('Error fetching hospitals:', error);
          }
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  
    hospitalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const formData = new FormData(hospitalForm);
          const name = formData.get('name');
          const phone = formData.get('phone');
  
          try {
            const response = await fetch('/update-hospital', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, phone, lat: latitude, lng: longitude })
            });
  
            const result = await response.json();
            if (response.ok) {
              alert('Hospital information updated successfully.');
              hospitalForm.reset();
            } else {
              alert(result.message);
            }
          } catch (error) {
            console.error('Error updating hospital:', error);
          }
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  });
  
}
// text animation
const textContainer = document.getElementById('anime');//Anywhere
const texts = ["Anywhere","Anytime"];
let index = 0;
function changeText() {
    textContainer.textContent = texts[index];
    index = (index + 1) % texts.length; // Cycle through the texts array
    setTimeout(changeText, 1000); // Change text every 1000ms (1 second)
}
// element animation
function textSplitting(){
  var allH1 = document.querySelectorAll('.page2 p');
  allH1.forEach(function(elem){
  var h1Text = elem.textContent;
  var splitText = h1Text.split("");
  var clutter = "";
  splitText.forEach(function(e){
      clutter += `<span>${e}</span>`; 
  });
  elem.innerHTML = clutter;
  console.log(clutter);
});
};
function gsapAnimation(){
  gsap.to(".page2 p span",{
      color: "red",
      // scale:1,
      stagger:0.8,
      scrollTrigger:{
          trigger:".page2",
          scroller:"body",
          // markers:true,
          start:"top 20%",
          end:"top -30%",
          scrub:2
      },
  })
  gsap.to(".img",{
    scale:1.2,
    opacity:1,
    scrollTrigger:{
        trigger:".page2",
        scroller:"body",
        // markers:true,
        start:"top 20%",
        end:"top -30%",
        scrub:2
    },
  })

  gsap.to(".img img",{
    y:2,
    x:3,
    ease:"power2.inOut",
    scrollTrigger:{
        trigger:".page2",
        scroller:"body",
        // markers:true,
        start:"top 5%",
        end:"top -30%",
        scrub:2
    },
  })
};
//matter js
  function matter(){
    var canvas = $('#wrapper-canvas').get(0);
  
  var dimensions = {
    width: $(window).width(),
    height: $(window).height(),
  };
  
  Matter.use('matter-attractors');
  Matter.use('matter-wrap');
  
  function runMatter() {
    var Engine = Matter.Engine,
      Events = Matter.Events,
      Runner = Matter.Runner,
      Render = Matter.Render,
      World = Matter.World,
      Body = Matter.Body,
      Mouse = Matter.Mouse,
      Common = Matter.Common,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Bodies = Matter.Bodies;
  
    var engine = Engine.create();
  
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.scale = 0.1;
  
    var render = Render.create({
      element: canvas,
      engine: engine,
      options: {
        showVelocity: false,
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
      },
    });
  
    var runner = Runner.create();
  
    var world = engine.world;
    world.gravity.scale = 0;
  
    var attractiveBody = Bodies.circle(
      render.options.width / 2,
      render.options.height / 2,
      Math.max(dimensions.width / 25, dimensions.height / 25) / 2,
      {
        render: {
          fillStyle: `#000`,
          strokeStyle: `#000`,
          lineWidth: 0,
        },
  
        isStatic: true,
        plugin: {
          attractors: [
            function (bodyA, bodyB) {
              return {
                x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                y: (bodyA.position.y - bodyB.position.y) * 1e-6,
              };
            },
          ],
        },
      }
    );
  
    World.add(world, attractiveBody);
  
    for (var i = 0; i < 60; i += 1) {
      let x = Common.random(0, render.options.width);
      let y = Common.random(0, render.options.height);
      let s = Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
      let poligonNumber = Common.random(3, 6);
      var body = Bodies.polygon(
        x,
        y,
        poligonNumber,
        s,
  
        {
          mass: s / 20,
          friction: 0,
          frictionAir: 0.02,
          angle: Math.round(Math.random() * 360),
          render: {
            fillStyle: '#222222',
            strokeStyle: `#000000`,
            lineWidth: 2,
          },
        }
      );
  
      World.add(world, body);
  
      let r = Common.random(0, 1);
      var circle = Bodies.circle(x, y, Common.random(2, 8), {
        mass: 0.1,
        friction: 0,
        frictionAir: 0.01,
        render: {
          fillStyle: r > 0.3 ? `#27292d` : `#444444`,
          strokeStyle: `#000000`,
          lineWidth: 2,
        },
      });
  
      World.add(world, circle);
  
      var circle = Bodies.circle(x, y, Common.random(2, 20), {
        mass: 6,
        friction: 0,
        frictionAir: 0,
        render: {
          fillStyle: r > 0.3 ? `#334443` : `#222222`,
          strokeStyle: `#111111`,
          lineWidth: 4,
        },
      });
  
      World.add(world, circle);
  
      var circle = Bodies.circle(x, y, Common.random(2, 30), {
        mass: 0.2,
        friction: 0.6,
        frictionAir: 0.8,
        render: {
          fillStyle: `#191919`,
          strokeStyle: `#111111`,
          lineWidth: 3,
        },
      });
  
      World.add(world, circle);
    }
  
    var mouse = Mouse.create(render.canvas);
  
    Events.on(engine, 'afterUpdate', function () {
      if (!mouse.position.x) return;
      Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.12,
        y: (mouse.position.y - attractiveBody.position.y) * 0.12,
      });
    });
  
    // Create bodies on click
    // Matter.Events.on(mouse, "mousedown", function(event) {
    //   let x = event.mouse.position.x;
    //   let y = event.mouse.position.y;
    //   var body = Bodies.circle(x, y, Common.random(10, 30), {
    //     mass: 0.5,
    //     friction: 0,
    //     frictionAir: 0.05,
    //     render: {
    //       fillStyle: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    //       strokeStyle: `#000000`,
    //       lineWidth: 1,
    //     },
    //   });
    //   World.add(world, body);
    // });
  
    // Keyboard controls
    // document.addEventListener("keydown", function(event) {
    //   if (event.key === "g") {
    //     world.gravity.y = world.gravity.y === 0 ? 1 : 0;
    //   }
    // });
  
    // Change color based on speed
    Events.on(engine, 'afterUpdate', function() {
      Composite.allBodies(engine.world).forEach(function(body) {
        if (body.speed > 6) {
          body.render.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        }
      });
    });
  
  
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
  
    return {
      engine: engine,
      runner: runner,
      render: render,
      canvas: render.canvas,
      stop: function () {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
      },
      play: function () {
        Matter.Runner.run(runner, engine);
        Matter.Render.run(render);
      },
    };
  }
  
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  function setWindowSize() {
    let dimensions = {};
    dimensions.width = $(window).width();
    dimensions.height = $(window).height();
  
    m.render.canvas.width = $(window).width();
    m.render.canvas.height = $(window).height();
    return dimensions;
  }
  
  let m = runMatter();
  setWindowSize();
  $(window).resize(debounce(setWindowSize, 250));
  
  }
  
  
  // Start the text change
  // locoScroll();
  gsapAnimation();
  firstPageAnimation();
  vedio();
  findNearestHospital();
  changeText();
  textSplitting();
  matter();
  
