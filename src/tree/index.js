import { useEffect, useState, useRef } from 'react';
import './index.css';
import initialData from './data';

export default function Tree() {
  const [data, setData] = useState(initialData);
  const [tree, setTree] = useState([]);
  const [sorted, setSorted] = useState(false);

  const ref1 = useRef();
  const ref2 = useRef();

  const generateNewTree = (newData) => {
    const newTree = [];
    const generateTree = (inputArr, level) => {
      if (inputArr.length === 0) return;
      let name;
      inputArr.forEach((el) => {
        name = el.name;
        newTree.push({
          level,
          name,
        });
        generateTree(el.children, level + 1);
      });
      newTree.push({
        levelEnd: true,
        level,
        name,
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

  const findNestedArr = (arr, level, item) => {
    if (arr.length !== 0 && level <= item.level) {
      for (const el of arr) {
        if (level === item.level && el.name === item.name) {
          return arr;
        }
        const result = findNestedArr(el.children, level + 1, item);
        if (result) return result;
      }
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter') {
      const foundArr = findNestedArr(data, 0, item);
      if (foundArr) {
        foundArr.push({
          name: e.target.value,
          children: [],
        });
        setData(data);
        generateNewTree(data);
      }
      e.target.value = '';
    }
  };

  const handleDelete = (item) => {
    const foundArr = findNestedArr(data, 0, item);
    if (foundArr) {
      const ind = foundArr.findIndex((obj) => obj.name === item.name);
      foundArr.splice(ind, 1);
      setData(data);
      generateNewTree(data);
    }
  };

  const sortTree = (arr) => {
    const recursiveSort = (inputArr) => {
      if (arr.length === 0) return;
      inputArr.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      for (const el of inputArr) {
        recursiveSort(el.children);
      }
    };

    recursiveSort(arr);
    generateNewTree(arr, 0);
    setSorted(true);
  };

  const toggle = () => {
    if (sorted) {
      generateNewTree(data, 0);
      setSorted(false);
    } else {
      sortTree(JSON.parse(JSON.stringify(data)));
    }
  };

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

      <button onClick={toggle}>Toggle</button>

      {tree.map((item, index) => {
        // let insert = '';
        // for (let i = 0; i < item.level; i++) {
        //   insert += '.';
        // }
        // const modifiedName = item.name[0] + insert + item.name.substring(1);
        const modifiedName = item.name;
        return (
          <div key={index}>
            {!item.levelEnd && (
              <p className={`level${item.level}`}>
                {modifiedName}
                {` `}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(item)}
                >
                  ❌
                </span>
              </p>
            )}
            {item.levelEnd && (
              <div className={`level${item.level}`}>
                <input type="text" onKeyDown={(e) => handleKeyDown(e, item)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
