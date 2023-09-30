const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);

    // Dimensiones de las paredes y espacio entre ellas
    const wallWidth = 0.2;

    const spaceBetweenWalls = 60;

    // Crear una cámara tipo ArcRotateCamera para la vista desde arriba
    const camera = new BABYLON.ArcRotateCamera("camera2", Math.PI / 2, Math.PI / 2, 20, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);



    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light",
        new BABYLON.Vector3(0, 1, 0), scene);
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7;

    var bodegaWidth = 400;
    var bodegaHeight = 50;
    var bodegaDepth = 300 ;


    // Crear el suelo interior
    var floor = BABYLON.MeshBuilder.CreateGround("floor", { width:bodegaWidth , height: bodegaDepth }, scene);
    floor.position.y = bodegaHeight /-2;




  


    // Pared izquierda
    var leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: 1, height: bodegaHeight, depth: bodegaDepth }, scene);
    leftWall.position.x = -bodegaWidth / 2;
    

    // Pared derecha
    var rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: 1, height: bodegaHeight, depth: bodegaDepth }, scene);
    rightWall.position.x = bodegaWidth / 2;

    // Pared trasera
    var backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: bodegaWidth, height: bodegaHeight, depth: 1 }, scene);
    backWall.position.z = -bodegaDepth / 2;

    // Pared frontal (opcional)
    var frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { width: bodegaWidth, height: bodegaHeight, depth: 1 }, scene);
    frontWall.position.z = bodegaDepth / 2;



    // Cantidad de pasillos
var cantidadDePasillos = 5;

// Ancho y profundidad de la bodega
var bodegaWidth = 400;
var bodegaDepth = 300;

// Ancho y profundidad de los pasillos (ajusta según tus necesidades)
var anchoDelPasillo = 10;
var profundidadDelPasillo = 175;

// Espaciado entre los pasillos
var espaciadoEntrePasillos = (bodegaWidth - (cantidadDePasillos * anchoDelPasillo)) / (cantidadDePasillos + 1);

// Altura de los pasillos
var alturaDeLosPasillos = 5; // Ajusta según tu diseño

// Array para almacenar los pasillos
var pasillos = [];

// Crear y posicionar los pasillos
for (var i = 0; i < cantidadDePasillos; i++) {
    var pasillo = BABYLON.MeshBuilder.CreateBox("pasillo" + (i + 1), {
        width: anchoDelPasillo,
        height: alturaDeLosPasillos,
        depth: profundidadDelPasillo
    }, scene);

    // Posicionar el pasillo en la parte superior de la bodega
    pasillo.position.x = (i + 1) * espaciadoEntrePasillos + (i * anchoDelPasillo) - bodegaWidth / 2 + anchoDelPasillo / 2;
    pasillo.position.y = bodegaHeight / -2 + alturaDeLosPasillos / 2; // Ajusta la altura según tu diseño
    pasillo.position.z = -2; // Puedes ajustar la posición en el eje z según tu diseño

    // Asignar un material a los pasillos si lo deseas
    var pasilloMaterial = new BABYLON.StandardMaterial("pasilloMaterial" + (i + 1), scene);
    pasilloMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Color gris para los pasillos
    pasillo.material = pasilloMaterial;

    // Agregar el pasillo al array
    pasillos.push(pasillo);
}


// Función para crear 5 layouts uno sobre otro
function crearLayoutAlLadoDelPasillo(pasillo) {
    // Dimensiones del layout
    var layoutWidth = anchoDelPasillo + 8; // Ajusta el ancho según tu diseño
    var layoutDepth = profundidadDelPasillo - 2; // Ajusta la profundidad según tu diseño

    // Colores para las secciones del layout
    var colores = [
        new BABYLON.Color3(0.2, 0.6, 0.2), // Verde
        new BABYLON.Color3(0.6, 0.2, 0.2), // Rojo
        new BABYLON.Color3(0.2, 0.2, 0.6), // Azul
        new BABYLON.Color3(0.6, 0.6, 0.2), // Amarillo
        new BABYLON.Color3(0.2, 0.6, 0.6)  // Cian
    ];

    var colorIndex = 0; // Índice para alternar colores
    var layoutGroup = new BABYLON.Mesh("layoutGroup", scene); // Grupo para contener las secciones

    for (var i = 0; i < 5; i++) {
        // Crear una sección del layout como un cubo
        var layoutSection = BABYLON.MeshBuilder.CreateBox("layoutSection", {
            width: layoutWidth,
            height: 10, // Altura fija de 10 unidades
            depth: layoutDepth
        }, scene);

        // Posicionar la sección del layout al lado del pasillo
        layoutSection.position.x = pasillo.position.x + (anchoDelPasillo / 2) + (layoutWidth / 2);
        layoutSection.position.y = 0 + i * 10; // Posición vertical de las secciones, comenzando desde el suelo (ajustado a -2)
        layoutSection.position.z = 0; // Puedes ajustar la posición en el eje z

        // Asignar un material con el color correspondiente a la sección del layout
        var layoutMaterial = new BABYLON.StandardMaterial("layoutMaterial", scene);
        layoutMaterial.diffuseColor = colores[colorIndex]; // Asignar el color de la lista
        layoutSection.material = layoutMaterial;

        // Cambiar al siguiente color en la lista (cíclicamente)
        colorIndex = (colorIndex + 1) % colores.length;

        // Agregar la sección del layout al grupo
        layoutSection.parent = layoutGroup;
    }

    return layoutGroup;
}

// Crear los 5 layouts uno sobre otro al lado de cada pasillo
for (var i = 0; i < cantidadDePasillos; i++) {
    var pasillo = pasillos[i];

    // Crear los 5 layouts uno sobre otro al lado del pasillo
    var layouts = crearLayoutAlLadoDelPasillo(pasillo);
}


    var wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6); // Color gris para las paredes

    leftWall.material = wallMaterial;
    rightWall.material = wallMaterial;
    backWall.material = wallMaterial;
    frontWall.material = wallMaterial; // Si se creó la pared frontal




// Obtener la altura actual del suelo (floor)
var currentFloorHeight = floor.position.y;

// Ajustar la posición vertical de todos los objetos para que estén al nivel 0
floor.translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);
leftWall.translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);
rightWall.translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);
backWall.translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);
frontWall.translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);

// Ajustar la posición vertical de los pasillos
for (var i = 0; i < cantidadDePasillos; i++) {
    pasillos[i].translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);
}

// Ajustar la posición vertical de los layouts
for (var i = 0; i < cantidadDePasillos; i++) {
    var pasillo = pasillos[i];
    var layouts = crearLayoutAlLadoDelPasillo(pasillo);

    layouts.getChildren().forEach(function (layoutSection) {
        layoutSection.translate(BABYLON.Axis.Y, -currentFloorHeight, BABYLON.Space.LOCAL);
    });
}

    return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});