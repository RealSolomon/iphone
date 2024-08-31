import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import * as THREE from 'three';

export interface IProps {
  index: number;
  groupRef: MutableRefObject<THREE.Group<THREE.Object3DEventMap>>;
  gsapType: string;
  controlRef: MutableRefObject<undefined>;
  setRotationState: Dispatch<SetStateAction<number>>;
  item: IModel;
  size: string;
}

interface IModel {
  title: string;
  color: string[];
  img: any;
}
