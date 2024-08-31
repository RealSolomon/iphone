import React, { FC, Suspense } from 'react';
import { IProps } from './types';
import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei';
import Lights from '../Lights';
import IphoneModel from '../IphoneModel';

import * as THREE from 'three';
import Loader from '../Loader';

const ModelView: FC<IProps> = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  item,
  size,
}) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambiebt Light */}
      <ambientLight intensity={0.3} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      {/* Lights */}
      <Lights />

      <OrbitControls
        makeDefault
        // @ts-ignore
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        // @ts-ignore
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />
      <group
        ref={groupRef}
        name={`${index === 1 ? 'small' : 'large'}`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          <IphoneModel
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;
