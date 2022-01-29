import { useEffect, useRef } from 'react';
import './index.css';

export default function Tree() {
  const ref1 = useRef();
  const ref2 = useRef();

  useEffect(() => {
    const position1 = ref1.current.getBoundingClientRect();
    const position2 = ref2.current.getBoundingClientRect();
    console.log('position1:', position1.x);
    console.log('position2:', position2.x);
  }, []);

  return (
    <div className="tree">
      <p className="level0">root</p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;<span ref={ref1}>ant</span>
      </p>
      <p className="level1">
        <span ref={ref2}>ant</span>
      </p>
      <p className="level1">bear</p>
      <p className="level2">cat</p>
      <p className="level2">dog</p>
      <p className="level3">elephant</p>
      <p className="level1">frog</p>
    </div>
  );
}
