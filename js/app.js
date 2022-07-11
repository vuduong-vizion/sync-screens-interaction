import { OrbitControls } from './../build/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    const sceneElements = [];
    function addScene(elem, fn) {
        sceneElements.push({ elem, fn });
    }

    function makeScene() {
        const scene = new THREE.Scene();

        // const fov = 45;
        // const aspect = 2;  // the canvas default
        // const near = 0.1;
        // const far = 5;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const controls = new OrbitControls(camera, canvas);

        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.enableDamping = true;
        controls.enableZoom = false;

        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        controls.update();
        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }

        return { scene, camera, controls };
    }

    {
        const elem = document.querySelector('#screen1');
        const { scene, camera, controls } = makeScene();
        const geometry = new THREE.SphereGeometry(50, 32, 32);
        const texture = new THREE.TextureLoader().load('./images/meadow.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        addScene(elem, (time, rect) => {
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            controls.update();
            renderer.render(scene, camera);
        });
    }

    {
        const elem = document.querySelector('#screen2');
        const { scene, camera, controls } = makeScene();
        const geometry = new THREE.SphereGeometry(50, 32, 32);
        const texture = new THREE.TextureLoader().load('./images/meadow.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        addScene(elem, (time, rect) => {
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            controls.update();
            renderer.render(scene, camera);
        });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const clearColor = new THREE.Color('#000');
    function render(time) {
        time *= 0.001;

        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(false);
        renderer.setClearColor(clearColor, 0);
        renderer.clear(true, true);
        renderer.setScissorTest(true);

        for (const { elem, fn } of sceneElements) {
            // get the viewport relative position opf this element
            const rect = elem.getBoundingClientRect();
            const { left, right, top, bottom, width, height } = rect;

            const isOffscreen =
                bottom < 0 ||
                top > renderer.domElement.clientHeight ||
                right < 0 ||
                left > renderer.domElement.clientWidth;

            if (!isOffscreen) {
                const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
                renderer.setScissor(left, positiveYUpBottom, width, height);
                renderer.setViewport(left, positiveYUpBottom, width, height);

                fn(time, rect);
            }
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();