'use client'
import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF , Plane} from '@react-three/drei';
import { NotEqualStencilFunc } from 'three';
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader.js';
import { EquirectangularReflectionMapping } from 'three';
import * as THREE from 'three'; 

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
    const { scene, camera } = useThree(); // Obtener la escena del Canvas
  
    useEffect(() => {
      const exrLoader = new EXRLoader();
      exrLoader.load('/fondo-anillos.exr', (texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        scene.environment = texture; // Asignar textura de entorno
        scene.background = texture;    // Asignar textura de fondo
        texture.repeat.set(0.5, 0.5); // Ajusta la repetición de la textura
        texture.wrapS = THREE.RepeatWrapping; // Repite la textura en el eje S
        texture.wrapT = THREE.RepeatWrapping; // Repite la textura en el eje T
        if (scene) {
          const bbox = new THREE.Box3().setFromObject(scene);
          const center = bbox.getCenter(new THREE.Vector3());
          const size = bbox.getSize(new THREE.Vector3()).length();
      
          // Ajustar la posición de la cámara según el tamaño del modelo
          camera.position.set(center.x, center.y + size / 4, center.z + size); // Acércate al modelo
          camera.lookAt(center);
    
          // Cambiar el FOV de la cámara si es necesario
          camera.fov = 30; // Ajustar el campo de visión
          camera.updateProjectionMatrix();
        }
      
      }, undefined, (error) => {
        console.error('Error loading HDRI:', error); // Manejar errores de carga
      });
    }, [scene,camera]);
  
    return null; // No se necesita renderizar nada
  };


const Render = () => {
  return (
    <Canvas camera={{ position: [-4, 2, 7] , rotation: [-Math.PI / 2, -3, 1]} } className='mainScene' >
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
          minPolarAngle={0} // Puedes ajustar estos valores
      />
      <HDRIBackground />
    </Canvas>
  );
};

export default Render;
