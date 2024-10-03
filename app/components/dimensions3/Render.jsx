'use client'
import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF , Plane} from '@react-three/drei';
import { NotEqualStencilFunc } from 'three';
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader.js';
import { EquirectangularReflectionMapping, Scene } from 'three';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const Piso = () => {
  return (
    <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <meshStandardMaterial color="gray" />
    </Plane>
  );
};



  const HDRIBackground = () => {
    const { scene } = useThree(); // Obtener la escena del Canvas
  
    useEffect(() => {
      const exrLoader = new EXRLoader();
      exrLoader.load('/fondo-anillos.exr', (texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        scene.environment = texture; // Asignar textura de entorno
        scene.background = texture;    // Asignar textura de fondo
      }, undefined, (error) => {
        console.error('Error loading HDRI:', error); // Manejar errores de carga
      });
    }, [scene]);
  
    return null; // No se necesita renderizar nada
  };

const Render = () => {
  return (
    <Canvas camera={{ position: [-4, 2, 7] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 0, 5]} />
      <directionalLight color="red" position={[0, 1, 5]} />

      <Suspense fallback={null}>
        <Model url="/chubaca.glb" />
      </Suspense>

      <Suspense fallback={NotEqualStencilFunc}>
        <Model url="/anillos.glb" />
      </Suspense>

      <Piso />
      <OrbitControls  
          enableZoom={true} 
          enablePan={true} 
          maxPolarAngle={Math.PI / 2} 
      />

      {/* Cargar el fondo HDRI */}
      <HDRIBackground />
    </Canvas>
  );
};

export default Render;
