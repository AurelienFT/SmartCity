import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

function onProgress( xhr ) {

  if ( xhr.lengthComputable ) {

    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

  }

}

function onError() {}

class Scene extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.computeBoundingBox = this.computeBoundingBox.bind(this);
    this.setupScene = this.setupScene.bind(this);
    this.destroyContext = this.destroyContext.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.onDocumentMouse = this.onDocumentMouse.bind(this);
    this.map = {};
  }

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentDidMount() {
    this.setupScene();
  }

  setupScene() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    const manager = new THREE.LoadingManager();
    new MTLLoader( manager )
    .setPath( '/Assets/' )
    .load( 'city.mtl', function ( materials ) {

      materials.preload();

      new OBJLoader( manager )
        .setMaterials( materials )
        .setPath( '/Assets/' )
        .load( 'city.obj', function ( map ) {
          //this.map = map;
          map.position.y = -5;
          for (let i =0; i < map.children.length; i++) {
            map.children[i].callback = function() { console.log( this.name ); }
          }
          scene.add( map );

        }, onProgress, onError );

    } );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    let scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    let camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      2000
    );
    camera.position.y = 250
    scene.add(camera);
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    let spotLight = new THREE.SpotLight(0xffffff, 0.25);
    spotLight.position.set(45, 50, 15);
    camera.add(spotLight);
    this.spotLight = spotLight;

    let ambLight = new THREE.AmbientLight(0x333333);
    ambLight.position.set(5, 3, 5);
    this.camera.add(ambLight);

    this.computeBoundingBox();
  }

  computeBoundingBox() {
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();

    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.1;
    controls.enableKeys = true;
    controls.screenSpacePanning = false;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.dampingFactor = 1;
    controls.autoRotateSpeed = 1.2;
    controls.enablePan = false;
    controls.update();
    this.controls = controls;
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    this.start();
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  renderScene() {
    //console.log(this.scene);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.frameId = requestAnimationFrame(this.animate);
    this.controls.update();
    //console.log(this.camera.position.x + ", " + this.camera.position.y + ", " + this.camera.position.z);
    this.renderScene();
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  onDocumentMouse( event ) {

    event.preventDefault();

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, this.camera );

    var intersects = raycaster.intersectObjects( this.scene.children[1].children ); 

    if ( intersects.length > 0 ) {

        intersects[0].object.callback();

    }
  }

  handleWindowResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  componentWillUnmount() {
    this.stop();
    this.destroyContext();
  }

  destroyContext() {
    this.container.removeChild(this.renderer.domElement);
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;
  }

  render() {
    const width = "100%";
    const height = "100%";
    return (
      <div
        ref={(container) => {
          this.container = container;
        }}
        onClick={(evt) => {this.onDocumentMouse(evt)}}
        style={{
          width: width,
          height: height,
          position: "absolute",
          overflow: "hidden",
        }}></div>
    );
  }
}

export default Scene;
