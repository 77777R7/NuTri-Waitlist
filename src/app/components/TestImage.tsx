import React from 'react';
import img from '../../imports/image.png';

export function TestImage() {
  console.log("Image URL:", img);
  return <img src={img} alt="test" />;
}