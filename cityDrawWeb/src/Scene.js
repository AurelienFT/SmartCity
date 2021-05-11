import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { Card } from "antd";
import "./Scene.css";

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
  }
}

function onError() {}

function Scene() {
  const refContainer = useRef(null);
  let width = useRef(null);
  let height = useRef(null);
  let scene = useRef(new THREE.Scene());
  let spotLight = useRef(new THREE.SpotLight(0xffffff, 0.25));
  let ambLight = useRef(new THREE.AmbientLight(0x333333));
  let renderer = useRef(new THREE.WebGLRenderer({ antialias: true }));
  let camera = useRef(null);
  let controls = useRef(null);
  let init = useRef(false);
  let [clicked, setClicked] = useState(null);
  let frameId = undefined;

  useEffect(() => {
    if (init.current === false) {
      width.current = refContainer.current.clientWidth;
      height.current = refContainer.current.clientHeight;
      camera.current = new THREE.PerspectiveCamera(
        45,
        width.current / height.current,
        1,
        2000
      );
      controls.current = new OrbitControls(
        camera.current,
        renderer.current.domElement
      );
      window.addEventListener("resize", handleWindowResize);
      start();
      setupScene();
      init.current = true;
    }
  });

  function setupScene() {
    const manager = new THREE.LoadingManager();
    new MTLLoader(manager)
      .setPath("/Assets/")
      .load("city.mtl", function (materials) {
        materials.preload();

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath("/Assets/")
          .load(
            "city.obj",
            function (map) {
              //this.map = map;
              map.position.y = -5;
              for (let i = 0; i < map.children.length; i++) {
                map.children[i].callback = function () {
                  if (this.name.includes("Building"))
                    setClicked({title: this.name});
                  else
                    setClicked(null);
                };
              }
              scene.current.add(map);
            },
            onProgress,
            onError
          );
      });
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.shadowMap.enabled = true;
    renderer.current.gammaOutput = true;
    renderer.current.gammaFactor = 2.2;
    renderer.current.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.current.background = new THREE.Color("black");

    camera.current.position.y = 250;
    scene.current.add(camera.current);

    spotLight.current.position.set(45, 50, 15);
    camera.current.add(spotLight.current);

    ambLight.current.position.set(5, 3, 5);
    camera.current.add(ambLight.current);

    computeBoundingBox();
  }

  function computeBoundingBox() {
    camera.current.lookAt(scene.current.position);
    camera.current.updateProjectionMatrix();

    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.25;
    controls.current.enableZoom = true;
    controls.current.zoomSpeed = 0.1;
    controls.current.enableKeys = true;
    controls.current.screenSpacePanning = false;
    controls.current.enableRotate = true;
    controls.current.autoRotate = false;
    controls.current.dampingFactor = 1;
    controls.current.autoRotateSpeed = 1.2;
    controls.current.enablePan = false;
    controls.current.update();
    renderer.current.setSize(width.current, height.current);
    refContainer.current.appendChild(renderer.current.domElement);
    start();
  }

  function start() {
    if (!frameId) {
      frameId = requestAnimationFrame(animate);
    }
  }

  function renderScene() {
    //console.log(scene.current);
    renderer.current.render(scene.current, camera.current);
  }

  function animate() {
    frameId = requestAnimationFrame(animate);
    controls.current.update();
    console.log(
      camera.current.position.x +
        ", " +
        camera.current.position.y +
        ", " +
        camera.current.position.z
    );
    renderScene();
  }

  function onDocumentMouse(event) {
    event.preventDefault();

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    mouse.x = (event.clientX / renderer.current.domElement.clientWidth) * 2 - 1;
    mouse.y =
      -(event.clientY / renderer.current.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.current);

    var intersects = raycaster.intersectObjects(
      scene.current.children[1].children
    );

    if (intersects.length > 0) {
      intersects[0].object.callback();
    }
  }

  function handleWindowResize() {
    let widthTmp = window.innerWidth;
    let heightTmp = window.innerHeight;
    camera.current.aspect = widthTmp / heightTmp;
    camera.current.updateProjectionMatrix();
  }

  return (
    <div>
      <div
        ref={refContainer}
        onClick={(evt) => {
          onDocumentMouse(evt);
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          overflow: "hidden",
        }}
      ></div>
      <div
        style={{
          width: "100%",
          height: "50px",
          textAlign: "center",
          color: "white",
        }}
        className="ui"
      >
        City test
      </div>
      {clicked ? <Card
        title={clicked.title}
        style={{ minWidth: 150, right: "0" }}
        className="ui"
      >
        <p>Not buyed yet</p>
        <p>Buy it</p>
      </Card>: <div></div>}
    </div>
  );
}

export default Scene;
