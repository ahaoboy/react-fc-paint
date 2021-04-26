import React, { useEffect, useRef } from 'react';
import App from '../src/index';
import './index.css';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = () => {
  const ref = useRef<any>();
  useEffect(() => {
    document.addEventListener('click', () => {
      // console.error(ref.current.getCanvas?.());
    });
  }, []);

  return (
    <div className="default-wrap">
      <img
        src="https://oscimg.oschina.net/oscnet/8e9422b5-c640-4d18-a7fa-209f3b17ec5b.jpg"
        alt=""
      />
      <App ref={ref} className="app-wrap" bgColor="rgba(0,0,0,0)" />
    </div>
  );
};
