import { useEffect, useState, useRef } from 'react';
import './index.css';
import initialData from './data';

export default function Tree() {
  const [data, setData] = useState(initialData);
  const [tree, setTree] = useState([]);

  const ref1 = useRef();
  const ref2 = useRef();

  const generateNewTree = (newData) => {
    const newTree = [];
    const generateTree = (inputArr, level) => {
      if (inputArr.length === 0) return;
      inputArr.forEach((el) => {
        newTree.push({
          level,
          name: el.name,
        });
        generateTree(el.children, level + 1);
      });
    };
    generateTree(newData, 0);
    setTree(newTree);
  };

  useEffect(() => {
    // const position1 = ref1.current.getBoundingClientRect();
    // const position2 = ref2.current.getBoundingClientRect();
    // console.log('position1:', position1.x);
    // console.log('position2:', position2.x);

    generateNewTree(data);
  }, []);

  return (
    <div className="tree">
      {/* <p className="level0">root</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span ref={ref1}>ant</span></p>
      <p className="level1">
        <span ref={ref2}>ant</span>
      </p>
      <p className="level1">ant</p>
      <p className="level1">bear</p>
      <p className="level2">cat</p>
      <p className="level2">dog</p>
      <p className="level3">elephant</p>
      <p className="level1">frog</p> */}

      {tree.reverse().map((item, index) => (
        <p key={index} className={`level${item.level}`}>
          {item.name}
        </p>
      ))}
    </div>
  );
}
