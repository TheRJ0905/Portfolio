  var app = angular.module('dashboardApp', []);
  app.controller('ConsoleController', ['$scope', '$window', '$timeout', '$sce', function($scope, $window, $timeout, $sce) {
    $scope.isDarkMode = false;
  $scope.activeView = 'overview';

  // AQI Base Telemetry Tracker Models
  $scope.aqiValue = 44;
  $scope.aqiStatus = "Good";
  $scope.currentCityName = "Jaipur, IN";

  // Master Data Arrays
  $scope.tableData = [
  {id: "#E00385", name: "Rayan Ahmed", date: "1 Jan 2026", val: "$12,500", status: "COMPLETED" },
  {id: "#E00386", name: "Lokesh Kavadia", date: "2 Jan 2026", val: "$1,234", status: "SHIPPED" },
  {id: "#E00387", name: "Mohit Kavadia", date: "4 Jan 2026", val: "$3,750", status: "COMPLETED" }
  ];

  $scope.customerData = [
  {id: "#CUST-001", name: "Priya Sharma", email: "priya.s@example.com", date: "12 Dec 2025", val: "$45,200", status: "VIP ACTIVE" },
  {id: "#CUST-002", name: "Amit Patel", email: "amit.p@example.com", date: "04 Jan 2026", val: "$8,350", status: "VERIFIED" }
  ];

  $scope.shippingData = [
  {id: "#TRK-9812A", name: "Mumbai Fulfillment Hub", date: "Just Now", val: "$84,000", status: "IN TRANSIT" },
  {id: "#TRK-1102B", name: "Bengaluru Logistics Node", date: "2 Hrs Ago", val: "$12,300", status: "DISPATCHED" },
  {id: "#TRK-7714C", name: "Delhi Core Center", date: "Yesterday", val: "$4,200", status: "DELIVERED" }
  ];

  // Form Models
  $scope.formA = {id: '', name: '', val: '', status: 'COMPLETED' };
  $scope.formB = {id: '', name: '', val: '', status: 'COMPLETED' };
  $scope.formD = {id: '', name: '', val: '7500', status: 'COMPLETED' };
  $scope.newCustomer = {id: '', name: '', email: '', phone: '', val: '' };
  $scope.formShipping = {id: '', name: '', val: '', status: 'IN TRANSIT' };

  // Dynamic Iframe Map URL binding via $sce Service
  var defaultMapUrl = "https://maps.google.com/maps?q=Jaipur,Rajasthan&t=&z=13&ie=UTF8&iwloc=&output=embed";
  $scope.mapUrl = $sce.trustAsResourceUrl(defaultMapUrl);

  // Geolocation and Dynamic Map Updates
  $scope.locateMe = function() {
        var logEl = document.getElementById('system-live-log');
  if (navigator.geolocation) {
        if(logEl) logEl.innerText = " Syncing GPS satellite orbital coordinates...";
  navigator.geolocation.getCurrentPosition(function(position) {
    $scope.$apply(function () {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var newUrl = "https://maps.google.com/maps?q=" + lat + "," + lon + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
      $scope.mapUrl = $sce.trustAsResourceUrl(newUrl);
      $scope.currentCityName = "Current Location";
      if (logEl) logEl.innerText = " GPS satellite handshake complete. Panning to coordinates: " + lat.toFixed(4) + ", " + lon.toFixed(4);
    });
        }, function() {
        if(logEl) logEl.innerText = " ERROR: Geolocation access denied or unavailable by browser.";
        });
        } else {
        if(logEl) logEl.innerText = " ERROR: HTML5 Geolocation API not supported by this browser.";
        }
        };

  // Secure Email Client Link Pipeline Dispatcher
  $scope.triggerNativeMailRedirect = function() {
    $window.location.href = "mailto:rajat.soni547@gmail.com";
        };

  function injectDynamicPayloadToGrid(formData) {
    $scope.tableData.unshift({
      id: formData.id, name: formData.name, date: "Live Session (MAPPED)",
      val: isNaN(formData.val) ? formData.val : '$' + Number(formData.val).toLocaleString(),
      status: formData.status || 'COMPLETED'
    });
  $scope.switchActiveView('overview');
        }

  $scope.submitFormA = function() {injectDynamicPayloadToGrid($scope.formA); $scope.formA = {id: '', name: '', val: '', status: 'COMPLETED' }; };
  $scope.submitFormB = function() {injectDynamicPayloadToGrid($scope.formB); $scope.formB = {id: '', name: '', val: '', status: 'COMPLETED' }; };
  $scope.submitFormD = function() {injectDynamicPayloadToGrid($scope.formD); $scope.formD = {id: '', name: '', val: '7500', status: 'COMPLETED' }; };

  $scope.submitAddCustomerForm = function() {
    $scope.customerData.unshift({
      id: $scope.newCustomer.id,
      name: $scope.newCustomer.name,
      email: $scope.newCustomer.email,
      date: "Added Just Now",
      val: isNaN($scope.newCustomer.val) ? $scope.newCustomer.val : '$' + Number($scope.newCustomer.val).toLocaleString(),
      status: "NEW REGISTRY"
    });
  $scope.newCustomer = {id: '', name: '', email: '', phone: '', val: '' };
        };

  $scope.submitShipping = function() {
    $scope.shippingData.unshift({
      id: $scope.formShipping.id, name: $scope.formShipping.name, date: "Live Radar Ping",
      val: isNaN($scope.formShipping.val) ? $scope.formShipping.val : '$' + Number($scope.formShipping.val).toLocaleString(),
      status: $scope.formShipping.status
    });
  $scope.formShipping = {id: '', name: '', val: '', status: 'IN TRANSIT' };
        };

  $scope.switchActiveView = function(targetKey) {
    $scope.activeView = targetKey;
  var logEl = document.getElementById('system-live-log');
  if(logEl) logEl.innerText = " Transferred system focus point route onto subview channel: " + targetKey.toUpperCase();
        };

  $scope.changeTheme = function(themeName) {
        var body = document.body;
  body.className = "m-0 p-0 w-full h-full overflow-hidden select-none";
  if(themeName !== 'default') body.classList.add('theme-' + themeName);
  $scope.isDarkMode = (themeName === 'dark');
  var activeColorHex = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim();
  window.updateParticleColors(activeColorHex);
        };
        }]);

  // Dynamic multi-charts calculations loop threads
  (function() {
        var primaryPath = document.getElementById('dynamic-trace-primary');
  var secondaryPath = document.getElementById('dynamic-trace-secondary');
  var areaFillPath = document.getElementById('dynamic-area-fill');
  var frequencyWave = document.getElementById('dynamic-frequency-wave');
  var tracerDot = document.getElementById('live-graph-dot');
  var radialRing = document.getElementById('live-radial-ring');
  var radialTxt = document.getElementById('live-radial-txt');
  var gaugeOuter = document.getElementById('live-gauge-outer');
  var gaugeInner = document.getElementById('live-gauge-inner');

  var tick = 0; var xCoords = [20, 120, 220, 320, 420, 580]; var activeIndex = 0;

  function runGlobalTelemetryTick() {
    tick++;
  var p1 = Math.floor(Math.sin(tick + 1) * 25) + 100; var p2 = Math.floor(Math.cos(tick + 2) * 20) + 65;
  var p3 = Math.floor(Math.sin(tick + 3) * 25) + 80; var p4 = Math.floor(Math.cos(tick + 4) * 15) + 40;
  var p5 = Math.floor(Math.sin(tick + 5) * 30) + 50; var p6 = Math.floor(Math.cos(tick + 6) * 10) + 20;
  var s1 = p1 + 15; var s2 = p2 + 20; var s3 = p3 + 12;

  if(primaryPath && secondaryPath) {
    primaryPath.setAttribute('d', `M0,120 C${xCoords[0]},${p1} ${xCoords[1]},${p2} ${xCoords[2]},${p3} C${xCoords[3]},${p4} ${xCoords[4]},${p5} ${xCoords[5]},${p6}`);
  secondaryPath.setAttribute('d', `M0,130 C${xCoords[0]},${s1} ${xCoords[1]},${s2} ${xCoords[2]},${s3} C${xCoords[3]},${p4 + 20} ${xCoords[4]},${p5 + 15} ${xCoords[5]},${p6 + 15}`);
        }
  if(tracerDot && primaryPath) {
        var containerWidth = primaryPath.parentElement.clientWidth; var containerHeight = primaryPath.parentElement.clientHeight;
  tracerDot.style.left = `${(xCoords[activeIndex] / 600) * containerWidth}px`;
  tracerDot.style.top = `${containerHeight - ((p3 / 140) * containerHeight)}px`;
  activeIndex = (activeIndex + 1) % xCoords.length;
        }
  var progA = Math.floor(Math.sin(tick) * 15) + 70; var progB = Math.floor(Math.cos(tick) * 12) + 48;
  if(document.getElementById('bar-prog-a')) {
    document.getElementById('bar-prog-a').style.width = progA + '%'; document.getElementById('txt-prog-a').innerText = progA + '%';
  document.getElementById('bar-prog-b').style.width = progB + '%'; document.getElementById('txt-prog-b').innerText = progB + '%';
        }
  var degrees = (tick * 45) % 360; var dynamicRatio = Math.floor(Math.sin(tick) * 8) + 70;
  if(radialRing) {radialRing.style.transform = `rotate(${degrees}deg)`; radialTxt.style.transform = `rotate(-${degrees}deg)`; radialTxt.innerText = dynamicRatio + '%'; }

  document.querySelectorAll('.live-bar').forEach(function(b, idx) {b.style.height = (Math.floor(Math.sin(tick + idx) * 32) + 58) + '%'; });
  if(areaFillPath) {
        var a1 = Math.floor(Math.sin(tick) * 12) + 50; var a2 = Math.floor(Math.cos(tick + 1) * 18) + 60; var a3 = Math.floor(Math.sin(tick + 2) * 8) + 40;
  areaFillPath.setAttribute('d', `M0,100 C40,${a1} 90,${a2} 140,${a3} C170,40 200,${a2 - 10} 200,100 Z`);
        }
  if(frequencyWave) {
        var f1 = Math.floor(Math.sin(tick) * 25) + 50; var f2 = Math.floor(Math.cos(tick) * 25) + 50;
  frequencyWave.setAttribute('d', `M0,50 Q40,${f1} 90,${f2} T170,${f1} T240,${f2} T300,50`);
        }
  if(gaugeOuter && gaugeInner) {gaugeOuter.style.transform = `rotate(${tick * 30}deg)`; gaugeInner.style.transform = `rotate(-${tick * 45}deg)`; }
        }
  setInterval(runGlobalTelemetryTick, 1800);
        })();

  // Ambient Drifting Vector Mesh Network Background Logic
  (function() {
        var canvas = document.getElementById('floating-canvas'); if(!canvas) return; var ctx = canvas.getContext('2d'); var pColor = '#0058bc';
  function resize() {canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  window.updateParticleColors = function(newHex) {pColor = newHex; };

  var nodes = ['⚡ C#', '.NET Core', '🛢️ SQL Server', '💻 VS', '📱 Flutter', '🌐 API']; var list = [];
  for(var i=0; i<15; i++) {
    list.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height, text: nodes[i % nodes.length],
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, alpha: Math.random() * 0.15 + 0.08
    });
        }
  function run() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  list.forEach(function(p) {
    p.x += p.vx; p.y += p.vy;
  if(p.x < -50) p.x = canvas.width + 50; if(p.x > canvas.width + 50) p.x = -50;
  if(p.y < -50) p.y = canvas.height + 50; if(p.y > canvas.height + 50) p.y = -50;
  ctx.fillStyle = pColor; ctx.globalAlpha = p.alpha; ctx.fillText(p.text, p.x, p.y);
        });
  requestAnimationFrame(run);
        }
  run();
        })();
