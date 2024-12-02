import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { GUI } from 'lil-gui'



// GUI
const gui = new GUI()

const y_value = 5 + Math.sqrt(3)

const options = {
    totalPoints: 100000,
    partitions: 2,
    roofDivisions: 1,
    floorDivisions: 2
}

let pointsGeometry = null
const pointsMaterial = new THREE.PointsMaterial({
    size: 0.001
})
let particles = null
let randomPoint = null


const A = [0, y_value, 0]
const B = [0, 0, 5]
const C = [-5, 0, 0]
const D = [0, 0, -5]

const E = [0, 5, 0]
const F = [0, 5, 5]
const G = [-5, 5, 0]
const H = [0, 5, -5]



// Base Scene
const scene = new THREE.Scene()

const sphereGem = new THREE.SphereGeometry(0.1, 16, 16)
const sphereMat = new THREE.MeshBasicMaterial()


const sphere1 = new THREE.Mesh(sphereGem, sphereMat)
sphere1.position.set(A[0], A[1], A[2])

const sphere2 = new THREE.Mesh(sphereGem, sphereMat)
sphere2.position.set(B[0], B[1], B[2])

const sphere3 = new THREE.Mesh(sphereGem, sphereMat)
sphere3.position.set(C[0], C[1], C[2])


const createPoints = (pointsArr) => {

    roofDivide()
    floorDivide()
    const startingPoint = [Math.random() * 5, Math.random() * 5, Math.random() * 5]
    randomPoint = new THREE.Mesh(sphereGem, sphereMat)
    randomPoint.position.set(startingPoint[0], startingPoint[1], startingPoint[2])
    // scene.add(randomPoint)


    const coords = generatingCoords(pointsArr, startingPoint)

    pointsGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(coords.flat())
    
    const positionAttribute = new THREE.BufferAttribute(positions, 3)
    pointsGeometry.setAttribute('position', positionAttribute)
    particles = new THREE.Points(pointsGeometry, pointsMaterial)
    // particles.scale.set(options.partitions, options.partitions, options.partitions)
    scene.add(particles)
    // console.log(allSpheres)
    
}

const generatingCoords = (pointsArr, currentPoint) => {

    // let startPoint = currentPoint
    const coords = []
    
    
    for(let i = 0; i < options.totalPoints; i++){
        
        const randomPoint = pointsArr[Math.floor(Math.random() * pointsArr.length)]
        const point = [randomPoint.position.x,randomPoint.position.y, randomPoint.position.z]
        const midPoint = [(point[0] + currentPoint[0]) / options.partitions, (point[1] + currentPoint[1]) / options.partitions, (point[2] + currentPoint[2]) / options.partitions]
        // const sphere = new THREE.Mesh(sphereGem, sphereMat)
        // sphere.position.set(midPoint[0], midPoint[1], midPoint[2])
        // scene.add(sphere)
        coords.push(midPoint)
        currentPoint = midPoint
    }

    return coords

    // generatingCoords(A, B, C, midPoint, points, totalPoints)
}

let groundPoints = null
let roofPoints = null
let allSpheres = []


const floorDivide = () => {
    const length = 5
    const partition = options.floorDivisions
    const angle = (2 * Math.PI) / partition
    
    for(let i = 1; i <= partition; i++){

        const x1 = Math.cos(angle * i) * length
        const z1 = Math.sin(angle * i) * length 

        
        groundPoints = new THREE.Mesh(
            sphereGem, sphereMat
        )
        groundPoints.position.set(x1, 0 ,z1)
        
        allSpheres.push(groundPoints)
        // console.log(x1, z1)
    }
    for(const sphere of allSpheres){
        scene.add(sphere)
    }
}

const roofDivide = () => {
    if(options.roofDivisions == 1){
        allSpheres.push(sphere1)
        return
    }
    const length = 5
    const partition = options.roofDivisions
    const angle = (2 * Math.PI) / partition
    
    for(let i = 1; i <= partition; i++){

        const x1 = Math.cos(angle * i) * length
        const z1 = Math.sin(angle * i) * length

        
        roofPoints = new THREE.Mesh(
            sphereGem, sphereMat
        )
        roofPoints.position.set(x1, y_value ,z1)
        
        allSpheres.push(roofPoints)
        // console.log(x1, z1)
    }
    for(const sphere of allSpheres){
        scene.add(sphere)
    }
}







const pointsArr = [A, B, C, D, E]

createPoints(allSpheres)

gui.add(options, 'totalPoints').min(1000).max(1000000).step(100).onChange(
    () => {
        if(pointsGeometry != null){

            pointsGeometry.dispose()
            scene.remove(particles, randomPoint)
        }
        createPoints(allSpheres)
    }
)
gui.add(options, 'partitions').min(2).max(10).step(1).onChange(
    () => {
        if(pointsGeometry != null){

            pointsGeometry.dispose()
            scene.remove(particles, randomPoint)
        }
        if(allSpheres.length != null){
            // sphereGem.dispose()
            scene.remove(... allSpheres)
            allSpheres = []
        }
        createPoints(allSpheres)
    }
)
gui.add(options, 'roofDivisions').min(1).max(10).step(1).onChange(
    () => {
        if(pointsGeometry != null){

            pointsGeometry.dispose()
            scene.remove(particles, randomPoint)
        }
        if(allSpheres.length != null){
            sphereGem.dispose()
            scene.remove(... allSpheres)
            allSpheres = []
        }
        createPoints(allSpheres)
    }
)
gui.add(options, 'floorDivisions').min(2).max(10).step(1).onChange(
    () => {
        if(pointsGeometry != null){

            pointsGeometry.dispose()
            scene.remove(particles, randomPoint)
        }
        if(allSpheres.length != null){
            sphereGem.dispose()
            scene.remove(... allSpheres)
            allSpheres = []
        }
        createPoints(allSpheres)
    }
)




// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('.webgl')


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(8, 8, 8)
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = true
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Resizing
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
})







window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        }
        else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})





// Axes Helper
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

// Time
let time = new THREE.Clock()
let elapsedTime = 0

window.addEventListener('keypress', (event) => {

    if(event.key == 'm'){

        // Ensure the scene is rendered before capturing
        const width = 3840;
        const height = 2160;

        renderer.setSize(width, height);
        renderer.render(scene, camera);
        
        // Capture the image data
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // Create an anchor element and set its href attribute to the data URL
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'rendered_image.png';
        
        // Programmatically click the anchor to trigger the download
        link.click();
    }

    else if(event.key == 'q'){
        const width = 3840;
        const height = 2160;
        // const width = 7680;
        // const height = 4320;
        renderer.setSize(width, height);
    }

    else if(event.key == ' '){
        time = new THREE.Clock()
        elapsedTime = 0
    }
})

const tick = () => {
    elapsedTime = time.getElapsedTime()

    



    controls.update()


    renderer.render(scene, camera)


    // Next frame request
    requestAnimationFrame(tick)
}

tick()