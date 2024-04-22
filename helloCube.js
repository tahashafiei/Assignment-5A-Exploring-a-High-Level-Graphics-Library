import * as THREE from 'three';
import {OrbitControls} from './three.js-master/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from './three.js-master/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from './three.js-master/examples/jsm/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 3;

    const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	const scene = new THREE.Scene();

    {

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
    
    const loadManager = new THREE.LoadingManager();
	const loader = new THREE.TextureLoader( loadManager );

    function makeInstance( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

    function makeInstanceTexture(geometry, materials, x) {
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    const materials = [
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './flower-1.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './flower-2.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './flower-3.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './flower-4.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './flower-5.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './flower-6.jpg' ) } ),
	];

    const cubes = [
		makeInstance( geometry, 0x44aa88, 0 ),
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
        makeInstanceTexture( geometry, materials, -4),
	];

    {

		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			'./tears_of_steel_bridge.jpg',
			() => {

				texture.mapping = THREE.EquirectangularReflectionMapping;
				texture.colorSpace = THREE.SRGBColorSpace;
				scene.background = texture;

			} );

	}

    {
        const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load( './public/eyeball/eyeball.mtl', ( mtl ) => {

			mtl.preload();
            for (const material of Object.values(mtl.materials)) {
                material.side = THREE.DoubleSide;
            }
			objLoader.setMaterials( mtl );
			objLoader.load( './public/eyeball/eyeball.obj', ( root ) => {
                root.position.set(6, 0, 0);
				scene.add( root );
			} );

		} );

	}

    function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

    function loadColorTexture( path ) {

		const texture = loader.load( path );
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;

	}

    function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
